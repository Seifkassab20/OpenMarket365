'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function CategoryExplorer() {
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const sectors = [
    {
      num: '01',
      titleEn: 'Agriculture & Fresh Produce',
      titleAr: 'الحاصلات الزراعية والطازجة',
      code: 'CITRUS',
      subtextEn: 'Valencia oranges, Navel, Lemons, Dates, Onions & Garlic',
      subtextAr: 'برتقال فالنسيا، أبو سرة، ليمون، تمور، بصل وثوم',
      tag: 'AGRICULTURE',
    },
    {
      num: '02',
      titleEn: 'Processed & IQF Frozen Food',
      titleAr: 'الصناعات الغذائية والمجمدات',
      code: 'FROZEN_AGRO',
      subtextEn: 'IQF strawberries, Artichokes, Broccoli, Pickled olives',
      subtextAr: 'فراولة مجمدة IQF، قلوب خرشوف، خضروات، زيتون مخلل',
      tag: 'PROCESSED FOOD',
    },
    {
      num: '03',
      titleEn: 'Medicinal Herbs & Essential Oils',
      titleAr: 'الأعشاب الطبية والزيوت العطرية',
      code: 'HERBS_SPICES',
      subtextEn: 'Organic chamomile, Peppermint, Basil, Hibiscus tea cut',
      subtextAr: 'بابونج عضوي، نعناع، ريحان، وكركديه سوداني معقم',
      tag: 'HERBS & OILS',
    },
    {
      num: '04',
      titleEn: 'Industrial, Chemical & Textiles',
      titleAr: 'الصناعات الهندسية والغزل والنسيج',
      code: 'ALLIUM',
      subtextEn: 'Egyptian Giza cotton yarn, Fertilizers, Marble & Granite',
      subtextAr: 'غزول قطن جيزة المصري، أسمدة يوريا، رخام وجرانيت',
      tag: 'MANUFACTURING',
    },
  ];

  return (
    <section className="py-20 bg-[#eee8dc] border-b border-[#b9aa95]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Headline & Subtitle */}
          <div className="lg:col-span-5 space-y-4">
            <div className="kicker">
              {language === 'ar' ? '٠١ / البحث حسب المصدر' : '01 / FIND BY ORIGIN'}
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#202522] leading-tight font-normal">
              {language === 'ar' ? (
                <>
                  تصنيف متجذر <br />
                  <span className="italic text-[#9b452f]">في عمق المنشأ.</span>
                </>
              ) : (
                <>
                  A taxonomy <br />
                  <span className="italic text-[#9b452f]">with roots.</span>
                </>
              )}
            </h2>

            <p className="text-sm text-[#70695f] leading-relaxed max-w-sm">
              {language === 'ar'
                ? 'ابدأ بنطاق عريض، ثم حدد المنتج المصري الدقيق ومسار الشحن المعتمد الذي يتطلبه استيرادك.'
                : 'Start broad, then narrow to the exact Egyptian product and route your buyer needs.'
              }
            </p>

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#9b452f] hover:underline uppercase tracking-[0.14em]"
              >
                <span>{language === 'ar' ? 'فتح دليل التصنيف الرباعي' : 'Explore 4-Level Navigator'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Editorial List with Horizontal Dividers */}
          <div className="lg:col-span-7">
            <div className="border-t border-[#202522]">
              {sectors.map((sector) => (
                <Link
                  key={sector.num}
                  href={`/products?category=${sector.code}`}
                  className="group block py-5 border-b border-[#b9aa95] hover:bg-[#e4dac9]/50 transition-colors px-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-[#70695f]">
                        {sector.num}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-[#202522] group-hover:text-[#9b452f] transition-colors">
                          {language === 'ar' ? sector.titleAr : sector.titleEn}
                        </h3>
                        <p className="text-xs text-[#70695f] mt-0.5">
                          {language === 'ar' ? sector.subtextAr : sector.subtextEn}
                        </p>
                      </div>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-[#70695f] group-hover:text-[#9b452f] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Replit Tag Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-6">
              <span className="tag tag-olive">AGRICULTURE</span>
              <span className="tag tag-muted">CITRUS & FRESH PRODUCE</span>
              <span className="tag tag-muted">ALEXANDRIA PORT</span>
              <span className="tag tag-amber">VERIFIED PACKHOUSES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
