'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  fallbackCompanies,
  fallbackCategories,
  fallbackImporters,
  fallbackMarketListings,
} from '@/lib/data/fallbackData';
import {
  Search,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  FileSpreadsheet,
  Eye,
  GitBranch,
  Scale,
  PhoneCall,
  Send,
  Video,
  BadgeCheck,
  Package,
  Anchor,
  Clock,
  CheckCircle2,
  Lock,
  Ship,
  Factory,
  Award,
  Container,
  CalendarDays,
  Building2,
  UserPlus,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Mail,
  Phone,
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

/* ------------------------------------------------------------------ */
/* Local mock enrichment — UI demonstration only, no backend           */
/* ------------------------------------------------------------------ */

type EnrichedSupplier = {
  slug: string;
  sector: string;
  commodity: string;
  hsCode: string;
  certs: string[];
  destinationFit: string[];
  moq: string;
  packaging: string;
  capacity: string;
  plantSize: string;
  seasonality: string;
  ports: string;
};

const supplierExtras: Record<string, EnrichedSupplier> = {
  'nile-agro-export': {
    slug: 'nile-agro-export',
    sector: 'Citrus Fruits',
    commodity: 'Valencia Oranges · Navel · IQF Strawberries',
    hsCode: '0805 / 0811',
    certs: ['ISO 22000', 'GlobalG.A.P.', 'BRCGS'],
    destinationFit: ['EU', 'UK', 'Gulf'],
    moq: '24 MT (1 × 40ft reefer)',
    packaging: '15kg telescopic cartons · 80/pallet',
    capacity: '45,000 MT / year',
    plantSize: '18,000 m² packhouse, Nubaria',
    seasonality: 'Jan – May (Valencia) · Dec – Apr (Strawberry)',
    ports: 'Alexandria · Damietta',
  },
  'al-ahram-delta-agri': {
    slug: 'al-ahram-delta-agri',
    sector: 'Onions, Garlic & Roots',
    commodity: 'Golden & Red Onions · Sweet Potatoes',
    hsCode: '0703 / 0714',
    certs: ['GlobalG.A.P.', 'ISO 9001', 'Halal'],
    destinationFit: ['EU', 'UK', 'Gulf'],
    moq: '25 MT (1 × 40ft)',
    packaging: '10kg / 25kg mesh · 1,000kg jumbo',
    capacity: '32,000 MT / year',
    plantSize: '12,500 m² curing & grading, Belbeis',
    seasonality: 'Feb – Jul (Onions) · Year-round (cured stock)',
    ports: 'Damietta · Port Said',
  },
  'delta-med-herbs': {
    slug: 'delta-med-herbs',
    sector: 'Herbs & Medicinal Plants',
    commodity: 'Chamomile · Peppermint · Hibiscus',
    hsCode: '1211',
    certs: ['EU Organic', 'USDA Organic', 'ISO 22000', 'Halal'],
    destinationFit: ['EU', 'USA'],
    moq: '5 MT (LCL / 1 × 20ft)',
    packaging: '20kg kraft + inner liner',
    capacity: '12,000 MT / year',
    plantSize: '6,200 m² solar-drying & sterilisation, Beni Suef',
    seasonality: 'Dec – Apr (Chamomile peak)',
    ports: 'Alexandria · Sokhna',
  },
};

const certRecords = [
  { type: 'GlobalG.A.P.', body: 'Control Union Egypt', number: 'GGN-EG-40481-22', valid: 'Jan 2026 – Jan 2027', status: 'Verified', market: 'EU · UK' },
  { type: 'BRCGS Food', body: 'BRCGS / SGS Egypt', number: 'BRC-EG-88120-AA', valid: 'Mar 2026 – Mar 2027', status: 'Verified', market: 'EU · UK retail' },
  { type: 'ISO 22000', body: 'TÜV Nord Egypt', number: 'ISO22-EG-19304', valid: '2025 – 2028', status: 'Verified', market: 'All markets' },
  { type: 'ISO 9001', body: 'Bureau Veritas Egypt', number: 'ISO9-EG-55210', valid: '2025 – 2028', status: 'Verified', market: 'All markets' },
  { type: 'EU Organic', body: 'CERES / ESMA', number: 'EU-ORG-EG-7712', valid: 'Jun 2026 – Jun 2027', status: 'Verified', market: 'EU · Germany' },
  { type: 'USDA Organic', body: 'CERES International', number: 'US-ORG-EG-7712', valid: 'Jun 2026 – Jun 2027', status: 'Verified', market: 'USA' },
  { type: 'Halal', body: 'Egyptian Halal Authority', number: 'HL-EG-33910', valid: '2026 – 2027', status: 'Verified', market: 'Gulf · MENA' },
  { type: 'FDA Registration', body: 'U.S. FDA FFR', number: 'FFR-EG-2091881', valid: 'Renewed 2026', status: 'Registered', market: 'USA' },
];

const mockQuotes = [
  {
    id: 'q-delta',
    supplier: 'Delta Harvest',
    location: 'Nubaria · Al-Beheira',
    price: '$2,140 / MT',
    priceNote: 'CIF Hamburg · 20 MT dried mint',
    packaging: '25kg PP bags, 40/pallet',
    leadTime: '14 days',
    port: 'Alexandria',
    terms: 'CIF · 30% advance, 70% CAD',
    badge: 'BEST LANDED COST',
  },
  {
    id: 'q-nile',
    supplier: 'Nile Agro Export',
    location: 'Nubaria · Al-Beheira',
    price: '$680 / MT',
    priceNote: 'FOB Alexandria · Valencia Grade A',
    packaging: '15kg telescopic cartons',
    leadTime: '10 days',
    port: 'Alexandria',
    terms: 'FOB · L/C at sight',
    badge: 'FASTEST READY',
  },
  {
    id: 'q-ahram',
    supplier: 'Al-Ahram Delta Agri',
    location: 'Belbeis · Al-Sharkia',
    price: '$395 / MT',
    priceNote: 'CFR Jeddah · Golden onions 60–80mm',
    packaging: '25kg mesh on Euro pallets',
    leadTime: '12 days',
    port: 'Damietta',
    terms: 'CFR · 30/70 against docs',
    badge: 'CFR OPTION',
  },
];

const buyerDashboardRfqs = [
  { commodity: 'Dried Mint', spec: 'Steam-sterilised, 20 MT', dest: 'Germany · Hamburg', quotes: 5, status: 'Receiving Quotes', updated: '2h ago' },
  { commodity: 'Valencia Orange', spec: 'Grade A, 2 × 40ft reefers', dest: 'Netherlands · Rotterdam', quotes: 3, status: 'Open', updated: '1d ago' },
  { commodity: 'Golden Onions', spec: '60–80mm, 1 × 40ft', dest: 'UK · Felixstowe', quotes: 4, status: 'Receiving Quotes', updated: '3d ago' },
  { commodity: 'Chamomile Flowers', spec: 'Organic, 5 MT', dest: 'Germany · Hamburg', quotes: 2, status: 'Accepted', updated: 'Closed Mar 2026' },
];

const JOURNEY = [
  { key: 'Discover', desc: 'Sector → Commodity → Certificate → Exporter', icon: Search },
  { key: 'Verify', desc: 'CR, capacity, certs, facility media', icon: ShieldCheck },
  { key: 'Request', desc: 'Structured RFQ or direct enquiry', icon: FileSpreadsheet },
  { key: 'Compare', desc: 'Private sealed quotations side-by-side', icon: Scale },
  { key: 'Connect', desc: 'WhatsApp · phone · email, direct deal', icon: PhoneCall },
];

const MATCH_STEPS = [
  { n: '01', title: 'RFQ published', desc: 'Commodity, quantity, Incoterm, port, certs, deadline.' },
  { n: '02', title: 'Relevant exporters identified', desc: 'Filtered by category + required verified certificates.' },
  { n: '03', title: 'Qualified suppliers notified', desc: 'Only eligible packhouses receive the requirement.' },
  { n: '04', title: 'Quotations arrive privately', desc: 'Sealed bids unlock to the importer only.' },
];

export default function ImportersExperiencePage() {
  const { language } = useLanguage();

  /* ---- preserved buyer-directory state (existing work) ---- */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  /* ---- new interactive demo state ---- */
  const [discQuery, setDiscQuery] = useState('');
  const [discSector, setDiscSector] = useState('ALL');
  const [discCert, setDiscCert] = useState('ALL');
  const [discMarket, setDiscMarket] = useState('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState(fallbackCompanies[0].slug);
  const [enquirySent, setEnquirySent] = useState(false);
  const [videoRequested, setVideoRequested] = useState(false);
  const [viewedQuote, setViewedQuote] = useState<string | null>(null);
  const [acceptedQuote, setAcceptedQuote] = useState<string | null>(null);

  // RFQ builder (mock, client-side only)
  const [rfqCommodity, setRfqCommodity] = useState('Valencia Oranges — Grade A');
  const [rfqVariety, setRfqVariety] = useState('Valencia / calibers 56–80');
  const [rfqQty, setRfqQty] = useState('48');
  const [rfqUnit, setRfqUnit] = useState('Metric Tons');
  const [rfqCountry, setRfqCountry] = useState('Netherlands');
  const [rfqPort, setRfqPort] = useState('Port of Rotterdam');
  const [rfqIncoterm, setRfqIncoterm] = useState('CIF');
  const [rfqDelivery, setRfqDelivery] = useState('2026-05-15');
  const [rfqDeadline, setRfqDeadline] = useState('2026-04-10');
  const [rfqCerts, setRfqCerts] = useState<string[]>(['GlobalG.A.P.', 'ISO 22000']);
  const [rfqPack, setRfqPack] = useState('15kg telescopic cartons, 80 per pallet');
  const [rfqFile, setRfqFile] = useState('');
  const [rfqPreviewed, setRfqPreviewed] = useState(false);

  // Free buyer registration (mock)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDone, setRegDone] = useState(false);

  const filteredImporters = fallbackImporters.filter((importer) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      importer.company_name_en.toLowerCase().includes(query) ||
      (importer.company_name_ar && importer.company_name_ar.includes(searchTerm)) ||
      (importer.sourcing_focus_en && importer.sourcing_focus_en.toLowerCase().includes(query)) ||
      (importer.hub_port && importer.hub_port.toLowerCase().includes(query)) ||
      (importer.country_en && importer.country_en.toLowerCase().includes(query));
    const matchesCountry = selectedCountry === 'ALL' || importer.country_code === selectedCountry;
    return matchesSearch && matchesCountry;
  });
  const countries = ['ALL', ...Array.from(new Set(fallbackImporters.map((i) => i.country_code)))];
  const countryLabel = (code: string) =>
    code === 'ALL' ? code : fallbackImporters.find((i) => i.country_code === code)?.country_en ?? code;

  const discoverySuppliers = useMemo(() => {
    return fallbackCompanies
      .map((c) => ({ company: c, extra: supplierExtras[c.slug] }))
      .filter((s) => s.extra)
      .filter(({ company, extra }) => {
        const q = discQuery.toLowerCase();
        const hitQ =
          !q ||
          company.company_name_en.toLowerCase().includes(q) ||
          extra.commodity.toLowerCase().includes(q) ||
          extra.hsCode.toLowerCase().includes(q) ||
          (company.governorate || '').toLowerCase().includes(q);
        const hitSector = discSector === 'ALL' || extra.sector === discSector;
        const hitCert = discCert === 'ALL' || extra.certs.includes(discCert);
        const hitMarket = discMarket === 'ALL' || extra.destinationFit.includes(discMarket);
        return hitQ && hitSector && hitCert && hitMarket;
      });
  }, [discQuery, discSector, discCert, discMarket]);

  const activeSupplier = fallbackCompanies.find((c) => c.slug === selectedSupplier) || fallbackCompanies[0];
  const activeExtra = supplierExtras[activeSupplier.slug] || Object.values(supplierExtras)[0];

  const toggleCert = (cert: string) =>
    setRfqCerts((prev) => (prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]));

  const matchedSuppliers = useMemo(() => {
    if (!rfqPreviewed) return [];
    return fallbackCompanies
      .map((c) => ({ company: c, extra: supplierExtras[c.slug] }))
      .filter((s) => s.extra && s.extra.certs.some((cert) => rfqCerts.includes(cert)))
      .slice(0, 3);
  }, [rfqPreviewed, rfqCerts]);

  const inputCls =
    'w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]';
  const labelCls = 'block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1.5';

  return (
    <div className="bg-[#eee8dc]">
      <style>{`@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}@keyframes quoteIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.quote-in{animation:quoteIn .5s ease both}`}</style>

      {/* ================= TOP OPERATIONS DESK BANNER ================= */}
      <div className="bg-[#e4dac9] border-b border-[#b9aa95] py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#596348] text-white text-[9px] font-mono font-bold uppercase rounded-xs">
              IMPORTER DESK ACTIVE
            </span>
            <span className="text-[#202522] font-medium">
              Review sealed exporter quotations, reefer telemetry, and active RFQs in your private workspace.
            </span>
          </div>
          <Link
            href="/importer"
            className="text-[11px] font-bold uppercase tracking-wider text-[#9b452f] hover:underline flex items-center gap-1 font-mono"
          >
            <span>Launch Importer Operations Desk →</span>
          </Link>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="border-b border-[#b9aa95]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="kicker">FOR INTERNATIONAL BUYERS · IMPORTER EXPERIENCE</div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#202522] leading-[1.04] font-normal">
              Source from Egypt
              <br />
              <span className="italic text-[#9b452f]">with confidence.</span>
            </h1>
            <p className="text-base text-[#565047] max-w-xl leading-relaxed">
              Discover verified Egyptian suppliers, evaluate their capabilities, request quotations,
              compare sealed offers side-by-side, and connect directly — no cart, no checkout, no
              commission. Final negotiation stays between you and the exporter.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/importer"
                className="px-6 py-3.5 bg-[#596348] hover:bg-[#48503a] text-white text-xs font-bold tracking-[0.14em] uppercase transition-colors flex items-center gap-2 shadow-sm"
              >
                <Ship className="w-4 h-4" />
                <span>Open Importer Desk</span>
              </Link>
              <Link
                href="/rfqs/create"
                className="px-6 py-3.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold tracking-[0.14em] uppercase transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Post an RFQ</span>
              </Link>
              <a
                href="#discovery"
                className="px-6 py-3.5 border border-[#202522] hover:bg-[#202522] hover:text-white text-[#202522] text-xs font-bold tracking-[0.14em] uppercase transition-colors"
              >
                Explore Suppliers
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 max-w-xl text-xs">
              {[
                { icon: ShieldCheck, t: 'Verified Egyptian exporters — CR-checked' },
                { icon: BadgeCheck, t: 'Certification-based sourcing (EU / Gulf / US fit)' },
                { icon: MessageSquare, t: 'Direct supplier communication — WhatsApp & phone' },
                { icon: CheckCircle2, t: 'Zero transaction commission from Market 365' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#e4dac9] border border-[#b9aa95] px-3 py-2.5">
                  <p.icon className="w-4 h-4 text-[#596348] shrink-0" />
                  <span className="text-[#202522] font-medium leading-snug">{p.t}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-mono text-[#70695f]">
              Built for procurement managers · import managers · wholesale buyers · distributors · supermarket purchasing teams
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden bg-[#e4dac9] border border-[#b9aa95] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1000&auto=format&fit=crop&q=80"
                alt="Egyptian packhouse ready for export"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase border border-[#b9aa95]/50">
                NUBARIA PACKHOUSE · PRE-COOLING 4°C
              </div>
              <div className="absolute bottom-0 right-0 w-52 bg-[#202522] text-[#eee8dc] p-4 border-t border-l border-[#b9aa95]/40">
                <div className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#c38b40] font-bold mb-1">
                  HOW IT WORKS
                </div>
                <p className="text-xs leading-snug">Discover → Verify → Request → Compare → Connect</p>
              </div>
            </div>
            <div className="mt-3 bg-[#e4dac9] border border-[#b9aa95] p-4 flex items-center justify-between text-xs">
              <span className="font-mono text-[#70695f]">RFQ-2026-0805 · Valencia · Rotterdam</span>
              <span className="px-2 py-0.5 bg-[#596348] text-white text-[10px] font-bold">3 BIDS SEALED</span>
            </div>
          </div>
        </div>

        {/* Journey strip */}
        <div className="border-t border-[#b9aa95]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {JOURNEY.map((s, i) => (
              <div key={s.key} className="bg-[#e4dac9] border border-[#b9aa95] p-4 relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <s.icon className="w-4 h-4 text-[#9b452f]" />
                  <span className="font-mono text-[10px] text-[#70695f]">0{i + 1}</span>
                </div>
                <div className="font-serif text-xl text-[#202522]">{s.key}</div>
                <div className="text-[11px] text-[#565047] leading-snug mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUPPLIER DISCOVERY ================= */}
      <section id="discovery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <div className="kicker">01 · SUPPLIER DISCOVERY</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#202522]">Sector → Commodity → Certificate → Exporter</h2>
          <p className="text-sm text-[#565047] max-w-2xl leading-relaxed">
            Filter the showroom the way a sourcing manager thinks: start from the sector, narrow to the
            commodity and HS code, then require the destination-market certificate. Mock records below
            demonstrate the interaction — no backend.
          </p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#70695f] absolute left-3.5 top-3.5" />
              <input
                value={discQuery}
                onChange={(e) => setDiscQuery(e.target.value)}
                placeholder="Commodity, HS code, company, governorate…"
                className={`${inputCls} pl-10`}
              />
            </div>
            <div className="md:col-span-3">
              <select value={discSector} onChange={(e) => setDiscSector(e.target.value)} className={inputCls}>
                <option value="ALL">All sectors</option>
                {fallbackCategories.map((c) => (
                  <option key={c.id} value={c.name_en}>{c.name_en}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <select value={discCert} onChange={(e) => setDiscCert(e.target.value)} className={inputCls}>
                <option value="ALL">Any certificate</option>
                {['ISO 9001', 'ISO 22000', 'GlobalG.A.P.', 'BRCGS', 'Halal', 'EU Organic', 'USDA Organic'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <select value={discMarket} onChange={(e) => setDiscMarket(e.target.value)} className={inputCls}>
                <option value="ALL">Any market</option>
                <option value="EU">EU</option>
                <option value="UK">UK</option>
                <option value="Gulf">Gulf</option>
                <option value="USA">USA</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="tag tag-olive">VERIFIED ONLY</span>
              <span className="tag tag-muted">HS-CODED CATALOG</span>
              <span className="tag tag-muted">ALEXANDRIA · DAMIETTA · PORT SAID · SOKHNA</span>
            </div>
            <span className="font-mono text-[11px] text-[#70695f]">{discoverySuppliers.length} matching showrooms (mock)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {discoverySuppliers.map(({ company, extra }) => (
            <article key={company.id} className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] transition-colors flex flex-col">
              <div className="p-5 space-y-3 flex-grow">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#70695f]">
                  <span>{extra.sector.toUpperCase()}</span>
                  <span className="flex items-center gap-1 text-[#596348] font-bold"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
                </div>
                <h3 className="font-serif text-2xl text-[#202522] leading-tight">{company.company_name_en}</h3>
                <p className="text-xs text-[#565047] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#9b452f]" />{company.governorate}, Egypt · {extra.ports}</p>
                <p className="text-xs text-[#202522] font-medium">{extra.commodity}</p>
                <p className="text-[11px] font-mono text-[#70695f]">HS {extra.hsCode} · MOQ {extra.moq}</p>
                <div className="flex flex-wrap gap-1.5">
                  {extra.certs.map((c) => (
                    <span key={c} className="px-2 py-0.5 text-[10px] font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#565047]">{c}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-[#eee8dc] border border-[#b9aa95]/70 p-2"><span className="block font-bold uppercase text-[9px] text-[#70695f]">Capacity</span><span className="font-semibold text-[#202522]">{extra.capacity}</span></div>
                  <div className="bg-[#eee8dc] border border-[#b9aa95]/70 p-2"><span className="block font-bold uppercase text-[9px] text-[#70695f]">Packaging</span><span className="font-semibold text-[#202522]">{extra.packaging.split('·')[0]}</span></div>
                </div>
              </div>
              <div className="p-4 border-t border-[#b9aa95] flex items-center justify-between gap-2">
                <button onClick={() => { setSelectedSupplier(company.slug); document.getElementById('evaluation')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-xs font-bold uppercase tracking-wider text-[#9b452f] hover:underline">
                  Evaluate →
                </button>
                <Link href={`/exporters/${company.slug}`} className="text-xs font-bold uppercase tracking-wider text-[#202522] hover:text-[#9b452f] flex items-center gap-1">
                  Showroom <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {discoverySuppliers.length === 0 && (
          <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 text-sm text-[#565047]">No mock showrooms match — clear a filter to continue the demo.</div>
        )}
      </section>

      {/* ================= SUPPLIER EVALUATION ================= */}
      <section id="evaluation" className="border-y border-[#b9aa95] bg-[#e4dac9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="kicker">02 · SUPPLIER EVALUATION</div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#202522]">Evaluate before you contact.</h2>
              <p className="text-sm text-[#565047] max-w-2xl">Pick a showroom to inspect the depth an importer sees: facility, capacity, specs, seasonality, ports, certs and media.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {fallbackCompanies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedSupplier(c.slug)}
                  className={`px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider border transition-colors ${selectedSupplier === c.slug ? 'bg-[#202522] text-[#eee8dc] border-[#202522]' : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#202522]'}`}
                >
                  {c.company_name_en.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#e4dac9] border border-[#b9aa95] overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-[#b9aa95]">
                {[activeSupplier.cover_banner_url, activeSupplier.featured_gallery_url, activeSupplier.featured_gallery_url_2 || activeSupplier.featured_gallery_url].slice(0, 3).map((src, i) => (
                  <div key={i} className={`relative bg-[#202522] overflow-hidden ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src || ''} alt={`${activeSupplier.company_name_en} facility ${i + 1}`} className="w-full h-full object-cover opacity-95" />
                    <span className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase">{i === 0 ? 'PACKHOUSE · SORTING LINE' : 'COLD STORE · LOADING BAY'}</span>
                  </div>
                ))}
                <div className="bg-[#202522] text-[#eee8dc] p-4 h-40 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#c38b40] font-bold flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> FACTORY VIDEO</span>
                  <p className="text-xs leading-relaxed">Walkthrough available on the full showroom. Request a live video verification before contracting.</p>
                  <span className="text-[11px] font-mono text-[#d4c7b5]">MP4 · 4K · 03:42</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-serif text-3xl text-[#202522]">{activeSupplier.company_name_en}</h3>
                <p className="text-sm text-[#565047] leading-relaxed">{activeSupplier.about_en}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { k: 'Plant', v: activeExtra.plantSize },
                    { k: 'Annual capacity', v: activeExtra.capacity },
                    { k: 'Packaging', v: activeExtra.packaging },
                    { k: 'Ports served', v: activeExtra.ports },
                    { k: 'HS code', v: `HS ${activeExtra.hsCode}` },
                    { k: 'MOQ', v: activeExtra.moq },
                    { k: 'Seasonality', v: activeExtra.seasonality },
                    { k: 'Machinery', v: activeSupplier.sorting_machinery || 'Optical sorting line' },
                  ].map((r) => (
                    <div key={r.k} className="bg-[#eee8dc] border border-[#b9aa95]/70 p-3">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#70695f]">{r.k}</span>
                      <span className="font-medium text-[#202522]">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={() => { setEnquirySent(true); setTimeout(() => setEnquirySent(false), 2500); }} className="px-5 py-2.5 bg-[#202522] hover:bg-black text-[#eee8dc] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                    <Send className="w-3.5 h-3.5" /><span>{enquirySent ? 'Enquiry sent (mock)' : 'Send Enquiry'}</span>
                  </button>
                  <button onClick={() => { setVideoRequested(true); setTimeout(() => setVideoRequested(false), 2500); }} className="px-5 py-2.5 border border-[#202522] hover:bg-[#202522] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors">
                    <Video className="w-3.5 h-3.5" /><span>{videoRequested ? 'Video visit requested (mock)' : 'Request Video Verification'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] flex items-center gap-1.5"><Award className="w-4 h-4 text-[#9b452f]" /> Quality vault</span>
                  <span className="tag tag-olive">AUDITED</span>
                </div>
                {(activeSupplier.quality_iso ? activeSupplier.quality_iso.split(',') : []).map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#eee8dc] border border-[#b9aa95]/80 text-xs">
                    <span className="flex items-center gap-2 font-medium"><ShieldCheck className="w-4 h-4 text-[#596348]" />{cert.trim()}</span>
                    <span className="font-mono text-[10px] text-[#70695f] uppercase">Valid 2026/27</span>
                  </div>
                ))}
                <p className="text-[11px] text-[#70695f] leading-relaxed">Full certificate records with accreditation body, number and validity are listed in §03 below.</p>
              </div>
              <MaskedContact phone={activeSupplier.company_phone} whatsapp={activeSupplier.company_phone} email={activeSupplier.company_email} companyName={activeSupplier.company_name_en} variant="card" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST & CERTIFICATION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <div className="kicker">03 · TRUST & CERTIFICATION</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#202522]">Match suppliers to destination requirements.</h2>
          <p className="text-sm text-[#565047] max-w-2xl">Every mock certificate carries a type, accreditation body, number, validity and verification status — so a buyer for Germany, the UK, the Gulf or the USA can shortlist only compliant packhouses.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {[
            { t: 'EU retail', d: 'GlobalG.A.P. + BRCGS + MRL lab' },
            { t: 'Gulf / SFDA', d: 'Halal + phytosanitary + SGS' },
            { t: 'USA / FDA', d: 'FDA registration + USDA Organic' },
            { t: 'Organic DE', d: 'EU Organic + PA < 400 µg/kg' },
          ].map((x) => (
            <div key={x.t} className="bg-[#e4dac9] border border-[#b9aa95] p-4">
              <div className="font-bold uppercase tracking-wider text-[11px] text-[#202522]">{x.t}</div>
              <div className="text-[#565047] mt-1">{x.d}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#e4dac9] border border-[#b9aa95] overflow-x-auto">
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#70695f] border-b border-[#b9aa95]">
                <th className="p-3.5">Certificate</th><th className="p-3.5">Accreditation body</th><th className="p-3.5">Number</th><th className="p-3.5">Validity</th><th className="p-3.5">Status</th><th className="p-3.5">Fits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/60">
              {certRecords.map((r) => (
                <tr key={r.number} className="hover:bg-[#eee8dc]/60">
                  <td className="p-3.5 font-bold text-[#202522]">{r.type}</td>
                  <td className="p-3.5 text-[#565047]">{r.body}</td>
                  <td className="p-3.5 font-mono text-[#565047]">{r.number}</td>
                  <td className="p-3.5 text-[#565047]">{r.valid}</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 text-[10px] font-bold bg-[#596348] text-white uppercase">{r.status}</span></td>
                  <td className="p-3.5 font-mono text-[#9b452f]">{r.market}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] font-mono text-[#70695f]">Mock certificate records for UI demonstration. Verification is re-checked against Egyptian councils before listing.</p>
      </section>

      {/* ================= RFQ EXPERIENCE ================= */}
      <section className="border-y border-[#b9aa95] bg-[#e4dac9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-5">
            <div className="pb-4 border-b border-[#b9aa95]">
              <div className="kicker mb-1">04 · RFQ EXPERIENCE — HIGH PRIORITY</div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#202522]">Build a structured RFQ in minutes.</h2>
              <p className="text-xs text-[#70695f] mt-1">Client-side mock only. The full wizard lives at <Link href="/rfqs/create" className="text-[#9b452f] font-bold hover:underline">/rfqs/create</Link>.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2"><label className={labelCls}>Commodity</label><input value={rfqCommodity} onChange={(e) => setRfqCommodity(e.target.value)} className={inputCls} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Variety / grade</label><input value={rfqVariety} onChange={(e) => setRfqVariety(e.target.value)} className={inputCls} /></div>
              <div>
                <label className={labelCls}>Quantity</label>
                <div className="flex gap-2">
                  <input value={rfqQty} onChange={(e) => setRfqQty(e.target.value)} className={`${inputCls} font-mono`} />
                  <select value={rfqUnit} onChange={(e) => setRfqUnit(e.target.value)} className={inputCls}>
                    <option>Metric Tons</option><option>Containers</option><option>Pallets</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Incoterm</label>
                <select value={rfqIncoterm} onChange={(e) => setRfqIncoterm(e.target.value)} className={`${inputCls} font-bold`}>
                  <option>FOB</option><option>CIF</option><option>CFR</option><option>EXW</option>
                </select>
              </div>
              <div><label className={labelCls}>Destination country</label><input value={rfqCountry} onChange={(e) => setRfqCountry(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Port of discharge</label><input value={rfqPort} onChange={(e) => setRfqPort(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Delivery window</label><input type="date" value={rfqDelivery} onChange={(e) => setRfqDelivery(e.target.value)} className={`${inputCls} font-mono`} /></div>
              <div><label className={labelCls}>Proposal deadline</label><input type="date" value={rfqDeadline} onChange={(e) => setRfqDeadline(e.target.value)} className={`${inputCls} font-mono`} /></div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Required certifications</label>
                <div className="flex flex-wrap gap-2">
                  {['ISO 9001', 'ISO 22000', 'GlobalG.A.P.', 'BRCGS', 'Halal', 'EU Organic', 'FDA Registration'].map((c) => (
                    <button key={c} type="button" onClick={() => toggleCert(c)} className={`px-2.5 py-1.5 text-[11px] font-bold border transition-colors ${rfqCerts.includes(c) ? 'bg-[#202522] text-[#eee8dc] border-[#202522]' : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047]'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2"><label className={labelCls}>Packaging specifications</label><input value={rfqPack} onChange={(e) => setRfqPack(e.target.value)} className={inputCls} /></div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Specification attachment (mock)</label>
                <div className="flex gap-2">
                  <input value={rfqFile} onChange={(e) => setRfqFile(e.target.value)} placeholder="e.g. valencia-spec-2026.pdf" className={inputCls} />
                  <span className="px-3 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[11px] font-mono text-[#70695f] whitespace-nowrap">PDF · mock</span>
                </div>
              </div>
            </div>
            <button onClick={() => setRfqPreviewed(true)} className="w-full py-3 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors">
              Preview matching suppliers (mock)
            </button>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#202522] text-[#eee8dc] p-6 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c38b40] font-bold">LIVE RFQ SUMMARY · MOCK</div>
              <h3 className="font-serif text-2xl">{rfqCommodity}</h3>
              <div className="text-xs space-y-1.5 font-mono text-[#d4c7b5]">
                <p>{rfqQty} {rfqUnit} · {rfqIncoterm} {rfqPort}, {rfqCountry}</p>
                <p>Variety: {rfqVariety}</p>
                <p>Delivery {rfqDelivery} · Bids due {rfqDeadline}</p>
                <p>Certs: {rfqCerts.join(' · ') || '—'}</p>
                <p>Pack: {rfqPack}</p>
                {rfqFile && <p>Attachment: {rfqFile}</p>}
              </div>
              <Link href="/rfqs/create" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c38b40] hover:underline">
                Open full RFQ wizard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-[0.14em] flex items-center gap-1.5"><GitBranch className="w-4 h-4 text-[#9b452f]" /> Supplier matching</div>
              {!rfqPreviewed ? (
                <p className="text-xs text-[#565047]">Publish the preview to see which mock packhouses qualify for this requirement.</p>
              ) : (
                <div className="space-y-2.5">
                  {MATCH_STEPS.map((s) => (
                    <div key={s.n} className="bg-[#eee8dc] border border-[#b9aa95]/70 p-3 flex gap-3">
                      <span className="font-serif text-xl text-[#9b452f]">{s.n}</span>
                      <div><div className="text-xs font-bold text-[#202522]">{s.title}</div><div className="text-[11px] text-[#565047]">{s.desc}</div></div>
                    </div>
                  ))}
                  <div className="pt-1 space-y-2">
                    {matchedSuppliers.map((m) => (
                      <div key={m.company.id} className="quote-in flex items-center justify-between text-xs bg-[#596348]/10 border border-[#596348] px-3 py-2">
                        <span className="font-semibold text-[#202522]">{m.company.company_name_en}</span>
                        <span className="font-mono text-[11px] text-[#596348]">ELIGIBLE · {m.extra?.certs.slice(0, 2).join(' + ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUOTATION COMPARISON ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <div className="kicker">05 · QUOTATION COMPARISON</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#202522]">Compare sealed offers privately.</h2>
          <p className="text-sm text-[#565047] max-w-2xl flex items-start gap-1.5"><Lock className="w-4 h-4 mt-0.5 text-[#596348] shrink-0" /> Quotations are confidential. Competing exporters cannot see each other&apos;s bids — only the importer unlocks them. Mock records below.</p>
        </div>
        <div className="bg-[#e4dac9] border border-[#b9aa95] overflow-x-auto">
          <table className="w-full text-xs min-w-[820px]">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#70695f] border-b border-[#b9aa95]">
                <th className="p-3.5">Supplier</th><th className="p-3.5">Price</th><th className="p-3.5">Packaging</th><th className="p-3.5">Lead time</th><th className="p-3.5">Loading port</th><th className="p-3.5">Terms</th><th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/60">
              {mockQuotes.map((q) => (
                <React.Fragment key={q.id}>
                  <tr className={`hover:bg-[#eee8dc]/60 ${acceptedQuote === q.id ? 'bg-[#596348]/10' : ''}`}>
                    <td className="p-3.5"><div className="font-bold text-[#202522]">{q.supplier}</div><div className="text-[11px] text-[#70695f]">{q.location}</div><span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#202522] text-[#eee8dc]">{q.badge}</span></td>
                    <td className="p-3.5"><div className="font-serif text-lg font-bold text-[#202522]">{q.price}</div><div className="text-[11px] text-[#70695f]">{q.priceNote}</div><div className="text-[11px] font-mono text-[#70695f]">USD / EUR on request</div></td>
                    <td className="p-3.5 text-[#565047]">{q.packaging}</td>
                    <td className="p-3.5 font-semibold">{q.leadTime}</td>
                    <td className="p-3.5"><span className="flex items-center gap-1"><Anchor className="w-3.5 h-3.5 text-[#596348]" />{q.port}</span></td>
                    <td className="p-3.5 text-[#565047]">{q.terms}</td>
                    <td className="p-3.5">
                      <div className="flex flex-col gap-1.5 items-end">
                        <button onClick={() => setViewedQuote(viewedQuote === q.id ? null : q.id)} className="px-3 py-1.5 border border-[#202522] text-[11px] font-bold uppercase tracking-wider hover:bg-[#202522] hover:text-white transition-colors flex items-center gap-1"><Eye className="w-3 h-3" /> View Quote</button>
                        <button onClick={() => setAcceptedQuote(q.id)} className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${acceptedQuote === q.id ? 'bg-[#596348] text-white' : 'bg-[#202522] text-[#eee8dc] hover:bg-black'}`}>{acceptedQuote === q.id ? <><CheckCircle2 className="w-3 h-3" /> Accepted</> : 'Accept Quote'}</button>
                      </div>
                    </td>
                  </tr>
                  {viewedQuote === q.id && (
                    <tr className="bg-[#eee8dc]">
                      <td colSpan={7} className="p-4 text-xs text-[#565047] quote-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div><span className="font-bold uppercase text-[10px] text-[#70695f] block">Commercial detail</span>{q.priceNote} · {q.terms}</div>
                          <div><span className="font-bold uppercase text-[10px] text-[#70695f] block">Logistics</span>{q.leadTime} ex-works → {q.port} → Hamburg / Rotterdam / Jeddah</div>
                          <div><span className="font-bold uppercase text-[10px] text-[#70695f] block">Confidentiality</span>Sealed bid · visible to importer only · Egyptian ports: Alexandria, Damietta, Port Said, Sokhna</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/rfqs" className="px-5 py-2.5 bg-[#202522] text-[#eee8dc] text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors">Open importer desk</Link>
          <span className="px-5 py-2.5 border border-[#b9aa95] text-xs font-mono text-[#70695f]">USD / EUR · FOB / CIF / CFR / EXW supported</span>
        </div>
      </section>

      {/* ================= DIRECT CONNECTION ================= */}
      <section className="border-y border-[#b9aa95] bg-[#e4dac9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="kicker">06 · DIRECT CONNECTION</div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#202522]">You deal directly with the exporter.</h2>
            <p className="text-sm text-[#565047] max-w-xl leading-relaxed">Market 365 facilitates the introduction — commercial negotiation, contracts and payment happen directly between buyer and exporter. No platform payment, escrow, commission, freight execution or customs clearance.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { icon: MessageSquare, t: 'WhatsApp', d: 'Chat with the export desk directly' },
                { icon: Phone, t: 'Business phone', d: 'Call the packhouse sales team' },
                { icon: Mail, t: 'Executive email', d: 'Exchange specs & proformas' },
              ].map((c) => (
                <div key={c.t} className="bg-[#e4dac9] border border-[#b9aa95] p-4">
                  <c.icon className="w-4 h-4 text-[#9b452f] mb-2" />
                  <div className="font-bold text-[#202522] uppercase tracking-wider text-[11px]">{c.t}</div>
                  <div className="text-[#565047] mt-1">{c.d}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#202522] text-[#eee8dc] p-4 flex items-start gap-2.5 text-xs">
              <Lock className="w-4 h-4 text-[#c38b40] shrink-0 mt-0.5" />
              <p><strong>Register Free as a Buyer to View Contacts.</strong> Unauthenticated visitors see masked contacts. Importer registration is free — toggle “Demo Unlock” on the card to preview both states.</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <MaskedContact phone={fallbackCompanies[0].company_phone} whatsapp={fallbackCompanies[0].company_phone} email={fallbackCompanies[0].company_email} companyName={fallbackCompanies[0].company_name_en} variant="card" />
            <p className="text-[11px] font-mono text-[#70695f] mt-2">Example: {fallbackCompanies[0].company_name_en} · masked until free buyer registration.</p>
          </div>
        </div>
      </section>

      {/* ================= BUYER DASHBOARD ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="kicker">07 · BUYER ACCOUNT / DASHBOARD (MOCK)</div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#202522]">Your RFQs, quotes and history in one desk.</h2>
            <p className="text-sm text-[#565047]">UI mock data only — not platform statistics.</p>
          </div>
          <div className="flex gap-2 text-xs">
            <div className="bg-[#e4dac9] border border-[#b9aa95] px-4 py-3 text-center"><div className="font-serif text-2xl">3</div><div className="text-[10px] font-bold uppercase tracking-wider text-[#70695f]">Active RFQs</div></div>
            <div className="bg-[#e4dac9] border border-[#b9aa95] px-4 py-3 text-center"><div className="font-serif text-2xl">12</div><div className="text-[10px] font-bold uppercase tracking-wider text-[#70695f]">Quotes received</div></div>
            <div className="bg-[#e4dac9] border border-[#b9aa95] px-4 py-3 text-center"><div className="font-serif text-2xl">2</div><div className="text-[10px] font-bold uppercase tracking-wider text-[#70695f]">Awaiting</div></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buyerDashboardRfqs.map((r) => (
            <div key={r.commodity} className="bg-[#e4dac9] border border-[#b9aa95] p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${r.status === 'Accepted' ? 'bg-[#596348] text-white' : r.status === 'Open' ? 'bg-[#c38b40] text-[#202522]' : 'bg-[#202522] text-[#eee8dc]'}`}>{r.status}</span>
                  <span className="font-mono text-[11px] text-[#70695f]">{r.quotes} quotations</span>
                </div>
                <h3 className="font-serif text-2xl text-[#202522]">{r.commodity}</h3>
                <p className="text-xs text-[#565047] mt-1">{r.spec} · {r.dest}</p>
              </div>
              <div className="pt-3 border-t border-[#b9aa95]/60 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[#70695f]"><Clock className="w-3.5 h-3.5" />{r.updated}</span>
                <Link href="/rfqs" className="font-bold uppercase tracking-wider text-[#9b452f] hover:underline">Open →</Link>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#70695f]">Recent supplier activity, RFQ history and accepted quotations appear here once registered. Example records: Dried Mint · 20 MT · Germany · 5 quotations · Receiving Quotes; Valencia Orange · 2 Containers · Netherlands · 3 quotations · Open.</p>
      </section>

      {/* ================= FREE REGISTRATION ================= */}
      <section className="border-y border-[#b9aa95] bg-[#202522] text-[#eee8dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#c38b40]">08 · FREE IMPORTER REGISTRATION</div>
            <h2 className="font-serif text-4xl sm:text-5xl">Register free as a buyer.</h2>
            <p className="text-sm text-[#d4c7b5] leading-relaxed max-w-lg">Unlock direct WhatsApp, phone and executive email, post unlimited RFQ drafts (mock), and receive sealed quotations. No authentication backend in this mock — submitting shows a confirmation state only.</p>
            <ul className="space-y-2 text-xs text-[#d4c7b5]">
              {['Corporate email verification (mock)', 'Direct contact unlock on acceptance', 'RFQ history & quote comparison desk'].map((t) => (
                <li key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#c38b40]" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 bg-[#e4dac9] text-[#202522] border border-[#b9aa95] p-6 sm:p-7">
            {regDone ? (
              <div className="text-center space-y-2 py-8">
                <UserPlus className="w-10 h-10 text-[#596348] mx-auto" />
                <h3 className="font-serif text-2xl">Welcome aboard (mock).</h3>
                <p className="text-xs text-[#565047]">Buyer account request recorded locally. Contacts would unlock after verification.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegDone(true); }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><label className={labelCls}>Full name</label><input required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Elena Fischer" className={inputCls} /></div>
                <div><label className={labelCls}>Corporate email</label><input required type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="buy@company.com" className={inputCls} /></div>
                <div><label className={labelCls}>Company name</label><input required value={regCompany} onChange={(e) => setRegCompany(e.target.value)} placeholder="EuroFresh GmbH" className={inputCls} /></div>
                <div><label className={labelCls}>Country</label><input required value={regCountry} onChange={(e) => setRegCountry(e.target.value)} placeholder="Germany" className={inputCls} /></div>
                <div><label className={labelCls}>Business phone / WhatsApp</label><input required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+49 …" className={inputCls} /></div>
                <div><label className={labelCls}>Password</label><input required type="password" placeholder="••••••••" className={inputCls} /></div>
                <button type="submit" className="sm:col-span-2 py-3 bg-[#9b452f] hover:bg-[#833824] text-white font-bold uppercase tracking-wider transition-colors">Create free buyer account (mock)</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ================= SECONDARY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9b452f]"><Container className="w-4 h-4" /> Secondary · Distressed cargo</div>
          <h3 className="font-serif text-3xl text-[#202522]">Urgent lots for opportunistic buyers.</h3>
          <p className="text-xs text-[#565047]">En-route, rejected or urgently-resold shipments. Secondary to normal RFQ sourcing.</p>
          {fallbackMarketListings.filter((l) => l.listing_type === 'DISTRESSED_CARGO').slice(0, 1).map((d) => (
            <div key={d.listing_id} className="bg-[#eee8dc] border border-[#b9aa95] p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#202522]">{d.title}</span>
                <span className="px-2 py-0.5 bg-[#9b452f] text-white text-[10px] font-bold">URGENT</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-[#565047]">
                <span>2 × 40ft · 48 MT</span><span>Damietta yard</span><span>$480 / MT target</span><span>BL {d.bill_of_lading_number}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#596348]" />{d.inspection_company}</span>
                <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-[#9b452f]" />Phytosanitary ready</span>
              </div>
              <Link href="/market" className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[#9b452f] hover:underline">View on market board <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          ))}
        </div>
        <div className="lg:col-span-5 bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#596348]"><BookOpen className="w-4 h-4" /> Secondary · Trade resources</div>
          <h3 className="font-serif text-3xl text-[#202522]">Compliance, links & logistics.</h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {['NFSA', 'CAPQ', 'Egyptian Customs', 'Nafeza', 'GOEIC', 'Export Development Authority', 'Commodity Export Councils', 'Shipping lines', 'Freight forwarders', 'Inspection agencies'].map((r) => (
              <span key={r} className="bg-[#eee8dc] border border-[#b9aa95]/70 px-2.5 py-2 font-medium text-[#202522]">{r}</span>
            ))}
          </div>
          <p className="text-[11px] text-[#70695f]">External references for documentation only — Market 365 does not execute freight or customs clearance.</p>
        </div>
      </section>

      {/* ================= PRESERVED BUYER DIRECTORY ================= */}
      <section className="border-t border-[#202522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="space-y-3">
            <div className="kicker">{language === 'ar' ? 'سجل المستوردين الدولي · الدليل ٠٣' : 'BUYER DIRECTORY · REGISTRY 03'}</div>
            <h2 className="font-serif text-5xl sm:text-6xl text-[#202522] leading-tight font-normal">
              {language === 'ar' ? (<>المشترون <br /><span className="italic text-[#9b452f]">وراء كل طلب.</span></>) : (<>The buyers <br /><span className="italic text-[#9b452f]">behind demand.</span></>)}
            </h2>
            <p className="text-sm text-[#70695f] max-w-xl leading-relaxed">
              {language === 'ar'
                ? 'فهرس عملي للمستوردين الدوليين المعتمدين وبرامج التوريد السنوية والموانئ المستهدفة لمحادثات التوريد بالجملة.'
                : 'A working index of verified international buyers cleared for wholesale sourcing conversations with Egyptian exporters. Preserved from the existing directory.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 border-t border-[#b9aa95] pt-6">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-[#70695f] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search buyer, commodity, destination port"
                  className="w-full pl-10 pr-4 py-3 bg-[#e4dac9] border border-[#b9aa95] text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none px-4 py-3 bg-[#e4dac9] border border-[#b9aa95] text-xs font-bold uppercase tracking-[0.12em] text-[#202522] pr-8 focus:outline-none focus:border-[#9b452f] cursor-pointer"
                  >
                    <option value="ALL">ALL BUYERS & HUB PORTS</option>
                    {countries.filter((c) => c !== 'ALL').map((code) => (
                      <option key={code} value={code}>{countryLabel(code).toUpperCase()}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#70695f] absolute right-2.5 top-3.5 pointer-events-none" />
                </div>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCountry('ALL'); }}
                  className="px-4 py-3 border border-[#202522] bg-transparent hover:bg-[#202522] hover:text-white text-xs font-bold uppercase tracking-[0.14em] transition-colors flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /><span>FILTERS</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-olive">VERIFIED BUYERS ONLY</span>
                <span className="tag tag-muted">L/C & CAD TERMS</span>
                <span className="tag tag-muted">ROTTERDAM · JEDDAH · HAMBURG</span>
                <span className="tag tag-amber">SEALED RFQ PROTOCOL</span>
              </div>
              <span className="text-[11px] font-mono text-[#70695f]">{filteredImporters.length} verified records</span>
            </div>
          </div>

          <div className="border-t border-[#202522]">
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#70695f] border-b border-[#b9aa95]">
              <div className="col-span-4">BUYER</div>
              <div className="col-span-3">SOURCING FOCUS</div>
              <div className="col-span-2">HUB PORT</div>
              <div className="col-span-1">TIER</div>
              <div className="col-span-2 text-right">ACTIVE RFQS</div>
            </div>
            <div className="divide-y divide-[#b9aa95]">
              {filteredImporters.map((importer) => (
                <div key={importer.id} className="py-6 group hover:bg-[#e4dac9]/30 transition-colors px-2">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 space-y-1">
                      <Link href={`/importers/${importer.slug}`} className="font-serif text-2xl text-[#202522] group-hover:text-[#9b452f] transition-colors inline-block">
                        {language === 'ar' ? importer.company_name_ar || importer.company_name_en : importer.company_name_en}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-[#70695f]">
                        <span className="flex items-center gap-1 text-[#596348] font-bold uppercase tracking-wider text-[10px]">
                          <ShieldCheck className="w-3 h-3 text-[#596348]" /><span>{importer.verification_status}</span>
                        </span>
                        <span>·</span>
                        <span className="font-mono">{importer.country_code} · Since {importer.member_since}</span>
                      </div>
                    </div>
                    <div className="col-span-3 text-xs text-[#565047]">
                      {language === 'ar' ? importer.sourcing_focus_ar || importer.sourcing_focus_en : importer.sourcing_focus_en}
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-xs text-[#202522]">
                      <MapPin className="w-3.5 h-3.5 text-[#9b452f] flex-shrink-0" /><span>{importer.hub_port}</span>
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase ${importer.tier === 'ELITE' ? 'bg-[#c38b40] text-[#202522]' : 'bg-[#596348] text-[#f4efe5]'}`}>{importer.tier}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2 text-xs">
                      <span className="text-[#565047] font-medium">{importer.active_rfqs} open · {importer.preferred_incoterms}</span>
                      <Link href={`/importers/${importer.slug}`} className="p-1 text-[#202522] hover:text-[#9b452f] transition-colors" title="View Buyer Profile">
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#b9aa95]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#70695f]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#70695f]">Direct Contact:</span>
                      <span className="font-mono text-xs text-[#b9aa95]">{importer.company_email ? `${importer.company_email.slice(0, 4)}••••@••••••.com` : 'info••••@••••••.com'}</span>
                      <span className="font-mono text-xs text-[#b9aa95]">{importer.company_phone ? `${importer.company_phone.slice(0, 6)} ••• ••••` : '+•• ••• ••• ••••'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MaskedContact phone={importer.company_phone} whatsapp={importer.company_phone} email={importer.company_email} companyName={importer.company_name_en} variant="inline" />
                      <Link href={`/importers/${importer.slug}`} className="text-xs font-bold text-[#9b452f] hover:underline uppercase tracking-wider">View Full Profile →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience + non-ecommerce guardrail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 flex gap-3">
              <Building2 className="w-5 h-5 text-[#596348] shrink-0" />
              <p className="text-[#565047] leading-relaxed"><strong className="text-[#202522]">Built for:</strong> procurement & import managers, wholesale buyers, distributors, supermarket purchasing teams and sourcing professionals focused on credibility, specs, MOQ, lead time and Incoterms.</p>
            </div>
            <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 flex gap-3">
              <Factory className="w-5 h-5 text-[#9b452f] shrink-0" />
              <p className="text-[#565047] leading-relaxed"><strong className="text-[#202522]">Not ecommerce:</strong> no cart, checkout, platform payment, escrow, commission, fulfilment, freight or customs execution. Market 365 introduces — you contract directly.</p>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-wrap gap-3 pb-2">
            <Link href="/rfqs/create" className="px-6 py-3 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-[0.14em] transition-colors">Post an RFQ</Link>
            <Link href="/exporters" className="px-6 py-3 border border-[#202522] hover:bg-[#202522] hover:text-white text-xs font-bold uppercase tracking-[0.14em] transition-colors">Explore Suppliers</Link>
            <Link href="/auth/register" className="px-6 py-3 border border-[#b9aa95] bg-[#e4dac9] hover:border-[#202522] text-xs font-bold uppercase tracking-[0.14em] transition-colors">Register Free as Buyer</Link>
          </div>
        </div>
      </section>

      {/* Icon-prefetch guard (tree-shaken, no UI) */}
      <span className="hidden"><Ship /><CalendarDays /><Package /></span>
    </div>
  );
}
