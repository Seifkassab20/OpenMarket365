'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  exporterService,
  ExporterCompany,
  ExporterProduct,
  ExporterCertificate,
  ExporterRfq,
  SubscriptionQuota,
  ExporterAnalytics,
} from '@/lib/services/exporterService';
import QuotaCard from '@/components/exporter/QuotaCard';
import QuoteModal from '@/components/exporter/QuoteModal';
import { useToast } from '@/components/admin/ToastNotification';
import ScrollReveal from '@/components/admin/ScrollReveal';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import {
  Eye,
  Search,
  Package,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp,
  CreditCard,
  Building2,
  Send,
  ExternalLink,
  Plus,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function ExporterOverviewPage() {
  const { language, direction } = useLanguage();
  const { addToast } = useToast();
  const isRtl = direction === 'rtl';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<ExporterCompany | null>(null);
  const [products, setProducts] = useState<ExporterProduct[]>([]);
  const [certificates, setCertificates] = useState<ExporterCertificate[]>([]);
  const [rfqs, setRfqs] = useState<ExporterRfq[]>([]);
  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [analytics, setAnalytics] = useState<ExporterAnalytics | null>(null);

  // Quote modal state
  const [activeRfqForQuote, setActiveRfqForQuote] = useState<ExporterRfq | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comp, prods, certs, matchedRfqs, subQuota, stats] = await Promise.all([
        exporterService.getCompany(),
        exporterService.getProducts('c-nileagro-01'),
        exporterService.getCertificates('c-nileagro-01'),
        exporterService.getMatchingRfqs('c-nileagro-01'),
        exporterService.getSubscriptionQuota('c-nileagro-01'),
        exporterService.getAnalytics('c-nileagro-01'),
      ]);
      setCompany(comp);
      setProducts(prods);
      setCertificates(certs);
      setRfqs(matchedRfqs);
      setQuota(subQuota);
      setAnalytics(stats);
    } catch {
      addToast('error', 'Failed to load exporter showroom data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuoteSubmit = async (payload: any) => {
    if (!activeRfqForQuote) return;
    const res = await exporterService.submitQuote('c-nileagro-01', activeRfqForQuote.id, payload);
    if (res.success) {
      addToast('success', res.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <ScrollReveal direction="down" delayMs={0}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
                {language === 'ar' ? 'منشأة تصدير زراعي معتمدة' : 'VERIFIED AGRICULTURAL PACKHOUSE'}
              </span>
              <span className="text-xs text-[#70695f] font-mono">
                Gov ID: EG-AGRO-104928
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
              {language === 'ar' ? 'لوحة تحكم المصدّر والعمليات' : 'Exporter Operations Desk'}
            </h1>
            <p className="mt-1 text-xs text-[#70695f]">
              {language === 'ar'
                ? 'إدارة المعرض الرقمي، حصص التصدير السنوية، ومتابعة مناقصات المشترين الدوليين.'
                : 'Digital showroom control, annual export quota telemetry, and international buyer tenders.'}
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/exporter/products/new"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm rounded-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة منتج جديد' : 'New Product'}</span>
            </Link>

            <Link
              href="/exporters/nile-agro-export"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#70695f]" />
              <span>{language === 'ar' ? 'معاينة المعرض' : 'Public View'}</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* 6 KPI Metric Cards */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4${loading ? ' animate-pulse opacity-50' : ''}`}>
        {/* Profile Views */}
        <ScrollReveal delayMs={0} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between text-[#70695f]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'ar' ? 'مشاهدات المعرض' : 'Showroom Views'}
              </span>
              <Eye className="w-3.5 h-3.5 text-[#9b452f]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#202522]">
              <AnimatedCounter end={analytics?.profile_views || 1840} separator="," duration={1200} />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#2d7a58] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>
                <AnimatedCounter end={analytics?.profile_views_growth || 16.4} decimals={1} prefix="+" suffix="%" duration={1000} />
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Search Impressions */}
        <ScrollReveal delayMs={60} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between text-[#70695f]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'ar' ? 'ظهور في البحث' : 'Impressions'}
              </span>
              <Search className="w-3.5 h-3.5 text-[#c38b40]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#202522]">
              <AnimatedCounter end={analytics?.search_impressions || 6290} separator="," duration={1200} />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#2d7a58] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>
                <AnimatedCounter end={analytics?.search_impressions_growth || 24.8} decimals={1} prefix="+" suffix="%" duration={1000} />
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Active Products */}
        <ScrollReveal delayMs={120} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between text-[#70695f]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'ar' ? 'المنتجات المعروضة' : 'Active Products'}
              </span>
              <Package className="w-3.5 h-3.5 text-[#596348]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#202522]">
              <AnimatedCounter end={products.length} duration={1000} />
            </div>
            <span className="text-[10px] text-[#70695f] font-mono block">
              {quota ? `${quota.current_products} / ${quota.max_products} slots` : '72 / 150'}
            </span>
          </div>
        </ScrollReveal>

        {/* Certificates Count */}
        <ScrollReveal delayMs={180} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between text-[#70695f]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'ar' ? 'شهادات الجودة' : 'Certificates'}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#2d7a58]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#202522]">
              <AnimatedCounter end={certificates.length} duration={1000} />
            </div>
            <span className="text-[10px] text-[#2d7a58] font-bold block">
              {language === 'ar' ? 'معتمدة بالكامل' : '100% Verified'}
            </span>
          </div>
        </ScrollReveal>

        {/* Matching RFQ Leads */}
        <ScrollReveal delayMs={240} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between text-[#70695f]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'ar' ? 'مناقصات مطابقة' : 'RFQ Leads'}
              </span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#9b452f]" />
            </div>
            <div className="text-2xl font-serif font-bold text-[#9b452f]">
              <AnimatedCounter end={rfqs.length} duration={1000} />
            </div>
            <span className="text-[10px] text-[#9b452f] font-bold block">
              {language === 'ar' ? 'تتطلب عروض أسعار' : 'Action Required'}
            </span>
          </div>
        </ScrollReveal>

        {/* Subscription Plan */}
        <ScrollReveal delayMs={300} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm space-y-1 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between text-[#70695f]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {language === 'ar' ? 'الباقة الحالية' : 'Subscription'}
              </span>
              <CreditCard className="w-3.5 h-3.5 text-[#c38b40]" />
            </div>
            <div className="text-base font-serif font-bold text-[#202522] truncate">
              {quota?.plan_name_en || 'PREMIUM'}
            </div>
            <span className="text-[10px] text-[#70695f] font-mono block">
              Exp: Jan 2027
            </span>
          </div>
        </ScrollReveal>
      </div>

      {/* Middle Row: Verification Card & Real Quotas Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Card */}
        <ScrollReveal delayMs={80} direction="up" className="h-full">
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#70695f]">
                  {language === 'ar' ? 'حالة التوثيق الرسمية' : 'Company Verification'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#596348] text-white rounded-xs">
                  {language === 'ar' ? 'موثق رسمياً' : 'OFFICIALLY VERIFIED'}
                </span>
              </div>

              <div className="p-3.5 bg-[#eee8dc] border border-[#b9aa95] rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#70695f]">{language === 'ar' ? 'السجل التجاري (CR):' : 'Commercial Registry:'}</span>
                  <span className="font-mono font-bold text-[#202522]">✓ {company?.cr_number || '104928'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#70695f]">{language === 'ar' ? 'البطاقة الضريبية:' : 'Tax Card ID:'}</span>
                  <span className="font-mono font-bold text-[#202522]">✓ {company?.tax_id || '928103'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#70695f]">{language === 'ar' ? 'محافظة المنشأة:' : 'Governorate:'}</span>
                  <span className="font-bold text-[#202522]">{company?.governorate || 'Ismailia'}, Egypt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#70695f]">{language === 'ar' ? 'فحص المحطة:' : 'Packhouse Inspection:'}</span>
                  <span className="font-bold text-[#2d7a58]">Aweta Optical Passed</span>
                </div>
              </div>

              <p className="text-[11px] text-[#70695f] leading-relaxed">
                {language === 'ar'
                  ? 'ملف شركتك يحمل شارة الاعتماد الذهبية في دليل المصدرين العام، مما يمنح المستوردين الدوليين ثقة قانونية كاملة.'
                  : 'Your profile carries the verified exporter badge in the global directory, providing international buyers full legal assurance.'}
              </p>
            </div>

            <div className="pt-4 border-t border-[#b9aa95]/60 mt-4">
              <Link
                href="/exporter/showroom"
                className="text-xs font-bold text-[#9b452f] hover:underline flex items-center justify-between"
              >
                <span>{language === 'ar' ? 'تعديل بيانات المعرض والمحطة' : 'Edit Packhouse Specs'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Quota Progress Cards (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ScrollReveal delayMs={140} direction="up" className="h-full">
            <QuotaCard
              labelEn="Product Slots"
              labelAr="حصة المنتجات"
              current={quota?.current_products || 72}
              max={quota?.max_products || 150}
              unitEn="slots"
              unitAr="منتج"
              icon={<Package className="w-4 h-4" />}
            />
          </ScrollReveal>

          <ScrollReveal delayMs={200} direction="up" className="h-full">
            <QuotaCard
              labelEn="Showroom Images"
              labelAr="معرض الصور"
              current={quota?.current_images || 41}
              max={quota?.max_images || 60}
              unitEn="images"
              unitAr="صورة"
              icon={<Sparkles className="w-4 h-4" />}
            />
          </ScrollReveal>

          <ScrollReveal delayMs={260} direction="up" className="h-full">
            <QuotaCard
              labelEn="4K Video Tour"
              labelAr="فيديو الجولة بالمحطة"
              current={quota?.current_videos || 1}
              max={quota?.max_videos || 1}
              unitEn="slot"
              unitAr="فيديو"
              icon={<CreditCard className="w-4 h-4" />}
            />
          </ScrollReveal>
        </div>
      </div>

      {/* Matching Buyer RFQs Stream */}
      <ScrollReveal delayMs={80} direction="up">
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
            <div>
              <h3 className="text-base font-serif font-bold text-[#202522]">
                {language === 'ar' ? 'طلبات التوريد الدولية المطابقة لمنتجاتك' : 'Matching International Buyer RFQs'}
              </h3>
              <p className="text-xs text-[#70695f] mt-0.5">
                {language === 'ar'
                  ? 'طلبات عاجلة من مشترين دوليين معتمدين تتطابق مع المحاصيل المصنفة في معرضك.'
                  : 'Direct buyer tenders matched to your agricultural and industrial catalog.'}
              </p>
            </div>
            <Link
              href="/exporter/rfqs"
              className="text-xs font-bold text-[#9b452f] hover:underline flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض جميع المناقصات' : 'View All Leads'}</span>
              <ArrowIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rfqs.map((rfq, idx) => (
              <ScrollReveal key={rfq.id} delayMs={idx * 70} direction="up" className="h-full">
                <div
                  className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-4 flex flex-col justify-between hover:border-[#9b452f] transition-all group space-y-3 h-full"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="font-bold text-[#9b452f] uppercase tracking-wider">
                        {rfq.destination_country_code} • {rfq.destination_port}
                      </span>
                      <span className="text-[#70695f] font-mono">{rfq.incoterm}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#202522] group-hover:text-[#9b452f] transition-colors">
                      {language === 'ar' ? rfq.commodity_ar : rfq.commodity_en}
                    </h4>

                    <div className="mt-2 text-xs font-serif font-bold text-[#202522]">
                      <AnimatedCounter end={rfq.required_quantity} duration={1100} /> {rfq.quantity_unit}
                    </div>

                    <p className="mt-1.5 text-[11px] text-[#70695f] line-clamp-2">
                      {rfq.technical_specifications}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#b9aa95]/50 flex items-center justify-between">
                    <span className="text-[10px] text-[#70695f] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Target: {rfq.delivery_deadline}</span>
                    </span>
                    <button
                      onClick={() => setActiveRfqForQuote(rfq)}
                      className="px-3 py-1.5 bg-[#202522] hover:bg-[#9b452f] text-white text-[10px] font-bold uppercase tracking-wider transition-colors rounded-xs flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>{language === 'ar' ? 'تقديم عرض' : 'Submit Quote'}</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Quote Submission Modal */}
      <QuoteModal
        isOpen={Boolean(activeRfqForQuote)}
        rfq={activeRfqForQuote}
        onClose={() => setActiveRfqForQuote(null)}
        onSubmit={handleQuoteSubmit}
      />
    </div>
  );
}
