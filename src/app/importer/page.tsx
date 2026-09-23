'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  importerService,
  ImporterTelemetry,
  ImporterRfqItem,
  SealedQuotation,
  VerifiedPackhouse,
  ShipmentTracking,
} from '@/lib/services/importerService';
import {
  FileSpreadsheet,
  Scale,
  Building2,
  Ship,
  FileCheck2,
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Anchor,
  Phone,
  MessageSquare,
  Eye,
  Award,
  Filter,
  Search,
  ChevronRight,
  Layers,
  Sparkles,
  Thermometer,
  Container,
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ImporterOverviewPage() {
  const { language, direction } = useLanguage();
  const { addToast } = useToast();
  const isRtl = direction === 'rtl';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<ImporterTelemetry | null>(null);
  const [rfqs, setRfqs] = useState<ImporterRfqItem[]>([]);
  const [quotes, setQuotes] = useState<SealedQuotation[]>([]);
  const [packhouses, setPackhouses] = useState<VerifiedPackhouse[]>([]);
  const [shipments, setShipments] = useState<ShipmentTracking[]>([]);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'rfqs' | 'quotes' | 'packhouses' | 'shipments' | 'compliance'>('rfqs');

  // Selected Quote for Modal Inspection
  const [selectedQuote, setSelectedQuote] = useState<SealedQuotation | null>(null);

  // Selected Packhouse for Direct WhatsApp Connect
  const [contactModalPackhouse, setContactModalPackhouse] = useState<VerifiedPackhouse | null>(null);

  // Filters
  const [commodityFilter, setCommodityFilter] = useState('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, rfqData, quoteData, packhouseData, shipData] = await Promise.all([
        importerService.getTelemetry(),
        importerService.getActiveRfqs(),
        importerService.getSealedQuotes(),
        importerService.getVerifiedPackhouses(),
        importerService.getShipments(),
      ]);
      setTelemetry(stats);
      setRfqs(rfqData);
      setQuotes(quoteData);
      setPackhouses(packhouseData);
      setShipments(shipData);
    } catch {
      addToast('error', 'Failed to load importer procurement data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptQuote = (quote: SealedQuotation) => {
    addToast(
      'success',
      language === 'ar'
        ? `تم قبول عرض سعر ${quote.supplier_name} بنجاح! تم إرسال إشعار للمصدّر لبدء مسودة العقد.`
        : `Accepted quote from ${quote.supplier_name}! Supplier notified to initiate proforma invoice.`
    );
    setSelectedQuote(null);
  };

  const handleShortlistQuote = (quote: SealedQuotation) => {
    addToast(
      'info',
      language === 'ar'
        ? `تمت إضافة عرض ${quote.supplier_name} إلى القائمة القصيرة للمقارنة.`
        : `Added ${quote.supplier_name} to short-listed comparison candidates.`
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
              {language === 'ar'
                ? 'منشأة استيراد دولية معتمدة'
                : 'VERIFIED INTERNATIONAL BUYER · GLOBAL PROCUREMENT DESK'}
            </span>
            <span className="text-xs text-[#70695f] font-mono">
              Gov Reg: DE-HMB-89210 · Rotterdam Port Hub
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            {language === 'ar'
              ? 'لوحة تحكم المستورد والمشتري الدولي'
              : 'Importer Procurement & Sourcing Desk'}
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            {language === 'ar'
              ? 'إدارة مناقصات التوريد، مقارنة عروض الأسعار المغلقة، تتبع شحنات التبريد، والتواصل المباشر مع محطات التعبئة.'
              : 'Direct RFQ tenders, sealed quotations comparison, cold-chain reefer telemetry, and verified Egyptian packhouses.'}
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/rfqs/create"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm rounded-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'طرح طلب توريد جديد' : 'New Sourcing RFQ'}</span>
          </Link>

          <Link
            href="/importers"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#70695f]" />
            <span>{language === 'ar' ? 'دليل المشترين العام' : 'Public Directory'}</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Metric Cards matching Exporter/Admin aesthetic */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Active RFQs */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'طلبات التوريد النشطة' : 'Active Sourcing RFQs'}
            </span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#9b452f]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.active_rfqs_count || 4}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#2d7a58] font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+2 this month</span>
          </div>
        </div>

        {/* Metric 2: Sealed Quotes */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'العروض المستلمة' : 'Sealed Bids Received'}
            </span>
            <Scale className="w-3.5 h-3.5 text-[#596348]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.sealed_quotes_received || 14}
          </div>
          <div className="text-[10px] text-[#70695f] font-mono">
            {language === 'ar' ? '100% عروض مغلقة' : '100% Sealed bids'}
          </div>
        </div>

        {/* Metric 3: Evaluated Packhouses */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'محطات تم فحصها' : 'Screened Packhouses'}
            </span>
            <Building2 className="w-3.5 h-3.5 text-[#c38b40]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.evaluated_packhouses || 28}
          </div>
          <div className="text-[10px] text-[#2d7a58] font-bold">
            <span>Aweta & GlobalGAP</span>
          </div>
        </div>

        {/* Metric 4: Sourced Volume */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'حجم التوريد السنوي' : 'Contracted Volume'}
            </span>
            <Award className="w-3.5 h-3.5 text-[#9b452f]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {(telemetry?.contracted_volume_mt || 12450).toLocaleString()} <span className="text-xs font-normal font-sans">MT</span>
          </div>
          <div className="text-[10px] text-[#70695f] font-mono">
            Citrus, Onions & Herbs
          </div>
        </div>

        {/* Metric 5: Bid Velocity */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'متوسط سرعة الرد' : 'Avg Bid Response'}
            </span>
            <Clock className="w-3.5 h-3.5 text-[#596348]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.avg_bid_response_hours || 18} <span className="text-xs font-normal font-sans">hrs</span>
          </div>
          <div className="text-[10px] text-[#2d7a58] font-bold">
            High responsiveness
          </div>
        </div>

        {/* Metric 6: Reefer Shipments */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'شحنات تبريد مبحرة' : 'Reefers En Route'}
            </span>
            <Ship className="w-3.5 h-3.5 text-[#202522]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.active_reefer_shipments || 3}
          </div>
          <div className="text-[10px] text-[#2d7a58] font-bold">
            Steady at 4.0°C
          </div>
        </div>
      </div>

      {/* Navigation Desk Tabs */}
      <div className="flex items-center gap-2 border-b border-[#b9aa95] overflow-x-auto pb-px">
        {[
          { id: 'rfqs', labelEn: 'Active RFQs & Demands', labelAr: 'طلبات التوريد المفتوحة', count: rfqs.length },
          { id: 'quotes', labelEn: 'Sealed Quotations Matrix', labelAr: 'مقارنة عروض الأسعار المغلقة', count: quotes.length },
          { id: 'packhouses', labelEn: 'Verified Packhouse Directory', labelAr: 'دليل محطات التعبئة المعتمدة', count: packhouses.length },
          { id: 'shipments', labelEn: 'Reefer Shipments Telemetry', labelAr: 'تتبع شحنات التبريد والموانئ', count: shipments.length },
          { id: 'compliance', labelEn: 'EU MRL & Cert Compliance', labelAr: 'فحص اشتراطات الجودة والمتبقيات' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#9b452f] text-[#9b452f] bg-[#e4dac9]/60'
                : 'border-transparent text-[#70695f] hover:text-[#202522] hover:bg-[#e4dac9]/30'
            }`}
          >
            <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-[#9b452f] text-white'
                    : 'bg-[#b9aa95]/40 text-[#202522]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: ACTIVE RFQS ================= */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] p-3.5 rounded-lg">
            <div className="text-xs text-[#202522] font-medium">
              {language === 'ar'
                ? 'طلبات الشراء والتوريد المطروحة من شركتك لموردي الحاصلات الزراعية المصريين:'
                : 'Current purchase requirements published to verified Egyptian agricultural packhouses:'}
            </div>
            <Link
              href="/rfqs/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9b452f] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#833824] transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طرح طلب توريد' : 'Post New RFQ'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 hover:border-[#202522] transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#9b452f] bg-[#9b452f]/10 px-2 py-0.5 rounded">
                      {rfq.rfq_number}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                        rfq.status === 'RECEIVING_QUOTES'
                          ? 'bg-[#596348] text-white'
                          : rfq.status === 'UNDER_EVALUATION'
                          ? 'bg-[#c38b40] text-[#202522]'
                          : 'bg-[#202522] text-[#eee8dc]'
                      }`}
                    >
                      {rfq.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#70695f]">
                    <span>Published: {rfq.published_at}</span>
                    <span>•</span>
                    <span className="text-[#9b452f] font-bold">Deadline: {rfq.deadline_date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 space-y-1.5">
                    <h3 className="font-serif text-xl font-bold text-[#202522]">
                      {language === 'ar' ? rfq.commodity_ar : rfq.commodity_en}
                    </h3>
                    <p className="text-xs text-[#565047] font-mono">
                      {rfq.variety} · {rfq.quantity_mt} MT Required
                    </p>
                    <p className="text-xs text-[#70695f]">{rfq.packaging_spec}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rfq.required_certificates.map((cert, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-bold px-2 py-0.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-xs"
                        >
                          ✓ {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-1 text-xs">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#70695f]">
                      DESTINATION PORT & TERMS
                    </div>
                    <div className="font-bold text-[#202522] flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-[#596348]" />
                      <span>{rfq.target_port}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#9b452f] font-bold">
                      Preference: {rfq.incoterm_preference}
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-col sm:items-end justify-center gap-2">
                    <div className="text-center sm:text-right">
                      <span className="text-2xl font-serif font-bold text-[#202522]">
                        {rfq.bids_count}
                      </span>
                      <span className="text-xs text-[#70695f] block font-mono">
                        {language === 'ar' ? 'عطاءات مغلقة مستلمة' : 'sealed bids arrived'}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('quotes')}
                      className="px-3.5 py-2 bg-[#202522] hover:bg-[#9b452f] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'فحص العروض' : 'Compare Quotes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SEALED QUOTES MATRIX ================= */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] p-3.5 rounded-lg">
            <div className="text-xs text-[#202522] font-medium">
              {language === 'ar'
                ? 'مقارنة مباشرة لعروض الأسعار الرسمية المغلقة المقدمة من المصدرين:'
                : 'Side-by-side comparison of private sealed quotations submitted by qualified Egyptian exporters:'}
            </div>
            <span className="text-xs font-mono font-bold text-[#596348] bg-[#596348]/10 px-2.5 py-1 rounded">
              {quotes.length} LIVE BIDS UNLOCKED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 flex flex-col justify-between hover:border-[#202522] transition-all shadow-sm space-y-4 relative"
              >
                {q.highlight_badge && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#9b452f] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm rounded-xs">
                    {q.highlight_badge}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="border-b border-[#b9aa95]/60 pb-3">
                    <span className="text-[10px] font-mono font-bold text-[#70695f] uppercase tracking-wider block">
                      SUPPLIER / PACKHOUSE
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#202522]">
                      {q.supplier_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#565047] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#9b452f]" />
                      <span>{q.supplier_location}</span>
                      <span className="font-mono text-[10px]">({q.supplier_cr})</span>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-lg">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-serif font-bold text-[#202522]">
                        ${q.price_per_mt_usd}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#596348]">
                        / MT · {q.incoterm}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#70695f] font-mono mt-0.5">
                      Loading: {q.port_of_loading} → {q.destination_port}
                    </div>
                  </div>

                  {/* Commercial Specifications */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#70695f]">Lead Time:</span>
                      <span className="font-bold text-[#202522]">{q.lead_time_days} days to vessel</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#70695f]">Packaging:</span>
                      <span className="font-medium text-[#202522] text-right truncate max-w-44">
                        {q.packaging}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#70695f]">Payment:</span>
                      <span className="font-medium text-[#202522] text-right truncate max-w-44">
                        {q.payment_terms}
                      </span>
                    </div>
                  </div>

                  {/* Quality Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {q.aweta_graded && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#596348]/15 text-[#596348] border border-[#596348]/30 rounded-xs">
                        ✓ AWETA OPTICAL
                      </span>
                    )}
                    {q.cold_storage_precooled && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#596348]/15 text-[#596348] border border-[#596348]/30 rounded-xs">
                        ✓ PRE-COOLED 4°C
                      </span>
                    )}
                    {q.certificates.map((c, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-bold px-1.5 py-0.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#b9aa95]/60 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedQuote(q)}
                    className="flex-1 py-2 bg-[#202522] hover:bg-[#9b452f] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors text-center"
                  >
                    {language === 'ar' ? 'تفاصيل العرض' : 'Inspect Breakdown'}
                  </button>

                  <button
                    onClick={() => handleAcceptQuote(q)}
                    className="px-3 py-2 bg-[#596348] hover:bg-[#48503a] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                    title="Accept Quote & Draft Proforma"
                  >
                    ✓ Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: VERIFIED PACKHOUSES ================= */}
      {activeTab === 'packhouses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] p-3.5 rounded-lg">
            <div className="text-xs text-[#202522] font-medium">
              {language === 'ar'
                ? 'فهرس محطات التعبئة والمزارع المصرية المفحوصة والمطابقة لمعايير الاستيراد الأوروبية والخليجية:'
                : 'Vetted Egyptian agricultural packhouses cleared for European Union & Gulf supermarket standards:'}
            </div>
            <Link
              href="/importers"
              className="text-xs font-bold text-[#9b452f] hover:underline flex items-center gap-1"
            >
              <span>Explore Public Directory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packhouses.map((pack) => (
              <div
                key={pack.id}
                className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 flex flex-col justify-between hover:border-[#202522] transition-all shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#596348] uppercase tracking-wider block">
                        VERIFIED EXPORTER · {pack.cr_number}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#202522] mt-0.5">
                        {language === 'ar' ? pack.name_ar : pack.name_en}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-[#565047] mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#9b452f]" />
                        <span>{pack.governorate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Packhouse Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded">
                      <span className="text-[10px] text-[#70695f] uppercase block">Annual Capacity</span>
                      <span className="font-serif font-bold text-[#202522] text-sm">
                        {pack.annual_capacity_mt.toLocaleString()} MT
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded">
                      <span className="text-[10px] text-[#70695f] uppercase block">Cold Storage</span>
                      <span className="font-serif font-bold text-[#202522] text-sm">
                        {pack.cold_storage_capacity_mt.toLocaleString()} MT
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-[10px] uppercase font-bold text-[#70695f]">
                      SORTING & GRADING LINE
                    </div>
                    <div className="text-[#202522] font-mono text-[11px] bg-[#eee8dc] p-2 border border-[#b9aa95]/60 rounded">
                      {pack.sorting_lines}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[10px] uppercase font-bold text-[#70695f]">
                      VERIFIED AUDITED CERTS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pack.certificates.map((c, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-bold px-2 py-0.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-xs"
                        >
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Unlocked Contact */}
                <div className="pt-3 border-t border-[#b9aa95]/60 space-y-2">
                  <button
                    onClick={() => setContactModalPackhouse(pack)}
                    className="w-full py-2 bg-[#596348] hover:bg-[#48503a] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct WhatsApp & Call Packhouse</span>
                  </button>

                  <Link
                    href={`/exporters/${pack.slug}`}
                    target="_blank"
                    className="w-full py-1.5 text-center text-xs text-[#70695f] hover:text-[#202522] block font-mono"
                  >
                    View Complete Facility Showroom →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: REEFER SHIPMENTS TELEMETRY ================= */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] p-3.5 rounded-lg">
            <div className="text-xs text-[#202522] font-medium">
              {language === 'ar'
                ? 'تتبع حي للحاويات المبردة وسفن الشحن المتجهة للموانئ الأوروبية والخليجية:'
                : 'Live cold-chain tracking for active reefer containers departing Egyptian ports:'}
            </div>
            <span className="text-xs font-mono font-bold text-[#596348] bg-[#596348]/10 px-2 py-1 rounded">
              3 ACTIVE VOYAGES
            </span>
          </div>

          <div className="space-y-4">
            {shipments.map((ship) => (
              <div
                key={ship.id}
                className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Container className="w-4 h-4 text-[#9b452f]" />
                    <span className="font-mono text-sm font-bold text-[#202522]">
                      {ship.container_number}
                    </span>
                    <span className="text-[10px] font-mono text-[#70695f]">
                      (Booking: {ship.booking_ref})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#596348] text-white text-[10px] font-bold uppercase font-mono">
                      <Thermometer className="w-3 h-3" />
                      Steady at {ship.set_temperature_c.toFixed(1)}°C
                    </span>
                    <span className="px-2 py-0.5 bg-[#202522] text-[#eee8dc] text-[10px] font-bold uppercase rounded-xs">
                      {ship.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#70695f] block">
                      COMMODITY & SUPPLIER
                    </span>
                    <div className="font-serif font-bold text-[#202522] text-sm mt-0.5">
                      {ship.commodity}
                    </div>
                    <div className="text-[#565047]">{ship.supplier_name}</div>
                    <div className="text-[#70695f] font-mono text-[10px] mt-0.5">
                      Net Weight: {ship.quantity_mt} MT
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#70695f] block">
                      CARRIER & VESSEL
                    </span>
                    <div className="font-bold text-[#202522] mt-0.5">{ship.shipping_line}</div>
                    <div className="text-[#565047] font-mono">{ship.vessel_name}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#70695f] block">
                      ORIGIN & DESTINATION
                    </span>
                    <div className="font-bold text-[#202522] mt-0.5">{ship.port_of_departure}</div>
                    <div className="text-[#565047]">→ {ship.port_of_arrival}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#70695f] block">
                      ESTIMATED SCHEDULE
                    </span>
                    <div className="font-mono text-[#202522]">ETD: {ship.etd}</div>
                    <div className="font-mono font-bold text-[#9b452f]">ETA: {ship.eta}</div>
                  </div>
                </div>

                {/* Shipping documentation telemetry */}
                <div className="pt-3 border-t border-[#b9aa95]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#70695f]">
                    <span>B/L: <strong className="text-[#202522]">{ship.bill_of_lading_number}</strong></span>
                    <span>•</span>
                    <span>Phyto Cert: <strong className="text-[#596348]">{ship.phytosanitary_cert_number} (VERIFIED)</strong></span>
                  </div>

                  <button
                    onClick={() => addToast('info', `Downloaded shipping packet for ${ship.container_number}`)}
                    className="px-3 py-1.5 bg-[#eee8dc] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    Download Clearance Docs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: COMPLIANCE & MRL CHECKER ================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9b452f]">
                IMPORT GOVERNANCE & FOOD SAFETY
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#202522]">
                European Union & Gulf MRL Pesticide Threshold Validator
              </h2>
              <p className="text-xs text-[#565047] max-w-2xl leading-relaxed">
                All Egyptian packhouses listed on Market 365 operate under the supervision of the Central
                Administration of Plant Quarantine (CAPQ) and are audited for compliance with EU Regulation
                (EC) No 396/2005.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#596348] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>EU Maximum Residue Limits (MRL)</span>
                </div>
                <p className="text-[11px] text-[#70695f] leading-relaxed">
                  Laboratory multi-residue pesticide screen certificates (GC-MS/MS & LC-MS/MS) attached to every container lot prior to customs release.
                </p>
              </div>

              <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#596348] font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>GlobalG.A.P. v6.0 + GRASP</span>
                </div>
                <p className="text-[11px] text-[#70695f] leading-relaxed">
                  Full orchard-to-packhouse farm assurance including worker welfare and social practice evaluation for European retail supermarket chains.
                </p>
              </div>

              <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-[#596348] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cold-Treatment (CT) Protocols</span>
                </div>
                <p className="text-[11px] text-[#70695f] leading-relaxed">
                  In-transit USDA / EU certified cold-treatment probes verified for Ceratitis capitata fruit fly protocols during marine voyages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUOTE INSPECTOR BREAKDOWN ================= */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#b9aa95] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#9b452f]">
                  COMMERCIAL QUOTATION INSPECTOR
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#202522]">
                  {selectedQuote.supplier_name}
                </h3>
                <p className="text-xs text-[#70695f]">
                  {selectedQuote.supplier_location} · {selectedQuote.supplier_cr}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-[#70695f] hover:text-[#202522] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-xl space-y-3">
              <div className="flex items-baseline justify-between border-b border-[#b9aa95]/40 pb-2">
                <span className="text-xs text-[#70695f]">Unit Price Quote:</span>
                <span className="text-2xl font-serif font-bold text-[#202522]">
                  ${selectedQuote.price_per_mt_usd} / MT
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#565047]">
                <div className="flex justify-between">
                  <span>Incoterm:</span>
                  <strong className="text-[#202522]">{selectedQuote.incoterm} {selectedQuote.destination_port}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Port of Departure:</span>
                  <strong className="text-[#202522]">{selectedQuote.port_of_loading}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lead Time:</span>
                  <strong className="text-[#202522]">{selectedQuote.lead_time_days} days to vessel</strong>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Spec:</span>
                  <strong className="text-[#202522]">{selectedQuote.packaging}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Terms:</span>
                  <strong className="text-[#202522]">{selectedQuote.payment_terms}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Offer Validity:</span>
                  <strong className="text-[#9b452f]">{selectedQuote.valid_until}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAcceptQuote(selectedQuote)}
                className="flex-1 py-3 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              >
                Accept & Request Proforma
              </button>

              <button
                onClick={() => {
                  handleShortlistQuote(selectedQuote);
                  setSelectedQuote(null);
                }}
                className="px-4 py-3 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Shortlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT WHATSAPP CONNECT ================= */}
      {contactModalPackhouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#b9aa95] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#596348]">
                  VERIFIED DIRECT SUPPLIER CONNECT
                </span>
                <h3 className="font-serif text-xl font-bold text-[#202522]">
                  {contactModalPackhouse.name_en}
                </h3>
                <p className="text-xs text-[#70695f]">
                  Contact: {contactModalPackhouse.contact_person}
                </p>
              </div>
              <button
                onClick={() => setContactModalPackhouse(null)}
                className="text-[#70695f] hover:text-[#202522] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-xl space-y-3 text-xs">
              <div className="text-[11px] text-[#565047] leading-relaxed">
                Connect directly with the commercial director without platform middleman fees or transaction commissions.
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2.5 bg-[#e4dac9] border border-[#b9aa95] rounded">
                  <span className="font-bold text-[#202522]">WhatsApp Direct:</span>
                  <span className="font-mono text-[#596348] font-bold">
                    {contactModalPackhouse.whatsapp}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#e4dac9] border border-[#b9aa95] rounded">
                  <span className="font-bold text-[#202522]">Hotline / Phone:</span>
                  <span className="font-mono text-[#202522]">{contactModalPackhouse.phone}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#e4dac9] border border-[#b9aa95] rounded">
                  <span className="font-bold text-[#202522]">Email:</span>
                  <span className="font-mono text-[#9b452f] truncate max-w-44">
                    {contactModalPackhouse.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${contactModalPackhouse.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                  contactModalPackhouse.contact_person
                )},%20I%20am%20contacting%20you%20via%20Market%20365%20regarding%20sourcing%20agricultural%20commodities.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-[#596348] hover:bg-[#48503a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch WhatsApp Chat</span>
              </a>

              <button
                onClick={() => setContactModalPackhouse(null)}
                className="px-4 py-3 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
