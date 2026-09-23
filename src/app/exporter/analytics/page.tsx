'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterAnalytics,
} from '@/lib/services/exporterService';
import ScrollReveal from '@/components/admin/ScrollReveal';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Search,
  Globe,
  Users,
  Calendar,
  Building,
  ArrowUpRight,
  ShieldCheck,
  Package,
} from 'lucide-react';

export default function ExporterAnalyticsPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [analytics, setAnalytics] = useState<ExporterAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await exporterService.getAnalytics('c-nileagro-01');
      setAnalytics(data);
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل بيانات التحليلات' : 'Failed to retrieve analytics',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="py-24 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#70695f]">
          {isAr ? 'جارِ جمع بيانات الزيارات والمشاهدات الدولية...' : 'Aggregating international showroom telemetry...'}
        </p>
      </div>
    );
  }

  const maxViews = Math.max(...analytics.views_timeline.map((d) => d.impressions));

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <ScrollReveal direction="down" delayMs={0}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
                {isAr ? 'ذكاء الأعمال والتصدير الدولي' : 'SHOWROOM PERFORMANCE & BUYER INTELLIGENCE'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/10 text-[#2d7a58] border border-[#2d7a58]/30">
                Live Telemetry
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#202522]">
              {isAr ? 'تحليلات المعرض الرقمي والتفاعل الدولي' : 'Showroom Analytics & Buyer Engagement'}
            </h1>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'متابعة أداء المعرض الرقمي، ظهور المنتجات في محرك البحث الدولي، وسجل زيارات المستوردين المعتمدين.'
                : 'Track showroom profile visits, international search engine visibility, and authenticated foreign buyer inquiries.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#70695f] bg-[#eee8dc] border border-[#b9aa95] px-3 py-2 rounded-xl">
            <Calendar className="w-4 h-4 text-[#9b452f]" />
            <span>Sep 16 – Sep 22, 2026</span>
          </div>
        </div>
      </ScrollReveal>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Views */}
        <ScrollReveal delayMs={0} direction="up" className="h-full">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm space-y-3 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70695f]">
                {isAr ? 'زيارات المعرض' : 'Showroom Views'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#9b452f]">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-mono font-bold text-[#202522]">
                <AnimatedCounter end={analytics.profile_views} separator="," duration={1300} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#2d7a58]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  <AnimatedCounter end={analytics.profile_views_growth} decimals={1} prefix="+" suffix="%" duration={1000} /> MoM
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Search Impressions */}
        <ScrollReveal delayMs={60} direction="up" className="h-full">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm space-y-3 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70695f]">
                {isAr ? 'ظهور في البحث الدولي' : 'Search Impressions'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#c38b40]">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-mono font-bold text-[#202522]">
                <AnimatedCounter end={analytics.search_impressions} separator="," duration={1300} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#2d7a58]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  <AnimatedCounter end={analytics.search_impressions_growth} decimals={1} prefix="+" suffix="%" duration={1000} /> MoM
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Active Products */}
        <ScrollReveal delayMs={120} direction="up" className="h-full">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm space-y-3 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70695f]">
                {isAr ? 'المنتجات النشطة' : 'Active Catalog'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#2d7a58]">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-mono font-bold text-[#202522]">
                <AnimatedCounter end={analytics.active_products_count} duration={1000} />
              </div>
              <div className="text-[11px] font-mono text-[#70695f]">
                {isAr ? 'معروضة للمشترين' : 'Indexed in global search'}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Verified Certifications */}
        <ScrollReveal delayMs={180} direction="up" className="h-full">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm space-y-3 hover:border-[#202522] transition-colors h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#70695f]">
                {isAr ? 'الشهادات المعتمدة' : 'Verified Certs'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#9b452f]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-mono font-bold text-[#202522]">
                <AnimatedCounter end={analytics.verified_certificates_count} duration={1000} />
              </div>
              <div className="text-[11px] font-mono text-[#2d7a58] font-bold">
                GlobalGAP & BRC AA
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Main Charts & Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart (2 Cols) */}
        <ScrollReveal delayMs={100} direction="up" className="lg:col-span-2">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-6 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-serif font-bold text-[#202522]">
                  {isAr ? 'حركة التفاعل اليومية (آخر 7 أيام)' : 'Daily Buyer Trajectory (Past 7 Days)'}
                </h3>
                <p className="text-xs text-[#70695f]">
                  {isAr
                    ? 'المقارنة بين مرات الظهور في نتائج البحث وعدد الزيارات الفعلية لمعرضك.'
                    : 'Correlation between search impression reach and full showroom dossier page views.'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#9b452f]" />
                  <span className="text-[#202522]">{isAr ? 'الزيارات' : 'Views'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#c38b40]" />
                  <span className="text-[#202522]">{isAr ? 'مرات الظهور' : 'Impressions'}</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-[#b9aa95]/40 pb-2">
              {analytics.views_timeline.map((item) => {
                const viewHeight = Math.round((item.views / maxViews) * 100);
                const impHeight = Math.round((item.impressions / maxViews) * 100);

                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Views Bar */}
                      <div
                        style={{ height: `${Math.max(viewHeight, 6)}%` }}
                        className="w-1/2 max-w-[18px] bg-[#9b452f] rounded-t-sm group-hover:brightness-110 transition-all relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#202522] text-white text-[9px] font-mono py-0.5 px-1.5 rounded whitespace-nowrap z-10 pointer-events-none">
                          {item.views}
                        </div>
                      </div>

                      {/* Impressions Bar */}
                      <div
                        style={{ height: `${Math.max(impHeight, 8)}%` }}
                        className="w-1/2 max-w-[18px] bg-[#c38b40] rounded-t-sm group-hover:brightness-110 transition-all relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#202522] text-white text-[9px] font-mono py-0.5 px-1.5 rounded whitespace-nowrap z-10 pointer-events-none">
                          {item.impressions}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[#70695f] group-hover:text-[#202522] transition-colors">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#70695f] font-mono pt-1">
              <span>{isAr ? 'ذروة التفاعل: الخميس 22 سبتمبر' : 'Peak Velocity: Thursday, Sep 22'}</span>
              <span className="text-[#9b452f] font-bold">
                {isAr ? 'معدل التحويل (CTR): 29.2%' : 'CTR Conversion: 29.2%'}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Top Performing Commodities */}
        <ScrollReveal delayMs={150} direction="up">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-5 h-full">
            <div className="space-y-0.5">
              <h3 className="text-base font-serif font-bold text-[#202522]">
                {isAr ? 'المحاصيل الأكثر طلباً' : 'Top Commodity Interest'}
              </h3>
              <p className="text-xs text-[#70695f]">
                {isAr ? 'توزيع اهتمام المستوردين بالمنتجات' : 'Visitor distribution by commodity'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#202522]">Valencia Oranges (Class A)</span>
                  <span className="text-[#9b452f] font-bold">58%</span>
                </div>
                <div className="h-2 w-full bg-[#dfd4c1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9b452f] rounded-full" style={{ width: '58%' }} />
                </div>
                <div className="text-[10px] text-[#70695f] flex justify-between font-mono">
                  <span>1,067 views</span>
                  <span>FOB Damietta</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#202522]">IQF Frozen Strawberries</span>
                  <span className="text-[#c38b40] font-bold">28%</span>
                </div>
                <div className="h-2 w-full bg-[#dfd4c1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#c38b40] rounded-full" style={{ width: '28%' }} />
                </div>
                <div className="text-[10px] text-[#70695f] flex justify-between font-mono">
                  <span>515 views</span>
                  <span>CIF Jebel Ali</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#202522]">Fresh Spring Green Onions</span>
                  <span className="text-[#2d7a58] font-bold">14%</span>
                </div>
                <div className="h-2 w-full bg-[#dfd4c1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2d7a58] rounded-full" style={{ width: '14%' }} />
                </div>
                <div className="text-[10px] text-[#70695f] flex justify-between font-mono">
                  <span>258 views</span>
                  <span>Air Freight / Reefer</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#b9aa95]/40 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] block">
                {isAr ? 'أهم الأسواق الجغرافية المستهدفة' : 'Key Buyer Jurisdictions'}
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                  🇪🇺 Germany (42%)
                </span>
                <span className="px-2 py-1 rounded bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                  🇦🇪 UAE / GCC (31%)
                </span>
                <span className="px-2 py-1 rounded bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                  🇬🇧 UK (18%)
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Authenticated Importer Views Log */}
      <ScrollReveal delayMs={120} direction="up">
        <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-serif font-bold text-[#202522]">
                {isAr ? 'سجل زيارات المستوردين المعتمدين (Live Buyer Inquiries)' : 'Authenticated Buyer Inspection Log'}
              </h3>
              <p className="text-xs text-[#70695f]">
                {isAr
                  ? 'سجل حي للشركات والمستوردين الدوليين المعتمدين الذين قاموا بفحص ملف شركتك ومعاينة الشهادات.'
                  : 'Direct audit trail of verified international buyers inspecting your digital packhouse credentials.'}
              </p>
            </div>

            <span className="text-[10px] font-mono text-[#2d7a58] bg-[#2d7a58]/10 border border-[#2d7a58]/30 px-2.5 py-1 rounded-md font-bold">
              {isAr ? 'تحقق نشط' : 'Active Telemetry'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-[#dfd4c1] border-b border-[#b9aa95] text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f]">
                <tr>
                  <th className="py-3 px-4">{isAr ? 'الشركة المستوردة' : 'Foreign Buying Entity'}</th>
                  <th className="py-3 px-4">{isAr ? 'دولة الوصول' : 'Jurisdiction'}</th>
                  <th className="py-3 px-4">{isAr ? 'حالة التوثيق' : 'Verification Badge'}</th>
                  <th className="py-3 px-4 text-right rtl:text-left">{isAr ? 'التوقيت' : 'Timestamp'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b9aa95]/40 font-mono">
                {analytics.importer_views.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#dfd4c1]/30 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-sm text-[#202522] flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#9b452f] flex-shrink-0" />
                      <span>{log.company}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#70695f] text-xs">
                      {log.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#2d7a58]/15 text-[#2d7a58] border border-[#2d7a58]/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isAr ? 'مستورد معتمد' : 'Verified Buyer'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right rtl:text-left text-[11px] text-[#70695f]">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
