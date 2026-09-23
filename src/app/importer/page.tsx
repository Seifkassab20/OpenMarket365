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
  formatPrice,
} from '@/lib/services/importerService';
import RfqStatusBadge, { ModerationNote, isBroadcast } from '@/components/importer/RfqStatusBadge';
import EnquiryButton from '@/components/importer/EnquiryButton';
import UnlockedContactModal, { AcceptQuoteButton, useQuoteAcceptance } from '@/components/importer/UnlockedContactModal';
import { FileSpreadsheet, Scale, TrendingUp, Plus, Clock, MapPin, Anchor, Building2 } from 'lucide-react';

type Tab = 'rfqs' | 'quotes';

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-[#e4dac9] border border-dashed border-[#b9aa95] rounded-xl p-8 text-center text-xs text-[#70695f]">
      {text}
    </div>
  );
}

export default function ImporterOverviewPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<ImporterTelemetry | null>(null);
  const [rfqs, setRfqs] = useState<ImporterRfqItem[]>([]);
  const [quotes, setQuotes] = useState<SealedQuotation[]>([]);

  // Active view tab
  const [activeTab, setActiveTab] = useState<Tab>('rfqs');

  // Selected Quote for Modal Inspection
  const [selectedQuote, setSelectedQuote] = useState<SealedQuotation | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, rfqData, quoteData] = await Promise.all([
        importerService.getTelemetry(),
        importerService.getActiveRfqs(),
        importerService.getSealedQuotes(),
      ]);
      setTelemetry(stats);
      setRfqs(rfqData);
      setQuotes(quoteData);
    } catch {
      addToast('error', 'Failed to load importer procurement data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FR-RFQ-005: accepting a quote awards the RFQ and unlocks the supplier's contact.
  const { accept, unlocked, closeUnlocked } = useQuoteAcceptance(setQuotes, (quote) =>
    setRfqs((rs) => rs.map((r) => (r.id === quote.rfq_id ? { ...r, status: 'CONTRACT_AWARDED' } : r)))
  );

  const handleAcceptQuote = (quote: SealedQuotation) => {
    setSelectedQuote(null);
    accept(quote);
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
              {language === 'ar' ? 'مكتب المشتريات الدولي' : 'GLOBAL PROCUREMENT DESK'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            {language === 'ar'
              ? 'لوحة تحكم المستورد والمشتري الدولي'
              : 'Importer Procurement & Sourcing Desk'}
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            {language === 'ar'
              ? 'طرح طلبات التوريد، مقارنة عروض الأسعار المغلقة، والتواصل المباشر مع المصدرين المصريين المعتمدين.'
              : 'Post RFQs, compare sealed quotations, and connect directly with verified Egyptian exporters.'}
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/exporters"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
          >
            <Building2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'دليل المصدرين' : 'Exporter Directory'}</span>
          </Link>
          <Link
            href="/importer/new-rfq"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm rounded-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'طرح طلب توريد جديد' : 'New Sourcing RFQ'}</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4${loading ? ' animate-pulse opacity-50' : ''}`}>
        {/* Metric 1: Active RFQs */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'طلبات التوريد النشطة' : 'Active Sourcing RFQs'}
            </span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#9b452f]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.active_rfqs_count ?? 0}
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
            {telemetry?.sealed_quotes_received ?? 0}
          </div>
          <div className="text-[10px] text-[#70695f] font-mono">
            {language === 'ar' ? '100% عروض مغلقة' : '100% Sealed bids'}
          </div>
        </div>

        {/* Metric 3: Bid Velocity */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {language === 'ar' ? 'متوسط سرعة الرد' : 'Avg Bid Response'}
            </span>
            <Clock className="w-3.5 h-3.5 text-[#596348]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">
            {telemetry?.avg_bid_response_hours ?? 0} <span className="text-xs font-normal font-sans">hrs</span>
          </div>
          <div className="text-[10px] text-[#2d7a58] font-bold">
            High responsiveness
          </div>
        </div>
      </div>

      {/* Navigation Desk Tabs */}
      <div className="flex items-center gap-2 border-b border-[#b9aa95] overflow-x-auto pb-px">
        {([
          { id: 'rfqs', labelEn: 'Active RFQs & Demands', labelAr: 'طلبات التوريد المفتوحة', count: rfqs.length },
          { id: 'quotes', labelEn: 'Sealed Quotations Matrix', labelAr: 'مقارنة عروض الأسعار المغلقة', count: quotes.length },
        ] as { id: Tab; labelEn: string; labelAr: string; count?: number }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {loading && (
        <div className="space-y-4 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 bg-[#e4dac9] border border-[#b9aa95] rounded-xl" />
          ))}
        </div>
      )}

      {/* ================= TAB 1: ACTIVE RFQS ================= */}
      {!loading && activeTab === 'rfqs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] p-3.5 rounded-lg">
            <div className="text-xs text-[#202522] font-medium">
              {language === 'ar'
                ? 'طلبات الشراء والتوريد المطروحة من شركتك للمصدرين المصريين المعتمدين:'
                : 'Current purchase requirements published to verified Egyptian exporters:'}
            </div>
            <Link
              href="/importer/new-rfq"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9b452f] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#833824] transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طرح طلب توريد' : 'Post New RFQ'}</span>
            </Link>
          </div>

          {rfqs.length === 0 && (
            <EmptyState text={language === 'ar' ? 'لا توجد طلبات توريد نشطة بعد.' : 'No active RFQs yet.'} />
          )}

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
                    <RfqStatusBadge status={rfq.status} />
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
                    {isBroadcast(rfq) ? (
                      <>
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
                      </>
                    ) : (
                      <ModerationNote rfq={rfq} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SEALED QUOTES MATRIX ================= */}
      {!loading && activeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] p-3.5 rounded-lg">
            <div className="text-xs text-[#202522] font-medium">
              {language === 'ar'
                ? 'مقارنة مباشرة لعروض الأسعار الرسمية المغلقة المقدمة من المصدرين:'
                : 'Side-by-side comparison of private sealed quotations submitted by qualified Egyptian exporters:'}
            </div>
            <span className="text-xs font-mono font-bold text-[#596348] bg-[#596348]/10 px-2.5 py-1 rounded">
              {quotes.length} SEALED BIDS
            </span>
          </div>

          {quotes.length === 0 && (
            <EmptyState text={language === 'ar' ? 'لم تصل عروض أسعار بعد.' : 'No quotations received yet.'} />
          )}

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
                        {formatPrice(q)}
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

                  <AcceptQuoteButton
                    quote={q}
                    onAccept={handleAcceptQuote}
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  />
                </div>
              </div>
            ))}
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
                  {formatPrice(selectedQuote)} / MT
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
              <AcceptQuoteButton
                quote={selectedQuote}
                onAccept={handleAcceptQuote}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              />

              <EnquiryButton supplierId={selectedQuote.supplier_id} supplierName={selectedQuote.supplier_name} />

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


      {unlocked && (
        <UnlockedContactModal quote={unlocked.quote} contact={unlocked.contact} onClose={closeUnlocked} />
      )}
    </div>
  );
}
