export interface ImporterTelemetry {
  active_rfqs_count: number;
  sealed_quotes_received: number;
  avg_bid_response_hours: number;
}

export interface ImporterRfqItem {
  id: string;
  rfq_number: string;
  commodity_en: string;
  commodity_ar: string;
  variety: string;
  quantity_mt: number;
  packaging_spec: string;
  target_port: string;
  incoterm_preference: string;
  required_certificates: string[];
  status: RfqStatus;
  /** Set by admin moderation (US-ADM-04) when status is REJECTED. */
  rejection_reason?: string;
  deadline_date: string;
  bids_count: number;
  published_at: string;
}

/** PENDING_REVIEW / REJECTED come from admin screening before an RFQ is broadcast (US-ADM-04). */
export type RfqStatus =
  | 'PENDING_REVIEW'
  | 'REJECTED'
  | 'RECEIVING_QUOTES'
  | 'UNDER_EVALUATION'
  | 'CONTRACT_AWARDED'
  | 'EXPIRED';

/** Certificates named in the SRS (FR-CRT-001): the structured list an RFQ can require. */
export const RFQ_CERTIFICATES = ['ISO 22000', 'GlobalG.A.P.', 'BRC', 'Halal', 'FDA', 'Organic'] as const;

/** FR-RFQ-002 broadcast modes. */
export type BroadcastMode = 'CATEGORY' | 'DIRECT' | 'AUTO';

export interface NewRfqInput {
  category_id: number;
  commodity: string;
  quantity_mt: number;
  packaging_spec: string;
  specifications: string;
  destination_country: string;
  destination_port: string;
  incoterm: 'FOB' | 'CIF' | 'CFR';
  delivery_from: string;
  delivery_to: string;
  quote_deadline: string;
  required_certificates: string[];
  attachment_names: string[];
  broadcast_mode: BroadcastMode;
  direct_exporter_id?: string;
}

/** Quotes must close before delivery starts, and the window must run forward. Dates are ISO yyyy-mm-dd. */
export function validateRfqDates(
  quoteDeadline: string,
  deliveryFrom: string,
  deliveryTo: string,
  today: string
): { en: string; ar: string } | null {
  if (!quoteDeadline || !deliveryFrom || !deliveryTo) {
    return { en: 'Fill in all three dates.', ar: 'أدخل التواريخ الثلاثة.' };
  }
  if (quoteDeadline < today) {
    return { en: 'Quote deadline cannot be in the past.', ar: 'لا يمكن أن يكون آخر موعد للعروض في الماضي.' };
  }
  if (deliveryFrom <= quoteDeadline) {
    return { en: 'Delivery must start after the quote deadline.', ar: 'يجب أن يبدأ التسليم بعد آخر موعد للعروض.' };
  }
  if (deliveryTo < deliveryFrom) {
    return { en: 'Delivery window end is before its start.', ar: 'نهاية نافذة التسليم قبل بدايتها.' };
  }
  return null;
}

export type EnquiryKind = 'ENQUIRY' | 'VIDEO_VERIFICATION';

export interface ImporterNotification {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  href: string;
  unread: boolean;
}

export interface SealedQuotation {
  id: string;
  rfq_id: string;
  supplier_id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_location: string;
  supplier_cr: string;
  unit_price: number;
  currency: 'USD' | 'EUR';
  incoterm: 'FOB' | 'CIF' | 'CFR';
  port_of_loading: string;
  destination_port: string;
  lead_time_days: number;
  packaging: string;
  payment_terms: string;
  certificates: string[];
  highlight_badge?: string;
  aweta_graded: boolean;
  cold_storage_precooled: boolean;
  status: 'PENDING_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'DECLINED';
  valid_until: string;
}

export interface SupplierContact {
  contact_person: string;
  phone: string;
  whatsapp: string;
  email: string;
}

