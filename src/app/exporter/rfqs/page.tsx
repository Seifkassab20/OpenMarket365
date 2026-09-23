'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterRfq,
} from '@/lib/services/exporterService';
import QuoteModal from '@/components/exporter/QuoteModal';
import ScrollReveal from '@/components/admin/ScrollReveal';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import {
  FileText,
  Search,
  Filter,
  Send,
  Lock,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Ship,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function ExporterRfqsPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [rfqs, setRfqs] = useState<ExporterRfq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState<ExporterRfq | null>(null);

  useEffect(() => {
    loadRfqs();
  }, []);

  const loadRfqs = async () => {
    setIsLoading(true);
    try {
      const data = await exporterService.getMatchingRfqs('c-nileagro-01');
      setRfqs(data);
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل طلبات عروض الأسعار' : 'Failed to retrieve RFQ leads',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuoteSubmit = async (payload: {
    unit_price: number;
    currency: string;
    port_of_loading: string;
    lead_time_days: number;
    valid_until: string;
    commercial_terms: string;
    packaging_details: string;
    delivery_terms: string;
  }) => {
    if (!selectedRfqForQuote) return;

    try {
      const res = await exporterService.submitQuote('c-nileagro-01', selectedRfqForQuote.id, payload);
      if (res.success) {
        showToast({
          title: isAr ? 'تم إرسال العرض بنجاح' : 'Sealed Quote Submitted',
          message: isAr
            ? 'تم إرسال عرض السعر التجاري المشفر للمستورد الدولي مباشرة وفق بروتوكول المناقصات المغلقة.'
            : 'Quote sealed and submitted to international buyer under confidential tender protocol.',
          type: 'success',
        });
        setSelectedRfqForQuote(null);
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل إرسال عرض السعر' : 'Failed to transmit quote',
        type: 'error',
      });
    }
  };

  const filteredRfqs = rfqs.filter((r) => {
    const matchesSearch =
      r.commodity_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.commodity_ar && r.commodity_ar.includes(searchQuery)) ||
      (r.destination_port && r.destination_port.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.requester_name && r.requester_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' ? true : r.category_code === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <ScrollReveal direction="down" delayMs={0}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
                {isAr ? 'عطاءات المشترين الدوليين' : 'VERIFIED BUYER PROCUREMENT LEADS'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/10 text-[#2d7a58] border border-[#2d7a58]/30">
                {rfqs.length} {isAr ? 'عطاء نشط' : 'Active Tenders'}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#202522]">
              {isAr ? 'طلبات عروض الأسعار المطابقة (RFQ Leads)' : 'Matching RFQ Procurement Leads'}
            </h1>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'عطاءات ومناقصات حصرية من مستوردين دوليين معتمدين تتطابق مع المحاصيل وشهادات الجودة لشركتك.'
                : 'Direct purchasing orders from verified European & Global buyers matched with your commodities and certifications.'}
            </p>
          </div>

          <Link
            href="/exporter/quotes"
            className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] transition-colors flex items-center gap-2 self-start md:self-auto"
          >
            <DollarSign className="w-4 h-4 text-[#9b452f]" />
            <span>{isAr ? 'عروضي التجارية السابقة' : 'VIEW MY SUBMITTED QUOTES'}</span>
          </Link>
        </div>
      </ScrollReveal>

      {/* Anti-Collusion & Sealed Bidding Guarantee */}
      <ScrollReveal direction="down" delayMs={30}>
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#dfd4c1]/50 border border-[#b9aa95] text-[#202522]">
          <Lock className="w-5 h-5 text-[#9b452f] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs leading-relaxed">
            <span className="font-bold text-[#9b452f]">
              {isAr ? 'ضمان سرية الأسعار ومنع الاحتكار (Confidential Sealed Tender): ' : 'Confidential Sealed Tender Integrity: '}
            </span>
            <p className="text-[#70695f]">
              {isAr
                ? 'وفقاً لمواصفات SRS v4.0، تخضع جميع العروض لنظام المظاريف المغلقة المشفرة. لا يمكن لأي مصدر منافس الاطلاع على أسعارك أو شروطك التجارية.'
                : 'Under SRS v4.0 compliance rules, all submitted commercial quotations are cryptographically sealed. Competing exporters are strictly prohibited from viewing each other’s bids.'}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Search & Filter Bar */}
      <ScrollReveal direction="down" delayMs={60}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-[#70695f]" />
            <input
              type="text"
              placeholder={
                isAr
                  ? 'بحث بالمنتج، اسم المستورد، أو ميناء الوصول...'
                  : 'Search by commodity, buyer name, destination port...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded-lg text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded-lg text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
            >
              <option value="ALL">{isAr ? 'جميع القطاعات' : 'All Categories'}</option>
              <option value="CITRUS">{isAr ? 'الموالح والحمضيات' : 'Citrus'}</option>
              <option value="FROZEN">{isAr ? 'الفواكه المجمدة IQF' : 'Frozen Fruits'}</option>
              <option value="VEGETABLES">{isAr ? 'الخضروات الطازجة' : 'Vegetables'}</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* RFQ Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl">
          <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#70695f]">
            {isAr ? 'جارِ فحص مناقصات المستوردين الدوليين...' : 'Scanning matching international tenders...'}
          </p>
        </div>
      ) : filteredRfqs.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-8">
          <FileText className="w-12 h-12 text-[#70695f] mx-auto opacity-50" />
          <h3 className="text-base font-serif font-bold text-[#202522]">
            {isAr ? 'لا توجد عطاءات مطابقة حالياً' : 'No Matching RFQs Found'}
          </h3>
          <p className="text-xs text-[#70695f] max-w-sm mx-auto">
            {isAr
              ? 'تأكد من تفعيل منتجاتك ورفع شهادات الجودة (GlobalGAP / BRC) لتصلك إشعارات فورية عند طرح مناقصات جديدة.'
              : 'Keep your products active and certifications verified to trigger automatic matching alerts for upcoming procurement runs.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRfqs.map((rfq, idx) => (
            <ScrollReveal key={rfq.id} delayMs={idx * 60} direction="up">
              <div
                className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#b9aa95]/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#9b452f]/10 text-[#9b452f] border border-[#9b452f]/30 uppercase">
                        {rfq.category_code || 'AGRICULTURE'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                        {rfq.destination_country_code}
                      </span>
                      <span className="text-[10px] font-mono text-[#70695f]">
                        {isAr ? 'المشتري المعتمد:' : 'Buyer:'} <strong>{rfq.requester_name}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#202522]">
                      {isAr ? rfq.commodity_ar || rfq.commodity_en : rfq.commodity_en}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="text-right rtl:text-left">
                      <span className="text-[10px] font-mono text-[#70695f] block">
                        {isAr ? 'الكمية المطلوبة' : 'Required Quantity'}
                      </span>
                      <span className="font-mono font-bold text-base text-[#202522]">
                        <AnimatedCounter end={rfq.required_quantity} duration={1000} /> {rfq.quantity_unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specs & Logistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                      <Ship className="w-3.5 h-3.5 text-[#9b452f]" />
                      <span>{isAr ? 'ميناء الوصول والشروط' : 'Destination & Incoterm'}</span>
                    </div>
                    <div className="font-mono font-bold text-[#202522]">{rfq.destination_port}</div>
                    <div className="text-[11px] text-[#70695f]">{rfq.incoterm}</div>
                  </div>

                  <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                      <Clock className="w-3.5 h-3.5 text-[#c38b40]" />
                      <span>{isAr ? 'المواعيد والموعد النهائي' : 'Delivery & Deadline'}</span>
                    </div>
                    <div className="font-mono font-bold text-[#202522]">
                      {isAr ? 'التسليم قبل:' : 'Target:'} {rfq.delivery_deadline}
                    </div>
                    <div className="text-[11px] text-[#9b452f] font-mono font-bold">
                      {isAr ? 'إغلاق المظاريف:' : 'Quote Closing:'} {rfq.quote_deadline ? new Date(rfq.quote_deadline).toLocaleDateString() : 'Active'}
                    </div>
                  </div>

                  <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2d7a58]" />
                      <span>{isAr ? 'الشهادات الإلزامية' : 'Mandatory Standards'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {rfq.mandatory_certificates?.map((cert) => (
                        <span
                          key={cert}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#dfd4c1] text-[#202522] border border-[#b9aa95]/60"
                        >
                          {cert}
                        </span>
                      )) || <span className="text-[11px] text-[#70695f]">Standard</span>}
                    </div>
                  </div>
                </div>

                {/* Technical Description Snippet */}
                {rfq.technical_specifications && (
                  <div className="text-xs text-[#70695f] bg-[#dfd4c1]/40 border border-[#b9aa95]/40 rounded-xl p-3 leading-relaxed">
                    <strong className="text-[#202522] font-mono text-[11px] block mb-0.5">
                      {isAr ? 'المواصفات الفنية المطلوبة:' : 'Technical Specifications:'}
                    </strong>
                    {rfq.technical_specifications}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <Link
                    href={`/exporter/rfqs/${rfq.id}`}
                    className="text-xs font-mono font-bold text-[#70695f] hover:text-[#202522] transition-colors flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'عرض دفتر الشروط والمواصفات الكاملة' : 'View Full Tender Dossier'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRfqForQuote(rfq)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تقديم عرض سعر مشفر' : 'SUBMIT SEALED QUOTE'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Sealed Quote Modal */}
      <QuoteModal
        isOpen={Boolean(selectedRfqForQuote)}
        rfq={selectedRfqForQuote}
        onClose={() => setSelectedRfqForQuote(null)}
        onSubmit={handleQuoteSubmit}
      />
    </div>
  );
}
