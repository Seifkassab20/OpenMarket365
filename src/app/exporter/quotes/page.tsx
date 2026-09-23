'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterQuote,
} from '@/lib/services/exporterService';
import {
  DollarSign,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Ship,
  ExternalLink,
  PackageCheck,
} from 'lucide-react';

export default function ExporterQuotesPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [quotes, setQuotes] = useState<ExporterQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      const data = await exporterService.getMyQuotes('c-nileagro-01');
      setQuotes(data);
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل سجل العروض' : 'Failed to retrieve quotation archive',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      (q.rfq_title_en && q.rfq_title_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.rfq_title_ar && q.rfq_title_ar.includes(searchQuery)) ||
      q.port_of_loading.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' ? true : q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
              {isAr ? 'سجل العروض والمناقصات التجارية' : 'COMMERCIAL QUOTATION VAULT'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
              {quotes.length} {isAr ? 'عرض مسجل' : 'Bids Logged'}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#202522]">
            {isAr ? 'عروضي التجارية المقدمة للمستوردين' : 'My Commercial Quotations'}
          </h1>
          <p className="text-xs text-[#70695f]">
            {isAr
              ? 'متابعة العروض المقدمة لمناقصات المشترين الدوليين، وحالات المراجعة، وتفاصيل الشحن والأسعار.'
              : 'Monitor submitted commercial bids, buyer evaluation progress, port logistics, and pricing agreements.'}
          </p>
        </div>

        <Link
          href="/exporter/rfqs"
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-2 transition-all shadow-sm self-start md:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'استعراض العطاءات المتاحة' : 'BROWSE MATCHING RFQS'}</span>
        </Link>
      </div>

      {/* Anti-Collusion Vault Banner */}
      <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
        <Lock className="w-5 h-5 text-[#9b452f] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs leading-relaxed">
          <span className="font-bold text-[#9b452f]">
            {isAr ? 'حماية سرية العروض والمنافسة الشريفة: ' : 'Encrypted Commercial Confidentiality: '}
          </span>
          <p className="text-[#70695f]">
            {isAr
              ? 'تعتبر هذه البيانات سرية للغاية ولا تظهر إلا للمستورد صاحب الطلب ومسؤولي المطابقة بالمنصة. لا يمكن لأي شركة مصدرة أخرى الاطلاع على أسعارك أو شروطك.'
              : 'These bids are strictly classified and exclusively visible between your firm and the verified buyer. No competing supplier can access your pricing or contractual terms.'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-[#70695f]" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'بحث بالمنتج، العطاء، أو ميناء الشحن...'
                : 'Search by RFQ title or loading port...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded-lg text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#eee8dc] border border-[#b9aa95] rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-[#202522] text-white font-bold'
                : 'text-[#70695f] hover:text-[#202522]'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`px-3 py-1 rounded transition-colors ${
              statusFilter === 'SUBMITTED'
                ? 'bg-[#9b452f] text-white font-bold'
                : 'text-[#70695f] hover:text-[#202522]'
            }`}
          >
            {isAr ? 'مقدم' : 'Submitted'}
          </button>
          <button
            onClick={() => setStatusFilter('UNDER_REVIEW')}
            className={`px-3 py-1 rounded transition-colors ${
              statusFilter === 'UNDER_REVIEW'
                ? 'bg-[#c38b40] text-white font-bold'
                : 'text-[#70695f] hover:text-[#202522]'
            }`}
          >
            {isAr ? 'قيد المراجعة' : 'Review'}
          </button>
          <button
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`px-3 py-1 rounded transition-colors ${
              statusFilter === 'ACCEPTED'
                ? 'bg-[#2d7a58] text-white font-bold'
                : 'text-[#70695f] hover:text-[#202522]'
            }`}
          >
            {isAr ? 'مقبول' : 'Accepted'}
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#70695f]">
              {isAr ? 'جارِ فتح الخزينة المشفرة للعروض...' : 'Decrypting quotation repository...'}
            </p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-16 text-center space-y-3 p-6">
            <DollarSign className="w-12 h-12 text-[#70695f] mx-auto opacity-50" />
            <p className="text-sm font-serif font-bold text-[#202522]">
              {isAr ? 'لا توجد عروض أسعار مطابقة' : 'No Quotations Found'}
            </p>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'لم تقم بتقديم عروض أسعار بعد أو لا توجد نتائج مطابقة لفلتر البحث.'
                : 'You have not submitted commercial quotations for this filter.'}
            </p>
            <Link
              href="/exporter/rfqs"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#9b452f] text-white rounded-xl text-xs font-mono font-bold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصفح العطاءات وقدم عرضاً' : 'Browse Open RFQs'}</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-[#dfd4c1] border-b border-[#b9aa95] text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f]">
                <tr>
                  <th className="py-3.5 px-4">{isAr ? 'المناقصة والعطاء' : 'Tender / Commodity'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'السعر التجاري' : 'Unit Bid'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'ميناء الشحن والتجهيز' : 'Port of Loading & Lead Time'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'تاريخ الصلاحية' : 'Bid Validity'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'حالة العرض' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-center">{isAr ? 'دفتر الشروط' : 'Dossier'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b9aa95]/40 font-mono">
                {filteredQuotes.map((quote) => {
                  const isAccepted = quote.status === 'ACCEPTED';
                  const isReview = quote.status === 'UNDER_REVIEW';
                  const isSubmitted = quote.status === 'SUBMITTED';
                  const isRejected = quote.status === 'REJECTED';

                  return (
                    <tr
                      key={quote.id}
                      className="hover:bg-[#dfd4c1]/40 transition-colors"
                    >
                      <td className="py-4 px-4 font-sans">
                        <div className="font-bold text-sm text-[#202522]">
                          {isAr ? quote.rfq_title_ar || quote.rfq_title_en : quote.rfq_title_en}
                        </div>
                        <div className="text-[10px] font-mono text-[#70695f] mt-0.5">
                          {isAr ? 'تاريخ التقديم:' : 'Submitted:'}{' '}
                          {new Date(quote.submitted_at).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-sm text-[#9b452f]">
                          ${quote.unit_price}{' '}
                          <span className="text-[10px] text-[#70695f] font-normal">{quote.currency} / MT</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[11px] text-[#202522]">
                        <div className="flex items-center gap-1.5">
                          <Ship className="w-3.5 h-3.5 text-[#9b452f]" />
                          <span>{quote.port_of_loading}</span>
                        </div>
                        <div className="text-[10px] text-[#70695f] mt-0.5">
                          {isAr ? 'مدة التجهيز:' : 'Lead Time:'} {quote.lead_time_days} {isAr ? 'يوم' : 'days'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[11px] text-[#70695f]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#c38b40]" />
                          <span>{quote.valid_until}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2d7a58]/15 text-[#2d7a58] border border-[#2d7a58]/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isAr ? 'مقبول من المستورد' : 'ACCEPTED'}</span>
                          </span>
                        )}
                        {isReview && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c38b40]/15 text-[#c38b40] border border-[#c38b40]/30 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isAr ? 'قيد تقييم المشتري' : 'UNDER REVIEW'}</span>
                          </span>
                        )}
                        {isSubmitted && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#202522]/10 text-[#202522] border border-[#202522]/30">
                            <Lock className="w-3 h-3 text-[#9b452f]" />
                            <span>{isAr ? 'مظروف مشفر ومقدم' : 'SEALED & SENT'}</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#9b452f]/15 text-[#9b452f] border border-[#9b452f]/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'غير مقبول' : 'NOT SELECTED'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/exporter/rfqs/${quote.rfq_id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#b9aa95] hover:bg-[#eee8dc] text-[#202522] text-[11px] transition-colors"
                          title={isAr ? 'عرض العطاء' : 'View RFQ'}
                        >
                          <ExternalLink className="w-3 h-3 text-[#70695f]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
