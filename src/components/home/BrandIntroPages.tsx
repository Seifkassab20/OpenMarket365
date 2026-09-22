'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth, UserRoleType } from '@/lib/context/AuthContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  ShoppingBag, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  Eye, 
  Check
} from 'lucide-react';

interface BrandIntroPagesProps {
  onContinueAsVisitor?: () => void;
  isStandalonePage?: boolean;
}

export default function BrandIntroPages({ 
  onContinueAsVisitor,
  isStandalonePage = false 
}: BrandIntroPagesProps) {
  const { language, direction } = useLanguage();
  const { loginAs } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(0);

  const handleContinueAsVisitor = () => {
    try {
      sessionStorage.setItem('om365_brand_intro_dismissed', 'true');
    } catch (e) {
      // ignore
    }
    if (onContinueAsVisitor) {
      onContinueAsVisitor();
    } else {
      router.push('/');
    }
  };

  const handleSelectRole = (role: UserRoleType, redirectPath: string) => {
    try {
      sessionStorage.setItem('om365_brand_intro_dismissed', 'true');
    } catch (e) {
      // ignore
    }
    loginAs(role);
    router.push(redirectPath);
  };

  const ArrowNext = direction === 'rtl' ? ArrowLeft : ArrowRight;
  const ArrowPrev = direction === 'rtl' ? ArrowRight : ArrowLeft;

  // 3 Brand Narrative Pages + 1 Role Selection Gateway Page (Total 4 pages)
  const pages = [
    {
      pageNumber: '01 / 04',
      kickerEn: '01 · THE NATIONAL EXPORT GATEWAY',
      kickerAr: '٠١ · البوابة الوطنية لتصدير الحاصلات',
      titleEn: 'Egypt, in Season.',
      titleHighlightEn: 'Direct from Origin.',
      titleAr: 'مصر، في أوج مواسمها.',
      titleHighlightAr: 'مباشرة من المنشأ والمزارع.',
      descEn: 'OpenMarket365 is Egypt’s verified trade gateway connecting international buyers with established producers, state-of-the-art citrus packhouses, frozen food manufacturers, and certified exporters.',
      descAr: 'بوابة مصر المعتمدة لربط كبرى محطات التعبئة والمزارع والمصانع بالمستوردين الدوليين مباشرة، مع إلغاء الوسطاء وحماية شفافية الأسعار.',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=1200&auto=format&fit=crop&q=80',
      imageCaptionEn: 'NILE DELTA · CITRUS ORCHARD HARVEST',
      imageCaptionAr: 'الدلتا المصرية · موسم حصاد الموالح',
      badgeEn: '0% BROKERAGE MARKUP · DIRECT CONTRACTS',
      badgeAr: '٠٪ عمولة سمسرة · عقود تصدير مباشرة',
      points: [
        { en: 'Direct access to Egyptian Valencia oranges, Navel, and IQF strawberries', ar: 'تواصل مباشر مع مزارع برتقال فالنسيا وبسرة والفراولة المجمدة' },
        { en: 'Direct maritime trade lanes to Rotterdam, Hamburg, Jeddah, and Jebel Ali', ar: 'خطوط شحن بحري مبردة إلى روتردام، هامبورغ، جدة، وجبل علي' },
        { en: 'Indicative FOB & CFR price transparency updated with harvest cycles', ar: 'شفافية أسعار FOB و CFR الاسترشادية حسب مواسم الجني' },
      ],
    },
    {
      pageNumber: '02 / 04',
      kickerEn: '02 · AUDITED PACKHOUSES & CERTIFICATION',
      kickerAr: '٠٢ · محطات الفرز المعتمدة وتدقيق الشهادات',
      titleEn: 'Verified Facilities.',
      titleHighlightEn: 'Zero Counterfeit.',
      titleAr: 'منشآت ومحطات مفحوصة.',
      titleHighlightAr: 'صفر شهادات أو تراخيص وهمية.',
      descEn: 'Every registered exporter is verified against official Egyptian Commercial Registries and Industrial Federation records. Physical packhouse specifications including Aweta optical sorters and cold storage capacity are verified.',
      descAr: 'يخضع جميع المصدرين للتحقق الصارم عبر السجل التجاري والبطاقة الضريبية واعتمادات التصدير، مع توثيق خطوط الفرز الإلكتروني وسعات التبريد.',
      image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1200&auto=format&fit=crop&q=80',
      imageCaptionEn: 'AWETA OPTICAL SORTING & REEFER TELEMETRY',
      imageCaptionAr: 'فرز إلكتروني بصري Aweta وسلسلة إمداد مبردة',
      badgeEn: 'HACCP · ISO 22000 · GLOBALG.A.P. · BRCGS',
      badgeAr: 'شهادات مطابقة دولية معتمدة',
      points: [
        { en: 'Aweta & Compac electronic weight/color grading lines documented', ar: 'توثيق مواصفات خطوط الفرز والتدريج الإلكتروني' },
        { en: 'Direct download of verified compliance certificates from the secure vault', ar: 'إمكانية فحص وتحميل شهادات الجودة مباشرة من المستودع المعتمد' },
        { en: 'Anti-fraud Commercial Registry verification with official government filing', ar: 'مطابقة رقم السجل التجاري والملف الضريبي مع السجلات الحكومية' },
      ],
    },
    {
      pageNumber: '03 / 04',
      kickerEn: '03 · CONFIDENTIAL RFQS & SECONDARY CARGO',
      kickerAr: '٠٣ · مناقصات سرية وبورصة الشحنات الجاهزة',
      titleEn: 'Sealed Bids.',
      titleHighlightEn: 'Port Cargo Clearance.',
      titleAr: 'مناقصات مشفرة.',
      titleHighlightAr: 'بورصة البضائع الجاهزة بالموانئ.',
      descEn: 'Procure wholesale produce through cryptographic sealed-bid RFQs to prevent cartel collusion, or capitalize on distressed cargo and export-cleared surplus lots at Alexandria and Damietta ports.',
      descAr: 'اطرح طلبات التوريد بنظام المظاريف المشفرة لضمان أفضل سعر دون تواطؤ أو تسريب، مع تصفح صفقات البضائع الحاضرة بالموانئ للتسليم الفوري.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
      imageCaptionEn: 'PORT OF ALEXANDRIA · SPOT CLEARANCE LOTS',
      imageCaptionAr: 'ميناء الإسكندرية · صفقات البضائع الحاضرة',
      badgeEn: 'ROW-LEVEL SECURITY PRIVACY · SPOT TRADING',
      badgeAr: 'حماية كاملة للخصوصية · تسليم وتخليص فوري',
      points: [
        { en: 'Anti-collusion sealed quotes: suppliers cannot see competing bids', ar: 'عروض أسعار مغلقة ومحمية: لا يرى أي مصدر عروض منافسيه' },
        { en: 'Direct phone & WhatsApp contact unmasked for verified wholesale buyers', ar: 'إتاحة أرقام واتساب وهواتف المصنع مباشرة للمشترين المسجلين' },
        { en: 'Distressed cargo secondary board: re-routed container lots ready for inspection', ar: 'بورصة الشحنات الجاهزة بالموانئ: حاويات بأسعار تصفية مع تقارير SGS' },
      ],
    },
  ];

  return (
    <div className="bg-[#eee8dc] text-[#202522] min-h-[calc(100vh-80px)] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Header / Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#b9aa95]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#9b452f] text-[#eee8dc] flex items-center justify-center font-bold text-sm">
            ٣٦٥
          </div>
          <div>
            <div className="font-serif text-2xl text-[#202522] leading-none">
              Market 365
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#202522]/60 uppercase mt-0.5">
              {language === 'ar' ? 'البوابة الوطنية لتصدير الحاصلات والسلع' : 'National Export Gateway of Egypt'}
            </div>
          </div>
        </div>

        {/* 4 Page Step Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {[
            { num: 1, labelEn: 'ORIGIN', labelAr: 'المنشأ' },
            { num: 2, labelEn: 'QUALITY', labelAr: 'الجودة' },
            { num: 3, labelEn: 'PROCUREMENT', labelAr: 'المناقصات' },
            { num: 4, labelEn: 'ACCOUNTS', labelAr: 'الحسابات' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                currentPage === idx
                  ? 'bg-[#202522] text-[#eee8dc] font-bold shadow-sm'
                  : 'bg-[#e4dac9] border border-[#b9aa95] text-[#202522]/70 hover:border-[#202522]'
              }`}
            >
              <span>{item.num}.</span>
              <span className="hidden md:inline">{language === 'ar' ? item.labelAr : item.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Page Stage Area */}
      <div className="flex-grow flex items-center">
        {currentPage < 3 ? (
          /* Narrative Pages (1, 2, 3) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
            {/* Left Column: Narrative Headline, Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e4dac9] border border-[#b9aa95] text-[#9b452f] text-[11px] font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#c38b40]" />
                <span>{language === 'ar' ? pages[currentPage].kickerAr : pages[currentPage].kickerEn}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-[#202522] leading-[1.08] tracking-tight">
                {language === 'ar' ? (
                  <>
                    {pages[currentPage].titleAr} <br />
                    <span className="italic text-[#9b452f]">{pages[currentPage].titleHighlightAr}</span>
                  </>
                ) : (
                  <>
                    {pages[currentPage].titleEn} <br />
                    <span className="italic text-[#9b452f]">{pages[currentPage].titleHighlightEn}</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#202522]/80 max-w-xl leading-relaxed">
                {language === 'ar' ? pages[currentPage].descAr : pages[currentPage].descEn}
              </p>

              {/* Editorial Highlights */}
              <div className="space-y-3 pt-2">
                {pages[currentPage].points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#202522]">
                    <div className="w-5 h-5 rounded-full bg-[#596348]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#596348]" />
                    </div>
                    <span>{language === 'ar' ? pt.ar : pt.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Editorial Photography with Sandstone Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-[#b9aa95] aspect-[4/3] bg-[#e4dac9] shadow-md group">
                <img
                  src={pages[currentPage].image}
                  alt="Market 365 Overview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Top Tag */}
                <div className="absolute top-4 left-4 bg-white/95 text-[#202522] px-3 py-1 text-[10px] font-bold tracking-[0.16em] uppercase border border-[#b9aa95]/50 shadow-sm">
                  {language === 'ar' ? pages[currentPage].imageCaptionAr : pages[currentPage].imageCaptionEn}
                </div>

                {/* Floating Nile Olive Tag */}
                <div className="absolute bottom-0 right-0 max-w-[260px] bg-[#596348] text-[#f4efe5] p-4 border-t border-l border-[#434b36] shadow-lg">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#d4c7b5] mb-1 font-bold">
                    {language === 'ar' ? 'ضمان المنصة' : 'PLATFORM STANDARD'}
                  </div>
                  <p className="text-xs leading-snug font-medium text-[#eee8dc]">
                    {language === 'ar' ? pages[currentPage].badgeAr : pages[currentPage].badgeEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Page 4: Role Selection Gateway & Visitor Entry */
          <div className="w-full space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e4dac9] border border-[#b9aa95] text-[#596348] text-[11px] font-mono font-bold tracking-widest uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? '٠٤ / بوابات الوصول والتشغيل' : '04 · OPERATIONAL SEATS & PUBLIC ACCESS'}</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#202522] tracking-tight">
                {language === 'ar' ? 'اختر حسابك المعتمد أو تصفح كزائر' : 'Choose Your Trade Account or Enter as Visitor'}
              </h1>
              <p className="text-sm text-[#202522]/70 max-w-xl mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'اختر أحد الأدوار التشغيلية الثلاثة للدخول الفوري إلى لوحات التحكم، أو تابع التصفح الحر كزائر عام.'
                  : 'Select one of the 3 operational consoles for role-specific controls, or enter directly into the public visitor catalog.'
                }
              </p>
            </div>

            {/* 3 Core Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Admin */}
              <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 flex flex-col justify-between hover:border-[#202522] transition-all group shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#9b452f] text-[#eee8dc] flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="tag-rust">
                      NATIONAL DESK
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#202522] group-hover:text-[#9b452f] transition-colors">
                      {language === 'ar' ? 'لوحة التدقيق والرقابة (Admin)' : 'Admin Governance'}
                    </h3>
                    <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
                      {language === 'ar'
                        ? 'مراجعة السجلات التجارية، فحص شهادات التصدير، وتدقيق التحويلات البنكية لتفعيل الاشتراكات.'
                        : 'Audit company registries, inspect compliance certificates, and approve offline bank wire/Fawry payments.'
                      }
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#b9aa95]/40 text-xs font-mono text-[#202522]/70">
                    <span className="text-[#202522]/50">Persona: </span>Dr. Hesham El-Sayed
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('ADMIN', '/dashboard/admin')}
                  className="w-full mt-6 py-3 bg-[#202522] hover:bg-[#323934] text-[#eee8dc] rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{language === 'ar' ? 'دخول كمسؤول رقابة' : 'ENTER AS ADMIN'}</span>
                  <ArrowNext className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Importer */}
              <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 flex flex-col justify-between hover:border-[#202522] transition-all group shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#596348] text-[#eee8dc] flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="tag-olive">
                      BUYER DESK
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#202522] group-hover:text-[#596348] transition-colors">
                      {language === 'ar' ? 'بوابة المستورد الدولي (Importer)' : 'Wholesale Importer'}
                    </h3>
                    <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
                      {language === 'ar'
                        ? 'طرح مناقصات مغلقة (RFQs)، استعراض عروض الأسعار، وكشف هواتف وواتساب المصانع مجاناً.'
                        : 'Issue sealed tender requests, review confidential bids, and unlock direct WhatsApp coords.'
                      }
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#b9aa95]/40 text-xs font-mono text-[#202522]/70">
                    <span className="text-[#202522]/50">Persona: </span>Markus Weber (EuroFresh)
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('IMPORTER', '/rfqs')}
                  className="w-full mt-6 py-3 bg-[#596348] hover:bg-[#434b36] text-[#eee8dc] rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{language === 'ar' ? 'دخول كمستورد دولي' : 'ENTER AS IMPORTER'}</span>
                  <ArrowNext className="w-4 h-4" />
                </button>
              </div>

              {/* 3. Exporter */}
              <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 flex flex-col justify-between hover:border-[#202522] transition-all group shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#c38b40] text-[#202522] flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="tag-amber">
                      PRODUCER SEAT
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#202522] group-hover:text-[#c38b40] transition-colors">
                      {language === 'ar' ? 'لوحة المصدر المعتمد (Exporter)' : 'Verified Exporter'}
                    </h3>
                    <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
                      {language === 'ar'
                        ? 'إدارة منتجات المعرض، مواصفات خطوط الفرز Aweta، ومتابعة حصص مقاطع 4K وتحديث العروض.'
                        : 'Manage digital showroom catalog, Aweta optical specs, video quotas, and respond to buyer tenders.'
                      }
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#b9aa95]/40 text-xs font-mono text-[#202522]/70">
                    <span className="text-[#202522]/50">Persona: </span>Eng. Tarek Mansour (Nile Agro)
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('EXPORTER', '/dashboard/exporter')}
                  className="w-full mt-6 py-3 bg-[#202522] hover:bg-[#323934] text-[#eee8dc] rounded text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{language === 'ar' ? 'دخول كمصدر مصري' : 'ENTER AS EXPORTER'}</span>
                  <ArrowNext className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Prominent Visitor Button Banner */}
            <div className="p-6 bg-[#e4dac9] border-2 border-[#202522] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-mono font-bold text-[#9b452f] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'التصفح العام المجاني' : 'PUBLIC ACCESS TIER'}</span>
                </div>
                <h4 className="font-serif text-2xl text-[#202522]">
                  {language === 'ar' ? 'هل تريد استكشاف المحاصيل والدليل بدون تسجيل دخول؟' : 'Explore Commodities & Directory as a Guest?'}
                </h4>
                <p className="text-xs text-[#202522]/70 max-w-xl">
                  {language === 'ar'
                    ? 'تصفح كافة تصنيفات التصدير، ودليل الشركات، وبورصة البضائع الحاضرة ببيانات اتصال محمية.'
                    : 'Access full product specs, 4-level taxonomy navigator, and spot clearance listings.'
                  }
                </p>
              </div>

              <button
                onClick={handleContinueAsVisitor}
                className="w-full sm:w-auto px-8 py-4 bg-[#9b452f] hover:bg-[#833824] text-white rounded text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-md shrink-0"
              >
                <span>{language === 'ar' ? 'المتابعة كزائر عام ←' : 'CONTINUE AS VISITOR →'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls Bar */}
      <div className="pt-6 border-t border-[#b9aa95] flex items-center justify-between">
        <div>
          {currentPage < 3 ? (
            <button
              onClick={() => setCurrentPage(3)}
              className="text-xs font-mono text-[#202522]/60 hover:text-[#9b452f] underline underline-offset-4 uppercase tracking-wider"
            >
              {language === 'ar' ? 'تخطي الشرح إلى اختيار الحساب' : 'Skip to Account Selection →'}
            </button>
          ) : (
            <span className="text-xs font-mono text-[#202522]/60 uppercase tracking-widest">
              {language === 'ar' ? 'الصفحة ٤ من ٤ · اختيار الحساب' : 'Page 4 of 4: Role Selection'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {currentPage > 0 && (
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-5 py-2.5 border border-[#b9aa95] bg-[#e4dac9] hover:border-[#202522] text-[#202522] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <ArrowPrev className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}</span>
            </button>
          )}

          {currentPage < 3 ? (
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-6 py-2.5 bg-[#202522] hover:bg-[#323934] text-[#eee8dc] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>{language === 'ar' ? 'الصفحة التالية' : 'Next Page'}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleContinueAsVisitor}
              className="px-6 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>{language === 'ar' ? 'الدخول كزائر' : 'Enter as Visitor'}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
