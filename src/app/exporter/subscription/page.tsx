'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  SubscriptionQuota,
} from '@/lib/services/exporterService';
import QuotaCard from '@/components/exporter/QuotaCard';
import ScrollReveal from '@/components/admin/ScrollReveal';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import {
  Crown,
  CheckCircle2,
  Package,
  Image as ImageIcon,
  Video,
  RefreshCw,
  Sparkles,
  Calendar,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function ExporterSubscriptionPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      const data = await exporterService.getSubscriptionQuota('c-nileagro-01');
      setQuota(data);
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل بيانات الاشتراك' : 'Failed to retrieve subscription',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestUpgrade = (planCode: string, planName: string) => {
    setUpgradingPlan(planCode);
    setTimeout(() => {
      showToast({
        title: isAr ? 'تم استلام طلب الترقية' : 'Upgrade Request Dispatched',
        message: isAr
          ? `تم إرسال طلب الترقية إلى باقة (${planName}) لفريق مبيعات المنصة. سيتواصل معك مستشارك التجاري اليوم.`
          : `Upgrade request for ${planName} submitted to account manager. Your representative will follow up today.`,
        type: 'success',
      });
      setUpgradingPlan(null);
    }, 800);
  };

  if (isLoading || !quota) {
    return (
      <div className="py-24 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#70695f]">
          {isAr ? 'جارِ فحص باقة الاشتراك والحصص الرقمية...' : 'Verifying supplier subscription dossier...'}
        </p>
      </div>
    );
  }

  const plans = [
    {
      code: 'STD',
      nameEn: 'Standard Exporter',
      nameAr: 'باقة المصدر الأساسية',
      price: 300,
      periodEn: '/ year',
      periodAr: '/ سنوياً',
      badgeEn: 'Starter Pack',
      badgeAr: 'للمبتدئين',
      featuresEn: [
        '15 Export Product Dossiers',
        '10 High-Res Gallery Images',
        'Direct RFQ Notifications',
        'Standard Showroom Profile',
        'Basic Email Support',
      ],
      featuresAr: [
        '15 ملف مواصفات منتج تصديري',
        '10 صور عالية الدقة للمعرض',
        'إشعارات العطاءات الأساسية',
        'ملف تعريفي للمصدر',
        'دعم فني عبر البريد الإلكتروني',
      ],
      isCurrent: quota.plan_code === 'STD',
    },
    {
      code: 'PLS',
      nameEn: 'Plus Exporter',
      nameAr: 'باقة المصدر بلس',
      price: 600,
      periodEn: '/ year',
      periodAr: '/ سنوياً',
      badgeEn: 'Growing Packhouse',
      badgeAr: 'للمحطات المتوسطة',
      featuresEn: [
        '50 Export Product Dossiers',
        '25 High-Res Gallery Images',
        'Verified Trade Badging',
        'RFQ Sealed Bidding Access',
        'Priority Directory Search',
      ],
      featuresAr: [
        '50 ملف مواصفات منتج تصديري',
        '25 صورة عالية الدقة للمعرض',
        'شارة التحقق من السجل التجاري',
        'المشاركة في المظاريف المغلقة',
        'أولوية الظهور في دليل المصدرين',
      ],
      isCurrent: quota.plan_code === 'PLS',
    },
    {
      code: 'PRM',
      nameEn: 'Premium Exporter',
      nameAr: 'باقة المصدر المتميز',
      price: 1200,
      periodEn: '/ year',
      periodAr: '/ سنوياً',
      badgeEn: 'MOST POPULAR • CURRENT PLAN',
      badgeAr: 'الأكثر طلباً • باقتك الحالية',
      featuresEn: [
        '150 Export Product Dossiers',
        '60 High-Res Gallery Images',
        '1 Full 4K Packhouse Video',
        '30-Day Dynamic Media Refresh',
        'Prime Matching in European RFQs',
        'GlobalGAP & BRC Verified Badges',
        'Dedicated Commercial Desk',
      ],
      featuresAr: [
        '150 ملف مواصفات منتج تصديري',
        '60 صورة عالية الدقة للمعرض',
        'فيديو 4K متكامل لمحطة التعبئة',
        'تحديث وسائط ديناميكي كل 30 يوماً',
        'أولوية التوفيق في مناقصات أوروبا',
        'اعتماد شهادات جلوبال جاب و BRC',
        'مكتب تجاري وتنسيق مخصص',
      ],
      isCurrent: quota.plan_code === 'PRM',
    },
    {
      code: 'ELT',
      nameEn: 'Elite Exporter',
      nameAr: 'باقة النخبة التصديرية',
      price: 2500,
      periodEn: '/ year',
      periodAr: '/ سنوياً',
      badgeEn: 'ENTERPRISE AGRO CONGLOMERATE',
      badgeAr: 'لكبرى المجموعات التصديرية',
      featuresEn: [
        'Unlimited Product Dossiers',
        'Unlimited 4K Gallery Imagery',
        'Multiple Packhouse Drone Videos',
        'Custom B2B Landing Subdomain',
        'Dedicated Trade Diplomat Officer',
        'First-Access to Sovereign Tenders',
        'Automated Multilingual PDF Dossiers',
      ],
      featuresAr: [
        'منتجات ومحاصيل غير محدودة',
        'صور عالية الدقة غير محدودة',
        'فيديوهات درون متعددة للمزارع والمحطات',
        'نطاق فرعي مخصص للمعرض الرقمي',
        'مستشار تجاري ودبلوماسي مخصص',
        'أولوية مطلقة في المناقصات السيادية',
        'توليد ملفات PDF تصديرية آلية بلغات متعددة',
      ],
      isCurrent: quota.plan_code === 'ELT',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Current Plan Header */}
      <ScrollReveal direction="down" delayMs={0}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#9b452f] text-white uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>{isAr ? 'الباقة الحالية' : 'CURRENT TIER'}</span>
              </span>
              <span className="text-[10px] font-mono text-[#70695f]">
                {isAr ? 'تاريخ التجديد السنوي:' : 'Renewal Date:'}{' '}
                <strong className="text-[#202522]">
                  {new Date(quota.billing_cycle_end).toLocaleDateString()}
                </strong>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#202522]">
              {isAr ? quota.plan_name_ar : quota.plan_name_en}
            </h1>

            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'تتيح لك باقة بريميوم الحالية نشر حتى 150 منتجاً وفيديو تفصيلي لمحطة التعبئة مع أولوية الظهور في محرك البحث الدولي.'
                : 'Your active Premium subscription entitles your packhouse to 150 products, 4K video showcase, and priority European buyer RFQ routing.'}
            </p>
          </div>

          <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 text-center md:text-right rtl:md:text-left space-y-0.5 flex-shrink-0">
            <span className="text-[10px] font-mono text-[#70695f] uppercase tracking-wider block">
              {isAr ? 'رسوم الاشتراك السنوي' : 'Annual Billing'}
            </span>
            <div className="text-2xl font-mono font-bold text-[#9b452f]">
              $<AnimatedCounter end={quota.annual_price_usd} duration={1000} /> <span className="text-xs font-normal text-[#202522]">{isAr ? '/ سنوياً' : '/ yr'}</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Real Quota Utilization Cards */}
      <ScrollReveal delayMs={60} direction="up">
        <div className="space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#70695f]">
            {isAr ? 'استهلاك الحصص المخصصة للباقة' : 'Active Quota Utilization'}
          </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuotaCard
            labelEn="Product Catalog"
            labelAr="كتالوج المنتجات التصديرية"
            current={quota.current_products}
            max={quota.max_products}
            unitEn="products"
            unitAr="منتج"
            icon={<Package className="w-4 h-4" />}
          />

          <QuotaCard
            labelEn="Showroom Gallery"
            labelAr="صور المعرض والمحطة"
            current={quota.current_images}
            max={quota.max_images}
            unitEn="images"
            unitAr="صورة"
            icon={<ImageIcon className="w-4 h-4" />}
          />

          <QuotaCard
            labelEn="Video Showcase"
            labelAr="فيديو محطة التعبئة"
            current={quota.current_videos}
            max={quota.max_videos}
            unitEn="video"
            unitAr="فيديو"
            icon={<Video className="w-4 h-4" />}
          />

          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#70695f]">
                {isAr ? 'التحديث الديناميكي (30 يوماً)' : 'Dynamic Refresh (30d)'}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#eee8dc] text-[#9b452f] border border-[#b9aa95]">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-serif font-bold text-[#202522]">
                {quota.dynamic_refresh_allowed ? (
                  <span className="text-[#2d7a58] flex items-center gap-1.5 text-base">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'مفعل ومتاح' : 'Active & Available'}</span>
                  </span>
                ) : (
                  <span className="text-[#70695f] text-sm">{isAr ? 'غير متاح بالباقة' : 'Disabled'}</span>
                )}
              </div>
              <p className="text-[10px] font-mono text-[#70695f]">
                {isAr ? 'الموعد القادم: 1 أكتوبر 2026' : 'Next Window: Oct 1, 2026'}
              </p>
            </div>
          </div>
        </div>
        </div>
      </ScrollReveal>

      {/* Tier Comparison Matrix */}
      <ScrollReveal delayMs={100} direction="up">
        <div className="space-y-4 pt-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-serif font-bold text-[#202522]">
              {isAr ? 'مقارنة باقات الموردين المعتمدين' : 'Supplier Portal Subscription Tiers'}
            </h2>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'اختر الباقة المناسبة لطاقتك التصديرية وتوسع مع شبكة المشترين في أكثر من 40 دولة.'
                : 'Scale your export reach with specialized tiers tailored for Egyptian agricultural producers and conglomerates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p, idx) => {
              const isElite = p.code === 'ELT';
              const isCurrent = p.isCurrent;

              return (
                <ScrollReveal key={p.code} delayMs={idx * 70} direction="up" className="h-full">
                  <div
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition-all h-full ${
                      isCurrent
                        ? 'bg-[#e4dac9] border-[#9b452f] ring-2 ring-[#9b452f]/30 shadow-md'
                        : isElite
                        ? 'bg-[#dfd4c1] border-[#c38b40] shadow-sm'
                        : 'bg-[#e4dac9] border-[#b9aa95] shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-5">
                      {/* Badge & Title */}
                      <div className="space-y-2">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded block w-fit ${
                            isCurrent
                              ? 'bg-[#9b452f] text-white'
                              : isElite
                              ? 'bg-[#c38b40] text-white'
                              : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                          }`}
                        >
                          {isAr ? p.badgeAr : p.badgeEn}
                        </span>

                        <h3 className="text-lg font-serif font-bold text-[#202522]">
                          {isAr ? p.nameAr : p.nameEn}
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-mono font-bold text-[#202522]">
                          $<AnimatedCounter end={p.price} duration={1000} />
                        </span>
                        <span className="text-xs font-mono text-[#70695f]">
                          {isAr ? p.periodAr : p.periodEn}
                        </span>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2.5 pt-2 border-t border-[#b9aa95]/40 text-xs">
                        {(isAr ? p.featuresAr : p.featuresEn).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2
                              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                isCurrent ? 'text-[#9b452f]' : isElite ? 'text-[#c38b40]' : 'text-[#2d7a58]'
                              }`}
                            />
                            <span className="text-[#202522] leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Button Action */}
                    <div className="pt-6">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#70695f] cursor-default text-center"
                        >
                          {isAr ? 'باقتك الحالية النشطة' : 'ACTIVE SUBSCRIPTION'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRequestUpgrade(p.code, isAr ? p.nameAr : p.nameEn)}
                          disabled={upgradingPlan === p.code}
                          className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                            isElite
                              ? 'bg-[#c38b40] hover:bg-[#a67432] text-white shadow-sm'
                              : 'bg-[#9b452f] hover:bg-[#833824] text-white shadow-sm'
                          }`}
                        >
                          {upgradingPlan === p.code ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Zap className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {p.price > quota.annual_price_usd
                              ? isAr
                                ? 'طلب الترقية للباقة'
                                : 'REQUEST UPGRADE'
                              : isAr
                              ? 'تعديل الباقة'
                              : 'SELECT PLAN'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
