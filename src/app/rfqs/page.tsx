'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackRfqs } from '@/lib/data/fallbackData';
import { 
  FileSpreadsheet, 
  Clock, 
  PlusCircle, 
  Send, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function RfqsBoardPage() {
  const { language, direction } = useLanguage();
  const [selectedRfqModal, setSelectedRfqModal] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [loadingPort, setLoadingPort] = useState('Alexandria');
  const [leadTime, setLeadTime] = useState('14');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState<string | null>(null);

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSelectedRfqModal(null);
      setSubmittedSuccess(false);
      setQuotePrice('');
    }, 2000);
  };

  const activeModalRfq = fallbackRfqs.find((r) => r.id === selectedRfqModal);

  // Replit-style mock quotations for the highlighted active procurement route
  const activeRouteQuotes = [
    {
      id: 'quote-1',
      exporter: 'Nile Valley Agrico',
      tier: 'ELITE',
      incoterm: 'CIF Rotterdam',
      price: '$660',
      leadTime: '12 Days',
      pack: '15kg Telescopic Cartons',
      status: 'BEST PRICE'
    },
    {
      id: 'quote-2',
      exporter: 'Delta Fresh Produce',
      tier: 'PREMIUM',
      incoterm: 'CIF Rotterdam',
      price: '$675',
      leadTime: '10 Days',
      pack: '15kg Open Top + Ethylene Filter',
      status: 'FAST TRANSIT'
    },
    {
      id: 'quote-3',
      exporter: 'Sonac Citadel Agro',
      tier: 'ELITE',
      incoterm: 'FOB Alexandria',
      price: '$595',
      leadTime: '7 Days',
      pack: 'Standard Export Wooden Pallets',
      status: 'FOB OPTION'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#b9aa95]">
        <div>
          <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2">
            {language === 'ar' ? 'منظومة المناقصات والتوريدات' : '04 / TRADE DESK • ACTIVE PROCUREMENT'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#202522] tracking-tight">
            {language === 'ar' ? 'مكتب التداول والطلبات.' : 'Your trade desk.'}
          </h1>
          <p className="text-sm text-[#70695f] mt-3 max-w-2xl leading-relaxed">
            {language === 'ar' 
              ? 'مراجعة عروض الأسعار المغلقة والمشفرة من المصدرين المعتمدين، مقارنة الشروط اللوجستية، وتثبيت التخصيص للموانئ العالمية.'
              : 'Review sealed quotes from verified Egyptian exporters, compare incoterms, and lock allocated volumes with mutual escrow protection.'
            }
          </p>
        </div>

        <Link
          href="/rfqs/create"
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-1.5 shadow-sm transition-colors flex-shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ar' ? 'طرح طلب توريد (RFQ)' : '+ Post an RFQ'}</span>
        </Link>
      </div>

      {/* Featured Route Spotlight (Matching Replit "Three routes to Rotterdam.") */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#b9aa95]">
          <div>
            <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
              CURRENT ACTIVE RUN • REF-RFQ-2026-0805
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#202522] mt-1">
              Three routes to Rotterdam.
            </h2>
            <p className="text-xs text-[#70695f] mt-1">
              120 Metric Tons • Fresh Valencia Oranges Grade A • Required Arrival Week 42
            </p>
          </div>

          <span className="px-3 py-1 text-xs font-mono font-bold bg-[#596348] text-white self-start sm:self-auto">
            3 BIDS SEALED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeRouteQuotes.map((q) => (
            <div
              key={q.id}
              className={`p-5 border transition-all flex flex-col justify-between ${
                acceptedOffer === q.id
                  ? 'bg-[#eee8dc] border-[#596348] ring-2 ring-[#596348]'
                  : 'bg-[#eee8dc] border-[#b9aa95] hover:border-[#202522]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-wider">
                    {q.status}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-[#202522] text-[#eee8dc]">
                    {q.tier}
                  </span>
                </div>

                <h3 className="text-lg font-serif text-[#202522] font-bold">
                  {q.exporter}
                </h3>
                <div className="text-xs font-mono text-[#70695f] mt-0.5">
                  {q.incoterm}
                </div>

                <div className="my-4 pb-4 border-b border-[#b9aa95]/60">
                  <span className="text-[10px] uppercase font-bold text-[#70695f] block">Offered Rate</span>
                  <div className="text-2xl font-serif font-bold text-[#202522]">
                    {q.price} <span className="text-xs font-sans font-normal text-[#70695f]">/ MT</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#565047] mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#70695f]">Transit Window:</span>
                    <span className="font-bold text-[#202522]">{q.leadTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70695f]">Packaging:</span>
                    <span className="font-medium text-[#202522] truncate max-w-[130px]">{q.pack}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setAcceptedOffer(q.id)}
                className={`w-full py-2.5 text-xs font-bold transition-colors ${
                  acceptedOffer === q.id
                    ? 'bg-[#596348] text-white flex items-center justify-center gap-1.5'
                    : 'bg-[#202522] hover:bg-black text-[#eee8dc]'
                }`}
              >
                {acceptedOffer === q.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ALLOCATION LOCKED</span>
                  </>
                ) : (
                  'ACCEPT THIS ROUTE →'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RFQ Open Board */}
      <div className="space-y-6">
        <div className="pb-2 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
            SEALED TENDER ROSTER
          </span>
          <h2 className="text-2xl font-serif text-[#202522]">
            Active Procurement Solicitations.
          </h2>
        </div>

        {fallbackRfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 hover:border-[#202522] transition-all shadow-sm"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#b9aa95]">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#202522] text-[#eee8dc]">
                    {rfq.incoterm || 'CIF'}
                  </span>
                  <span className="text-xs font-bold text-[#9b452f]">
                    {rfq.required_quantity} {rfq.quantity_unit}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#eee8dc] text-[#565047] border border-[#b9aa95]">
                    {rfq.category?.name_en}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-[#202522]">
                  {rfq.destination_port}
                </h3>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-[#70695f] uppercase tracking-wider block font-bold">Quotation Deadline</span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#9b452f]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rfq.delivery_deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRfqModal(rfq.id)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Quote</span>
                </button>
              </div>
            </div>

            {/* RFQ Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
              <div>
                <span className="text-[#70695f] font-bold uppercase tracking-wider text-[10px] block mb-1">
                  {language === 'ar' ? 'المواصفات الفنية والجودة:' : 'Technical Specifications:'}
                </span>
                <p className="text-[#565047] leading-relaxed">
                  {rfq.technical_specifications}
                </p>
              </div>

              <div>
                <span className="text-[#70695f] font-bold uppercase tracking-wider text-[10px] block mb-1">
                  {language === 'ar' ? 'اشتراطات التعبئة والتغليف:' : 'Packaging Requirements:'}
                </span>
                <p className="text-[#565047] leading-relaxed">
                  {rfq.packaging_requirements}
                </p>
              </div>

              <div>
                <span className="text-[#70695f] font-bold uppercase tracking-wider text-[10px] block mb-1">
                  {language === 'ar' ? 'شروط السداد المالي:' : 'Payment Terms:'}
                </span>
                <p className="text-[#202522] font-semibold leading-relaxed">
                  {rfq.payment_terms}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#b9aa95]/60 flex items-center justify-between text-xs text-[#70695f]">
              <span>Verified Buyer: <strong className="text-[#202522] font-medium">{rfq.requester?.company_name}</strong></span>
              <span className="flex items-center gap-1 text-[#596348] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Anti-Collusion Sealed Bid Protocol</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sealed Bid Quote Modal */}
      {selectedRfqModal && activeModalRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedRfqModal(null)}
              className="absolute top-4 right-4 p-2 text-[#70695f] hover:text-[#202522]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-4 border-b border-[#b9aa95]">
              <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
                {language === 'ar' ? 'تقديم عرض سعر مشفر' : 'SUBMIT SEALED QUOTE'}
              </span>
              <h3 className="text-2xl font-serif text-[#202522] mt-1">
                {activeModalRfq.destination_port}
              </h3>
              <p className="text-xs text-[#70695f] mt-1">
                {language === 'ar' 
                  ? 'عرض السعر مشفر ولا يظهر لأي مصدر منافس، ويفك تشفيره حصراً للمشتري.'
                  : 'Quotations remain encrypted under anti-collusion RLS policies and unlock only to the buyer.'
                }
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 bg-[#596348]/10 border border-[#596348] text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-[#596348] mx-auto animate-bounce" />
                <h4 className="text-lg font-serif text-[#202522] font-bold">
                  {language === 'ar' ? 'تم تسجيل عرض السعر بنجاح!' : 'Sealed Quote Submitted!'}
                </h4>
                <p className="text-xs text-[#70695f]">
                  {language === 'ar' ? 'تم إشعار المشتري الدولي وسيتم التواصل في حال الترسية.' : 'Buyer notified. Mutual contact unlock happens upon acceptance.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                    {language === 'ar' ? 'سعر الطن بالدولار (USD / MT)' : 'Unit Price (USD / Metric Ton)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="e.g. 680"
                    className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] font-mono focus:border-[#202522] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                      {language === 'ar' ? 'ميناء الشحن المصري' : 'Port of Loading'}
                    </label>
                    <select
                      value={loadingPort}
                      onChange={(e) => setLoadingPort(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none"
                    >
                      <option value="Alexandria">Alexandria Port</option>
                      <option value="Damietta">Damietta Port</option>
                      <option value="Port Said East">Port Said East</option>
                      <option value="Dekheila">Dekheila Port</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                      {language === 'ar' ? 'مدة التجهيز (أيام)' : 'Lead Time (Days)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] font-mono focus:border-[#202522] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-bold text-xs uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors mt-4"
                >
                  {language === 'ar' ? 'تأكيد إرسال العرض المغلق' : 'Confirm Sealed Submission'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