// Kept out of SealedQuotation so contacts never reach the client before acceptance (FR-RFQ-004/005).
const SUPPLIER_CONTACTS: Record<string, SupplierContact> = {
  'c-nileagro-01': {
    contact_person: 'Eng. Tarek Mansour (Export Director)',
    phone: '+20 100 892 1144',
    whatsapp: '+20 100 892 1144',
    email: 'tarek.mansour@nileagro-eg.com',
  },
  'c-delta-02': {
    contact_person: 'Mona Abdelaziz (Sales Manager)',
    phone: '+20 106 455 2031',
    whatsapp: '+20 106 455 2031',
    email: 'sales@deltacitrus-coop.com',
  },
  'c-ahram-03': {
    contact_person: 'Hassan El-Ghazali (Commercial Head)',
    phone: '+20 122 341 9901',
    whatsapp: '+20 122 341 9901',
    email: 'export@ahramdelta-agri.com',
  },
  'c-med-04': {
    contact_person: 'Dr. Nader Soliman (QA & Trade)',
    phone: '+20 111 602 8830',
    whatsapp: '+20 111 602 8830',
    email: 'sales@deltamed-herbs.com',
  },
};

/** Accepting one quote closes its RFQ: the winner becomes ACCEPTED, competing bids DECLINED. */
export function applyAcceptance(quotes: SealedQuotation[], accepted: SealedQuotation): SealedQuotation[] {
  return quotes.map((q) =>
    q.id === accepted.id
      ? { ...q, status: 'ACCEPTED' }
      : q.rfq_id === accepted.rfq_id
      ? { ...q, status: 'DECLINED' }
      : q
  );
}

export function formatPrice(q: Pick<SealedQuotation, 'unit_price' | 'currency'>): string {
  return new Intl.NumberFormat('en', { style: 'currency', currency: q.currency, maximumFractionDigits: 0 }).format(
    q.unit_price
  );
}

/** FR-SEC-001: max contact reveals per importer per day. */
export const REVEAL_DAILY_LIMIT = 50;

export interface RevealLedger {
  date: string;
  quoteIds: string[];
}

export class RevealLimitError extends Error {}

/** Re-opening an already revealed contact is free; each new contact counts once per day. */
export function recordReveal(ledger: RevealLedger | null, quoteId: string, today: string): RevealLedger {
  const current = ledger?.date === today ? ledger : { date: today, quoteIds: [] };
  if (current.quoteIds.includes(quoteId)) return current;
  if (current.quoteIds.length >= REVEAL_DAILY_LIMIT) throw new RevealLimitError('Daily contact reveal limit reached');
  return { date: today, quoteIds: [...current.quoteIds, quoteId] };
}

const REVEAL_STORAGE_KEY = 'om365_contact_reveals';

// ponytail: per-browser counter; move to server-side rate limiting (Module 4 middleware) once Supabase auth is live.
export function readRevealLedger(): RevealLedger | null {
  try {
    return JSON.parse(localStorage.getItem(REVEAL_STORAGE_KEY) ?? 'null');
  } catch {
    return null;
  }
}

const today = () => new Date().toISOString().slice(0, 10);

export function revealsUsedToday(): number {
  const ledger = readRevealLedger();
  return ledger?.date === today() ? ledger.quoteIds.length : 0;
}

function writeRevealLedger(ledger: RevealLedger) {
  try {
    localStorage.setItem(REVEAL_STORAGE_KEY, JSON.stringify(ledger));
  } catch {}
}

// RFQs created this session (mock persistence until the rfqs table is wired).
const createdRfqs: ImporterRfqItem[] = [];

