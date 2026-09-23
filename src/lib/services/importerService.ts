import { fallbackCompanies, fallbackImporters, fallbackRfqs } from '@/lib/data/fallbackData';

export interface ImporterTelemetry {
  active_rfqs_count: number;
  sealed_quotes_received: number;
  evaluated_packhouses: number;
  contracted_volume_mt: number;
  avg_bid_response_hours: number;
  active_reefer_shipments: number;
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
  status: 'RECEIVING_QUOTES' | 'UNDER_EVALUATION' | 'CONTRACT_AWARDED' | 'EXPIRED';
  deadline_date: string;
  bids_count: number;
  published_at: string;
}

export interface SealedQuotation {
  id: string;
  rfq_id: string;
  supplier_id: string;
  supplier_name: string;
  supplier_slug: string;
  supplier_location: string;
  supplier_cr: string;
  price_per_mt_usd: number;
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

export interface VerifiedPackhouse {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  governorate: string;
  cr_number: string;
  primary_commodities: string[];
  certificates: string[];
  annual_capacity_mt: number;
  packhouse_area_sqm: number;
  sorting_lines: string;
  cold_storage_capacity_mt: number;
  destination_fits: string[];
  verified_since: string;
  contact_person: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface ShipmentTracking {
  id: string;
  booking_ref: string;
  container_number: string;
  commodity: string;
  supplier_name: string;
  quantity_mt: number;
  shipping_line: string;
  vessel_name: string;
  port_of_departure: string;
  port_of_arrival: string;
  set_temperature_c: number;
  status: 'LOADING_PACKHOUSE' | 'CUSTOMS_CLEARED' | 'ON_VESSEL' | 'ARRIVED_PORT' | 'RELEASED';
  etd: string;
  eta: string;
  bill_of_lading_number: string;
  phytosanitary_cert_number: string;
}

class ImporterService {
  async getTelemetry(importerId = 'u-importer-euro'): Promise<ImporterTelemetry> {
    return {
      active_rfqs_count: 4,
      sealed_quotes_received: 14,
      evaluated_packhouses: 28,
      contracted_volume_mt: 12450,
      avg_bid_response_hours: 18,
      active_reefer_shipments: 3,
    };
  }

