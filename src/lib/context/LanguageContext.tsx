'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation
  brandName: { en: 'OpenMarket 365', ar: 'السوق المفتوح 365' },
  brandTagline: { en: "Egypt's Global Export Gateway", ar: 'بوابة مصر للتصدير العالمي' },
  navShowrooms: { en: 'Exporter Showrooms', ar: 'معارض المصدرين' },
  navProducts: { en: 'Products Catalog', ar: 'دليل المنتجات' },
  navRfqs: { en: 'Live RFQs', ar: 'طلبات التوريد الدولية' },
  navMarket: { en: 'Surplus & Distressed Cargo', ar: 'بورصة البضائع والموانئ' },
  navMedia: { en: 'Media & TV Hub', ar: 'المركز الإعلامي وبودكاست' },
  navPricing: { en: 'Pricing & Plans', ar: 'الباقات والاشتراكات' },
  navPostRfq: { en: 'Post an RFQ', ar: 'طلب تسعير جديد' },
  navSignIn: { en: 'Sign In', ar: 'تسجيل الدخول' },
  navRegister: { en: 'Register as Exporter', ar: 'انضم كمصدر معتمد' },
  navDashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },

  // Live Ticker
  tickerLive: { en: 'LIVE TRADE DESK', ar: 'مباشر البورصة التجارية' },
  tickerVerifiedExporters: { en: '1,420+ Verified Egyptian Exporters', ar: 'أكثر من 1,420 مصدّر مصري معتمد' },
  tickerActiveRfqs: { en: '280+ Active Global Buyer RFQs', ar: 'أكثر من 280 طلب توريد نشط' },
  tickerDistressedDeals: { en: 'Port Clearance Cargo Deals Available', ar: 'فرص تخليص وتصدير فورية بالموانئ' },

  // Hero Section
  heroBadge: { en: 'OFFICIAL B2B EXPORT PLATFORM', ar: 'المنصة الوطنية للمصدرين والمشترين الدوليين' },
  heroTitle: { en: "Egypt's Verified Export Showcase to the World", ar: 'بوابة الصادرات المصرية المعتمدة نحو الأسواق العالمية' },
  heroSubtitle: {
    en: 'Connect directly with certified Egyptian agricultural packers, industrial manufacturers, and cold-chain facilities. Zero intermediary commissions.',
    ar: 'تواصل مباشرة مع كبرى محطات التعبئة والمصانع وسلاسل التبريد المعتمدة في مصر بدون أي عمولات وساطة.'
  },
  heroSearchPlaceholder: { en: 'Search products, HS codes, or verified exporters...', ar: 'ابحث عن المحاصيل، كود البند الجمركي HS، أو الشركات المعتمدة...' },
  heroSearchButton: { en: 'Search', ar: 'بحث سريع' },
  heroExploreCategories: { en: 'Browse Sectors', ar: 'تصفح القطاعات التصديرية' },
  heroPostRfqCta: { en: 'Submit Buyer RFQ', ar: 'اطرح طلب توريد دولي' },
  heroVerifiedShowroomCta: { en: 'Explore Verified Showrooms', ar: 'استكشف معارض المصدرين' },

  // Stats
  statVolume: { en: 'Annual Export Volume', ar: 'حجم الصادرات الموثقة' },
  statCountries: { en: 'Destination Countries', ar: 'دولة مستوردة' },
  statInspection: { en: 'Pre-Shipment Inspected', ar: 'فحص مسبق معتمد' },
  statZeroCommission: { en: 'Direct Trade Commission', ar: 'عمولة وساطة مباشرة' },

  // Section Headers
  sectionCategories: { en: 'Export Sectors & Commodities', ar: 'القطاعات التصديرية والسلع الأساسية' },
  sectionShowrooms: { en: 'Featured Egyptian Exporters', ar: 'معارض الشركات المصدرة المعتمدة' },
  sectionShowroomsSub: { en: 'Legally verified by General Authority for Investment and Commercial Registry', ar: 'شركات موثقة بالسجل التجاري والبطاقة الضريبية وهيئة الاستثمار' },
  sectionProducts: { en: 'Top Export Commodities', ar: 'أبرز المنتجات المعدة للتصدير' },
  sectionRfqs: { en: 'Live Buyer Demand (Sealed Quotations)', ar: 'طلبات التوريد الدولية العاجلة' },
  sectionDistressed: { en: 'Distressed Cargo & Port Deals', ar: 'بضائع الموانئ وفرص الاسترداد العاجلة' },
  sectionTvMedia: { en: '"Yes We Can" (هنقدر) National Showcase', ar: 'برنامج هنقدر - قصص نجاح الصناعة المصرية' },

  // Actions
  viewAll: { en: 'View All', ar: 'عرض الكل' },
  viewShowroom: { en: 'Enter Showroom', ar: 'دخول المعرض الرقمي' },
  viewProductDetails: { en: 'Product Specs', ar: 'المواصفات الفنية' },
  submitQuote: { en: 'Submit Quote', ar: 'تقديم عرض سعر' },
  directWhatsApp: { en: 'Instant WhatsApp', ar: 'محادثة فورية واتساب' },
  filterAll: { en: 'All Sectors', ar: 'جميع القطاعات' },
  verifiedBadge: { en: 'Verified Exporter', ar: 'مصدّر معتمد' },
  crBadge: { en: 'CR Verified', ar: 'سجل تجاري موثق' },

  // Pricing
  pricingTitle: { en: 'Transparent, High-ROI Subscription Tiers', ar: 'باقات اشتراك تنافسية لتحقيق أعلى عائد تصديري' },
  pricingSubtitle: { en: 'No percentage commissions. Keep 100% of your export revenue.', ar: 'بدون أي نسب عمولة على الصفقات. احتفظ بكامل عوائد صادراتك.' },
  choosePlan: { en: 'Choose Plan', ar: 'اختيار الباقة' },
  currentPlan: { en: 'Current Plan', ar: 'باقتك الحالية' },
  offlinePaymentInfo: { en: 'Bank Transfer & Fawry Accepted', ar: 'يقبل التحويل البنكي وفوري' },

  // Footer
  footerRights: { en: 'All rights reserved. OpenMarket365 Egyptian Export Network.', ar: 'جميع الحقوق محفوظة. شبكة الصادرات المصرية OpenMarket365.' },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('om365_lang') as Language;
    if (saved === 'ar' || saved === 'en') {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('om365_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key].en || key;
  };

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, toggleLanguage, t }}>
      <div className={language === 'ar' ? 'font-arabic' : 'font-latin'} dir={direction}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