export function whatsappLink(contact: SupplierContact, rfqRef: string): string {
  const text = `Hello ${contact.contact_person}, I accepted your quotation for ${rfqRef} on Market 365 and would like to finalise the deal.`;
  return `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}

class ImporterService {
  async getTelemetry(importerId = 'u-importer-euro'): Promise<ImporterTelemetry> {
    return {
      active_rfqs_count: 4,
      sealed_quotes_received: 14,
      avg_bid_response_hours: 18,
    };
  }

  async getActiveRfqs(importerId = 'u-importer-euro'): Promise<ImporterRfqItem[]> {
    return [
      ...createdRfqs,
      {
        id: 'rfq-2026-005',
        rfq_number: 'RFQ-EG-2026-1302',
        commodity_en: 'Extra Virgin Olive Oil',
        commodity_ar: 'زيت زيتون بكر ممتاز',
        variety: 'Koroneiki / Acidity < 0.8%',
        quantity_mt: 40,
        packaging_spec: '1L tins, 12 per carton',
        target_port: 'Port of Rotterdam (Netherlands)',
        incoterm_preference: 'CIF Rotterdam',
        required_certificates: ['ISO 22000', 'Organic'],
        status: 'PENDING_REVIEW',
        deadline_date: '2026-10-20',
        bids_count: 0,
        published_at: 'Today',
      },
      {
        id: 'rfq-2026-006',
        rfq_number: 'RFQ-EG-2026-1288',
        commodity_en: 'Medjool Dates',
        commodity_ar: 'تمور مجدول',
        variety: 'Jumbo grade',
        quantity_mt: 5,
        packaging_spec: '5kg cartons',
        target_port: 'Hamburg Port (Germany)',
        incoterm_preference: 'FOB Alexandria',
        required_certificates: ['Halal'],
        status: 'REJECTED',
        rejection_reason: 'Incomplete specification: moisture and calibre ranges are missing.',
        deadline_date: '2026-10-10',
        bids_count: 0,
        published_at: '3 days ago',
      },
      {
        id: 'rfq-2026-001',
        rfq_number: 'RFQ-EG-2026-0805',
        commodity_en: 'Valencia Oranges · Grade A',
        commodity_ar: 'برتقال فالنسيا تصديري فرز أول',
        variety: 'Valencia Late / Calibers 56-80',
        quantity_mt: 120,
        packaging_spec: '15kg telescopic export cartons, 80/pallet',
        target_port: 'Port of Rotterdam (Netherlands)',
        incoterm_preference: 'CIF Rotterdam',
        required_certificates: ['GlobalG.A.P. v6.0', 'BRCGS Food', 'ISO 22000'],
        status: 'RECEIVING_QUOTES',
        deadline_date: '2026-04-15',
        bids_count: 5,
        published_at: '2 days ago',
      },
      {
        id: 'rfq-2026-002',
        rfq_number: 'RFQ-EG-2026-0703',
        commodity_en: 'Golden Spring Onions',
        commodity_ar: 'بصل ذهبي مصري جاف',
        variety: 'Golden Giza 6 / Size 60-80mm',
        quantity_mt: 75,
        packaging_spec: '25kg red mesh bags on Euro pallets',
        target_port: 'Hamburg Port (Germany)',
        incoterm_preference: 'FOB Alexandria',
        required_certificates: ['GlobalG.A.P.', 'ISO 9001'],
        status: 'UNDER_EVALUATION',
        deadline_date: '2026-04-05',
        bids_count: 4,
        published_at: '5 days ago',
      },
      {
        id: 'rfq-2026-003',
        rfq_number: 'RFQ-EG-2026-1211',
        commodity_en: 'Organic Chamomile & Mint Herbs',
        commodity_ar: 'بابونج ونعناع عضوي مجفف',
        variety: 'Matricaria Chamomilla / Fine cut',
        quantity_mt: 20,
        packaging_spec: '20kg multi-wall kraft paper with inner liner',
        target_port: 'Felixstowe (United Kingdom)',
        incoterm_preference: 'CIF Felixstowe',
        required_certificates: ['EU Organic', 'USDA Organic', 'Halal'],
        status: 'RECEIVING_QUOTES',
        deadline_date: '2026-04-20',
        bids_count: 3,
        published_at: 'Yesterday',
      },
      {
        id: 'rfq-2026-004',
        rfq_number: 'RFQ-EG-2026-0811',
        commodity_en: 'IQF Frozen Strawberries',
        commodity_ar: 'فراولة مجمدة نصفين فرز تصدير',
        variety: 'Festival / Fortuna Calibrated',
        quantity_mt: 50,
        packaging_spec: '10kg corrugated cartons with blue LDPE bag',
        target_port: 'Jeddah Islamic Port (KSA)',
        incoterm_preference: 'CFR Jeddah',
        required_certificates: ['ISO 22000', 'Halal', 'HACCP'],
        status: 'CONTRACT_AWARDED',
        deadline_date: '2026-03-25',
        bids_count: 2,
        published_at: '2 weeks ago',
      },
    ];
  }

  async getSealedQuotes(rfqId?: string): Promise<SealedQuotation[]> {
    const quotes: SealedQuotation[] = [
      {
        id: 'quote-nile-01',
        rfq_id: 'rfq-2026-001',
        supplier_id: 'c-nileagro-01',
        supplier_name: 'Nile Agro Export Industries',
        supplier_slug: 'nile-agro-export',
        supplier_location: 'Nubaria · Al-Beheira',
        supplier_cr: 'CR-104928',
        currency: 'USD',
        unit_price: 685,
        incoterm: 'CIF',
        port_of_loading: 'Alexandria Port',
        destination_port: 'Rotterdam Port',
        lead_time_days: 10,
        packaging: '15kg telescopic carton · 80/pallet',
        payment_terms: '30% advance, 70% against Bill of Lading & SGS copy',
        certificates: ['GlobalG.A.P.', 'BRCGS Food A Grade', 'ISO 22000'],
        highlight_badge: 'BEST LANDED COST',
        aweta_graded: true,
        cold_storage_precooled: true,
        status: 'SHORTLISTED',
        valid_until: '2026-04-30',
      },
      {
        id: 'quote-delta-02',
        rfq_id: 'rfq-2026-001',
        supplier_id: 'c-delta-02',
        supplier_name: 'Delta Citrus Growers Cooperative',
        supplier_slug: 'delta-citrus-growers',
        supplier_location: 'Sadat City · Menofia',
        supplier_cr: 'CR-88401',
        currency: 'USD',
        unit_price: 710,
        incoterm: 'CIF',
        port_of_loading: 'Damietta Port',
        destination_port: 'Rotterdam Port',
        lead_time_days: 7,
        packaging: '15kg telescopic carton · 80/pallet',
        payment_terms: 'L/C at sight, 100% irrevocable confirmed',
        certificates: ['GlobalG.A.P.', 'ISO 9001', 'SMETA Audit'],
        highlight_badge: 'FASTEST DISPATCH',
        aweta_graded: true,
        cold_storage_precooled: true,
        status: 'PENDING_REVIEW',
        valid_until: '2026-04-25',
      },
      {
        id: 'quote-ahram-03',
        rfq_id: 'rfq-2026-002',
        supplier_id: 'c-ahram-03',
        supplier_name: 'Al-Ahram Delta Agri & Packhouse',
        supplier_slug: 'al-ahram-delta-agri',
        supplier_location: 'Belbeis · Al-Sharkia',
        supplier_cr: 'CR-55921',
        currency: 'USD',
        unit_price: 395,
        incoterm: 'FOB',
        port_of_loading: 'Alexandria Port',
        destination_port: 'Hamburg Port',
        lead_time_days: 12,
        packaging: '25kg red polypropylene mesh on Euro-pallets',
        payment_terms: '20% advance, 80% CAD via Commerzbank',
        certificates: ['GlobalG.A.P.', 'ISO 22000', 'Halal'],
        highlight_badge: 'VERIFIED CURED STOCK',
        aweta_graded: false,
        cold_storage_precooled: true,
        status: 'ACCEPTED',
        valid_until: '2026-04-20',
      },
      {
        id: 'quote-med-04',
        rfq_id: 'rfq-2026-003',
        supplier_id: 'c-med-04',
        supplier_name: 'Delta Med Herbs & Botanicals',
        supplier_slug: 'delta-med-herbs',
        supplier_location: 'Beni Suef Industrial Zone',
        supplier_cr: 'CR-43019',
        currency: 'EUR',
        unit_price: 1980,
        incoterm: 'CIF',
        port_of_loading: 'Sokhna Port',
        destination_port: 'Felixstowe Port',
        lead_time_days: 14,
        packaging: '20kg multi-wall sealed bags with moisture barrier',
        payment_terms: '30% advance, 70% against documents',
        certificates: ['EU Organic (CERES)', 'USDA Organic', 'ISO 22000', 'Halal'],
        highlight_badge: 'ORGANIC CERTIFIED',
        aweta_graded: false,
        cold_storage_precooled: true,
        status: 'PENDING_REVIEW',
        valid_until: '2026-05-10',
      },
    ];

    if (rfqId) {
      return quotes.filter((q) => q.rfq_id === rfqId);
    }
    return quotes;
  }

  /** FR-RFQ-005: accepting a quote unlocks the supplier's direct contact for offline deal closure. */
  async acceptQuote(quoteId: string): Promise<SupplierContact> {
    const quote = (await this.getSealedQuotes()).find((q) => q.id === quoteId);
    if (!quote) throw new Error(`Quote ${quoteId} not found`);
    if (quote.status === 'DECLINED') throw new Error(`Quote ${quoteId} was declined`);
    const contact = SUPPLIER_CONTACTS[quote.supplier_id];
    if (!contact) throw new Error(`No contact on file for ${quote.supplier_id}`);
    writeRevealLedger(recordReveal(readRevealLedger(), quoteId, today()));
    return contact;
  }

  /** FR-RFQ-001: new RFQs enter admin screening (PENDING_REVIEW) before being broadcast. */
  async createRfq(input: NewRfqInput): Promise<ImporterRfqItem> {
    const rfq: ImporterRfqItem = {
      id: `rfq-new-${Date.now()}`,
      rfq_number: `RFQ-EG-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      commodity_en: input.commodity,
      commodity_ar: input.commodity,
      variety: `Delivery ${input.delivery_from} → ${input.delivery_to}`,
      quantity_mt: input.quantity_mt,
      packaging_spec: input.packaging_spec,
      target_port: `${input.destination_port} (${input.destination_country})`,
      incoterm_preference: `${input.incoterm} ${input.destination_port}`,
      required_certificates: input.required_certificates,
      status: 'PENDING_REVIEW',
      deadline_date: input.quote_deadline,
      bids_count: 0,
      published_at: 'Just now',
    };
    createdRfqs.unshift(rfq);
    return rfq;
  }

  /** US-IMP-04: one-click enquiry or video verification request to a specific exporter. */
  async sendEnquiry(supplierId: string, kind: EnquiryKind, message: string): Promise<{ id: string }> {
    if (!message.trim()) throw new Error('Enquiry message is required');
    return { id: `enq-${supplierId}-${kind}-${Date.now()}` };
  }

  /** FR-NOT-001: dashboard alerts derived from quote arrivals and RFQ moderation outcomes. */
  async getNotifications(): Promise<ImporterNotification[]> {
    const [rfqs, quotes] = await Promise.all([this.getActiveRfqs(), this.getSealedQuotes()]);
    const rfqNumber = (id: string) => rfqs.find((r) => r.id === id)?.rfq_number ?? id;

    const quoteAlerts = quotes
      .filter((q) => q.status === 'PENDING_REVIEW')
      .map((q) => ({
        id: `quote-${q.id}`,
        titleEn: 'New sealed quote received',
        titleAr: 'وصول عرض سعر مغلق جديد',
        descEn: `${q.supplier_name} quoted ${formatPrice(q)}/MT ${q.incoterm} on ${rfqNumber(q.rfq_id)}.`,
        descAr: `قدمت ${q.supplier_name} عرضاً بسعر ${formatPrice(q)}/طن على ${rfqNumber(q.rfq_id)}.`,
        href: '/importer/quotes',
        unread: true,
      }));

    const moderationAlerts = rfqs
      .filter((r) => r.status === 'PENDING_REVIEW' || r.status === 'REJECTED')
      .map((r) =>
        r.status === 'REJECTED'
          ? {
              id: `rfq-${r.id}`,
              titleEn: `${r.rfq_number} rejected`,
              titleAr: `تم رفض الطلب ${r.rfq_number}`,
              descEn: r.rejection_reason ?? 'Rejected during admin screening.',
              descAr: r.rejection_reason ?? 'تم الرفض أثناء المراجعة الإدارية.',
              href: '/importer/rfqs',
              unread: true,
            }
          : {
              id: `rfq-${r.id}`,
              titleEn: `${r.rfq_number} awaiting screening`,
              titleAr: `الطلب ${r.rfq_number} قيد المراجعة`,
              descEn: 'It will be broadcast to matching exporters once approved.',
              descAr: 'سيتم إرساله للمصدرين المطابقين بعد الموافقة.',
              href: '/importer/rfqs',
              unread: false,
            }
      );

    return [...quoteAlerts, ...moderationAlerts];
  }
}

export const importerService = new ImporterService();