  async getActiveRfqs(importerId = 'u-importer-euro'): Promise<ImporterRfqItem[]> {
    return [
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
        price_per_mt_usd: 685,
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
        price_per_mt_usd: 710,
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
        price_per_mt_usd: 395,
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
        price_per_mt_usd: 2150,
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

  async getVerifiedPackhouses(): Promise<VerifiedPackhouse[]> {
    return [
      {
        id: 'pack-01',
        slug: 'nile-agro-export',
        name_en: 'Nile Agro Export Industries',
        name_ar: 'شركة نيل أجرو للصناعات التصديرية',
        governorate: 'Al-Beheira (Nubaria Belt)',
        cr_number: 'CR-104928-EG',
        primary_commodities: ['Valencia Oranges', 'Navel Oranges', 'IQF Strawberries', 'Mandarin'],
        certificates: ['GlobalG.A.P. v6.0', 'BRCGS Food A Grade', 'ISO 22000', 'SMETA Sedex'],
        annual_capacity_mt: 45000,
        packhouse_area_sqm: 18000,
        sorting_lines: 'Aweta InVision 8-lane Optical Grading System',
        cold_storage_capacity_mt: 4200,
        destination_fits: ['European Union', 'United Kingdom', 'Gulf & Saudi', 'East Asia'],
        verified_since: '2021',
        contact_person: 'Eng. Tarek Mansour (Export Director)',
        phone: '+20 100 892 1144',
        whatsapp: '+20 100 892 1144',
        email: 'tarek.mansour@nileagro-eg.com',
      },
      {
        id: 'pack-02',
        slug: 'al-ahram-delta-agri',
        name_en: 'Al-Ahram Delta Agri & Packhouse',
        name_ar: 'مجموعة الأهرام دلتا للحاصلات الزراعية',
        governorate: 'Al-Sharkia (Belbeis)',
        cr_number: 'CR-55921-EG',
        primary_commodities: ['Golden Onions', 'Red Onions', 'Garlic', 'Sweet Potatoes'],
        certificates: ['GlobalG.A.P.', 'ISO 9001:2015', 'Halal National', 'FDA Registered'],
        annual_capacity_mt: 32000,
        packhouse_area_sqm: 12500,
        sorting_lines: 'Compac Dual-Lane Optical Sizer & Automatic Curing Sheds',
        cold_storage_capacity_mt: 3000,
        destination_fits: ['European Union', 'United Kingdom', 'Gulf Cooperation Council'],
        verified_since: '2022',
        contact_person: 'Hassan El-Ghazali (Commercial Head)',
        phone: '+20 122 341 9901',
        whatsapp: '+20 122 341 9901',
        email: 'export@ahramdelta-agri.com',
      },
      {
        id: 'pack-03',
        slug: 'delta-med-herbs',
        name_en: 'Delta Med Herbs & Botanicals',
        name_ar: 'دلتا ميد للأعشاب والنباتات الطبية',
        governorate: 'Beni Suef Industrial Zone',
        cr_number: 'CR-43019-EG',
        primary_commodities: ['Chamomile Flowers', 'Peppermint Leaves', 'Hibiscus', 'Fennel'],
        certificates: ['EU Organic (CERES)', 'USDA NOP Organic', 'ISO 22000', 'Halal'],
        annual_capacity_mt: 12000,
        packhouse_area_sqm: 6200,
        sorting_lines: 'Steam Sterilisation Unit + Buhler Optical Grain Separator',
        cold_storage_capacity_mt: 1500,
        destination_fits: ['Germany & EU Retail', 'United States', 'Japan'],
        verified_since: '2020',
        contact_person: 'Dr. Nader Soliman (QA & Trade)',
        phone: '+20 111 602 8830',
        whatsapp: '+20 111 602 8830',
        email: 'sales@deltamed-herbs.com',
      },
    ];
  }

  async getShipments(importerId = 'u-importer-euro'): Promise<ShipmentTracking[]> {
    return [
      {
        id: 'ship-01',
        booking_ref: 'MSCU-EG902488',
        container_number: 'MSCU 482910-3',
        commodity: 'Valencia Oranges (Reefer 4°C)',
        supplier_name: 'Nile Agro Export Industries',
        quantity_mt: 24,
        shipping_line: 'MSC Mediterranean Shipping',
        vessel_name: 'MSC Gülsün · Voyage 2604N',
        port_of_departure: 'Alexandria Old Port (EG ALY)',
        port_of_arrival: 'Port of Rotterdam (NL RTM)',
        set_temperature_c: 4.0,
        status: 'ON_VESSEL',
        etd: '2026-04-01',
        eta: '2026-04-12',
        bill_of_lading_number: 'BL-MSC-EGY-881920',
        phytosanitary_cert_number: 'EG-NPPO-2026-90412',
      },
      {
        id: 'ship-02',
        booking_ref: 'CMA-EG771204',
        container_number: 'CMAU 993104-7',
        commodity: 'Golden Spring Onions (Ventilated)',
        supplier_name: 'Al-Ahram Delta Agri',
        quantity_mt: 25,
        shipping_line: 'CMA CGM Group',
        vessel_name: 'CMA CGM Antoine de Saint Exupery',
        port_of_departure: 'Damietta Port (EG DAM)',
        port_of_arrival: 'Hamburg Container Terminal (DE HAM)',
        set_temperature_c: 12.0,
        status: 'CUSTOMS_CLEARED',
        etd: '2026-04-04',
        eta: '2026-04-16',
        bill_of_lading_number: 'BL-CMA-EGY-440182',
        phytosanitary_cert_number: 'EG-NPPO-2026-77319',
      },
      {
        id: 'ship-03',
        booking_ref: 'HAPAG-EG33091',
        container_number: 'HLXU 110294-8',
        commodity: 'Organic Chamomile (Dry Food grade)',
        supplier_name: 'Delta Med Herbs & Botanicals',
        quantity_mt: 20,
        shipping_line: 'Hapag-Lloyd',
        vessel_name: 'Al Jmeliyah · Voyage 26W',
        port_of_departure: 'Ain Sokhna (EG AIS)',
        port_of_arrival: 'Felixstowe Trinity Terminal (GB FXT)',
        set_temperature_c: 20.0,
        status: 'LOADING_PACKHOUSE',
        etd: '2026-04-08',
        eta: '2026-04-22',
        bill_of_lading_number: 'BL-HAP-EGY-109283',
        phytosanitary_cert_number: 'EG-NPPO-2026-11840',
      },
    ];
  }
}

export const importerService = new ImporterService();
