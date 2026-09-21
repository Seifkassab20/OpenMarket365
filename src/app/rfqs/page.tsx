'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackRfqs, fallbackCategories } from '@/lib/data/fallbackData';
import { 
  FileSpreadsheet, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Send, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function RfqsBoardPage() {
  const { language, direction, t } = useLanguage();
  const [selectedRfqModal, setSelectedRfqModal] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [loadingPort, setLoadingPort] = useState('Alexandria');
  const [leadTime, setLeadTime] = useState('14');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <div>
          <div className="text-xs font-bold text-brand-emeraldLight uppercase tracking-wider mb-2">
            {language === 'ar' ? 'منظومة المناقصات والتوريدات' : 'International Buyer Procurement Desk'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('sectionRfqs')}
          </h1>
          <p className="text-sm text-brand-muted mt-2 max-w-2xl">
            {language === 'ar' 
              ? 'طلبات استيراد مؤكدة من كبرى الشركات العالمية مع آلية تقديم عروض أسعار مغلقة لمنع التواطؤ.'
              : 'Direct verified buyer procurement specifications. Submit sealed quotations with full price confidentiality.'
            }
          </p>
        </div>

        <Link
          href="/rfqs/create"
          className="px-5 py-3 rounded-xl font-bold text-xs bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald flex items-center gap-2 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('navPostRfq')}</span>
        </Link>
      </div>

      {/* RFQ Cards List */}
      <div className="space-y-6">
        {fallbackRfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="glass-panel rounded-3xl p-6 sm:p-8 hover:border-brand-emeraldLight/50 transition-all shadow-card"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-brand-border/60">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-emeraldDark text-brand-emeraldLight border border-brand-emeraldLight/30">
                    {rfq.incoterm || 'CIF'}
                  </span>
                  <span className="text-xs font-bold text-brand-gold">
                    {rfq.required_quantity} {rfq.quantity_unit}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/5 text-brand-muted border border-brand-border">
                    {rfq.category?.name_en}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {rfq.destination_port}
                </h3>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-right">
                  <span className="text-[11px] text-brand-dim block uppercase">Quotation Deadline</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rfq.delivery_deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRfqModal(rfq.id)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('submitQuote')}</span>
                </button>
              </div>
            </div>

            {/* RFQ Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
              <div>
                <span className="text-brand-dim font-medium uppercase text-[10px] block mb-1">
                  {language === 'ar' ? 'المواصفات الفنية والجودة:' : 'Technical Specifications:'}
                </span>
                <p className="text-brand-text leading-relaxed">
                  {rfq.technical_specifications}
                </p>
              </div>

              <div>
                <span className="text-brand-dim font-medium uppercase text-[10px] block mb-1">
                  {language === 'ar' ? 'اشتراطات التعبئة والتغليف:' : 'Packaging Requirements:'}
                </span>
                <p className="text-brand-text leading-relaxed">
                  {rfq.packaging_requirements}
                </p>
              </div>

              <div>
                <span className="text-brand-dim font-medium uppercase text-[10px] block mb-1">
                  {language === 'ar' ? 'شروط السداد المالي:' : 'Payment Terms:'}
                </span>
                <p className="text-brand-gold font-medium leading-relaxed">
                  {rfq.payment_terms}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-dim">
              <span>Verified Buyer: <strong className="text-brand-text font-medium">{rfq.requester?.company_name}</strong></span>
              <span className="flex items-center gap-1 text-brand-emeraldLight">
                <ShieldCheck className="w-4 h-4" />
                <span>Anti-Collusion Sealed Bid Protocol</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sealed Bid Quote Modal */}
      {selectedRfqModal && activeModalRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-gold rounded-3xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRfqModal(null)}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-brand-emeraldLight uppercase tracking-wider">
                {language === 'ar' ? 'تقديم عرض سعر مشفر' : 'Submit Sealed Price Quotation'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {activeModalRfq.destination_port}
              </h3>
              <p className="text-xs text-brand-dim mt-1">
                {language === 'ar' 
                  ? 'عرض السعر مشفر ولا يظهر لأي مصدر منافس، ويفك تشفيره حصراً للمشتري.'
                  : 'Bids remain sealed under anti-collusion RLS policies and are only unlocked by the buyer.'
                }
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-brand-emerald/10 border border-brand-emeraldLight/40 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-brand-emeraldLight mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">
                  {language === 'ar' ? 'تم تسجيل عرض السعر بنجاح!' : 'Sealed Quote Submitted!'}
                </h4>
                <p className="text-xs text-brand-muted">
                  {language === 'ar' ? 'تم إشعار المشتري الدولي وسيتم التواصل في حال الترسية.' : 'Buyer notified. Mutual contact unlock happens upon acceptance.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-white mb-1">
                    {language === 'ar' ? 'سعر الطن بالدولار (USD / MT)' : 'Unit Price (USD / Metric Ton)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="e.g. 680"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white font-mono focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-white mb-1">
                      {language === 'ar' ? 'ميناء الشحن المصري' : 'Port of Loading'}
                    </label>
                    <select
                      value={loadingPort}
                      onChange={(e) => setLoadingPort(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy border border-brand-border text-white focus:border-brand-gold focus:outline-none"
                    >
                      <option value="Alexandria">Alexandria Port</option>
                      <option value="Damietta">Damietta Port</option>
                      <option value="Port Said East">Port Said East</option>
                      <option value="Dekheila">Dekheila Port</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-white mb-1">
                      {language === 'ar' ? 'مدة التجهيز (أيام)' : 'Lead Time (Days)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={leadTime}
                      onChange={(e) => setLeadTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white font-mono focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald transition-all mt-4"
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
