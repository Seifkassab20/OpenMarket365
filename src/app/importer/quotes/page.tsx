'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { importerService, SealedQuotation, formatPrice } from '@/lib/services/importerService';
import EnquiryButton from '@/components/importer/EnquiryButton';
import UnlockedContactModal, { AcceptQuoteButton, useQuoteAcceptance } from '@/components/importer/UnlockedContactModal';
import { MapPin } from 'lucide-react';

export default function ImporterQuotesPage() {
  const { language } = useLanguage();
  const [quotes, setQuotes] = useState<SealedQuotation[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<SealedQuotation | null>(null);

  useEffect(() => {
    importerService.getSealedQuotes().then(setQuotes);
  }, []);

  const { accept, unlocked, closeUnlocked } = useQuoteAcceptance(setQuotes);

  const handleAccept = (quote: SealedQuotation) => {
    setSelectedQuote(null);
    accept(quote);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
              COMMERCIAL BIDS
            </span>
            <span className="text-xs text-[#70695f] font-mono">100% Encrypted Sealed Bidding</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#202522]">
            {language === 'ar' ? 'مصفوفة عروض الأسعار المغلقة' : 'Sealed Quotations Comparison Matrix'}
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            {language === 'ar'
              ? 'مقارنة مباشرة بين عروض الموردين المعتمدة وفقاً لشروط الشحن FOB وCIF وأوقات التجهيز والتعبئة.'
              : 'Direct side-by-side comparison of verified Egyptian exporter bids by Incoterms, lead time, and landed cost.'}
          </p>
        </div>

        <Link
          href="/importer"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
        >
          <span>{language === 'ar' ? 'العودة للوحة المشتريات' : 'Back to Procurement Desk'}</span>
        </Link>
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
                  PACKHOUSE PRODUCER
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
                Inspect Specs
              </button>

              <AcceptQuoteButton
                quote={q}
                onAccept={handleAccept}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quote Inspection Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#b9aa95] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#9b452f]">
                  COMMERCIAL BID DETAILS
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

            <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-xl space-y-3 text-xs">
              <div className="flex items-baseline justify-between border-b border-[#b9aa95]/40 pb-2">
                <span className="text-xs text-[#70695f]">Quoted Price:</span>
                <span className="text-2xl font-serif font-bold text-[#202522]">
                  {formatPrice(selectedQuote)} / MT
                </span>
              </div>
              <div className="space-y-1.5 text-[#565047]">
                <div className="flex justify-between">
                  <span>Incoterm:</span>
                  <strong className="text-[#202522]">{selectedQuote.incoterm} {selectedQuote.destination_port}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Port of Loading:</span>
                  <strong className="text-[#202522]">{selectedQuote.port_of_loading}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ready to Vessel:</span>
                  <strong className="text-[#202522]">{selectedQuote.lead_time_days} days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Packaging:</span>
                  <strong className="text-[#202522]">{selectedQuote.packaging}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Terms:</span>
                  <strong className="text-[#202522]">{selectedQuote.payment_terms}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <strong className="text-[#9b452f]">{selectedQuote.valid_until}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AcceptQuoteButton
                quote={selectedQuote}
                onAccept={handleAccept}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
              />
              <EnquiryButton supplierId={selectedQuote.supplier_id} supplierName={selectedQuote.supplier_name} />
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-3 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                Close
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
