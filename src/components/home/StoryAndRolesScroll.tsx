'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  Sparkles, 
  Check
} from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function StoryAndRolesScroll() {
  const { language } = useLanguage();

  const narrativePages = [
    {
      pageNumber: '01 / 02',
      kickerEn: '01 · AUDITED PACKHOUSES & CERTIFICATION',
      kickerAr: '٠١ · محطات الفرز المعتمدة وتدقيق الشهادات',
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
      pageNumber: '02 / 02',
      kickerEn: '02 · CONFIDENTIAL RFQS & SECONDARY CARGO',
      kickerAr: '٠٢ · مناقصات سرية وبورصة الشحنات الجاهزة',
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
    <div className="flex flex-col space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 1. Narrative Section - Iterating over pages */}
      {narrativePages.map((page, index) => (
        <ScrollReveal key={index}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full pb-16 border-b border-[#b9aa95]/40 last:border-b-0">
            {/* Left Column: Narrative Headline, Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#e4dac9] border border-[#b9aa95] text-[#9b452f] text-[11px] font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#c38b40]" />
                <span>{language === 'ar' ? page.kickerAr : page.kickerEn}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-[#202522] leading-[1.08] tracking-tight">
                {language === 'ar' ? (
                  <>
                    {page.titleAr} <br />
                    <span className="italic text-[#9b452f]">{page.titleHighlightAr}</span>
                  </>
                ) : (
                  <>
                    {page.titleEn} <br />
                    <span className="italic text-[#9b452f]">{page.titleHighlightEn}</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#202522]/80 max-w-xl leading-relaxed">
                {language === 'ar' ? page.descAr : page.descEn}
              </p>

              {/* Editorial Highlights */}
              <div className="space-y-3 pt-2">
                {page.points.map((pt, i) => (
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
                  src={page.image}
                  alt="Market 365 Overview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Top Tag */}
                <div className="absolute top-4 left-4 bg-white/95 text-[#202522] px-3 py-1 text-[10px] font-bold tracking-[0.16em] uppercase border border-[#b9aa95]/50 shadow-sm">
                  {language === 'ar' ? page.imageCaptionAr : page.imageCaptionEn}
                </div>

                {/* Floating Nile Olive Tag */}
                <div className="absolute bottom-0 right-0 max-w-[260px] bg-[#596348] text-[#f4efe5] p-4 border-t border-l border-[#434b36] shadow-lg">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#d4c7b5] mb-1 font-bold">
                    {language === 'ar' ? 'ضمان المنصة' : 'PLATFORM STANDARD'}
                  </div>
                  <p className="text-xs leading-snug font-medium text-[#eee8dc]">
                    {language === 'ar' ? page.badgeAr : page.badgeEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}

    </div>
  );
}
