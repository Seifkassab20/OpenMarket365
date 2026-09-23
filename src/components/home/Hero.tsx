'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function Hero() {
  const { language, direction } = useLanguage();
  const router = useRouter();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-[#eee8dc] pt-12 pb-16 border-b border-[#b9aa95]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="kicker">
              {language === 'ar' ? 'البوابة الوطنية لتصدير الحاصلات · معتمدة' : 'NATIONAL EXPORT GATEWAY · SINCE 2019'}
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl text-[#202522] leading-[1.05] tracking-tight">
              {language === 'ar' ? (
                <>
                  مصر، <br />
                  <span className="italic text-[#9b452f]">في أوج موسمها.</span>
                </>
              ) : (
                <>
                  Egypt, <br />
                  <span className="italic text-[#9b452f]">in season.</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#565047] max-w-lg leading-relaxed">
              {language === 'ar'
                ? 'طريقك المباشر والمعتمد إلى المزارع والمصانع ومحطات الفرز الجاهزة للتصدير خلف شحنات مصر القادمة.'
                : 'A verified route to the farms, factories and port-ready suppliers behind Egypt’s next shipment.'
              }
            </p>

            <div className="space-y-3 pt-2">
              {[
                { en: 'Direct access to Egyptian Valencia oranges, Navel, and IQF strawberries', ar: 'تواصل مباشر مع مزارع برتقال فالنسيا وبسرة والفراولة المجمدة' },
                { en: 'Direct maritime trade lanes to Rotterdam, Hamburg, Jeddah, and Jebel Ali', ar: 'خطوط شحن بحري مبردة إلى روتردام، هامبورغ، جدة، وجبل علي' },
                { en: 'Indicative FOB & CFR price transparency updated with harvest cycles', ar: 'شفافية أسعار FOB و CFR الاسترشادية حسب مواسم الجني' },
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#202522]">
                  <div className="w-5 h-5 rounded-full bg-[#596348]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#596348]" />
                  </div>
                  <span>{language === 'ar' ? pt.ar : pt.en}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/exporters"
                className="px-6 py-3.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold tracking-[0.14em] uppercase transition-all flex items-center gap-2 shadow-sm"
              >
                <span>{language === 'ar' ? 'استعراض المصدرين' : 'EXPLORE EXPORTERS'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/importer/new-rfq"
                className="px-6 py-3.5 border border-[#202522] hover:bg-[#202522] hover:text-white text-[#202522] text-xs font-bold tracking-[0.14em] uppercase transition-all"
              >
                <span>{language === 'ar' ? 'طرح طلب توريد (RFQ)' : 'ISSUE AN RFQ'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Photography with Olive Floating Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden bg-[#e4dac9] border border-[#b9aa95] aspect-[4/3] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=1200&auto=format&fit=crop&q=80"
                alt="Egyptian citrus orchard at golden hour"
                className="w-full h-full object-cover"
              />
              
              {/* Photo Caption Badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 text-[#202522] px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase border border-[#b9aa95]/40 shadow-sm">
                NILE DELTA · CITRUS SEASON 25
              </div>

              {/* Floating Olive Badge matching Replit */}
              <div className="absolute bottom-0 right-0 w-44 sm:w-48 bg-[#596348] text-[#f4efe5] p-4 sm:p-5 border-t border-l border-[#434b36] shadow-md">
                <div className="font-serif text-3xl sm:text-4xl text-[#d4c7b5] leading-none mb-1">
                  01
                </div>
                <p className="text-[11px] leading-snug font-medium text-[#eee8dc]">
                  One national index. Thousands of verified routes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Stats Bar matching Replit */}
        <div className="mt-16 pt-8 border-t border-[#b9aa95] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[#202522]">
          <div className="sm:border-r border-[#b9aa95] sm:pr-6">
            <div className="font-serif text-3xl sm:text-4xl leading-none">
              2,480+
            </div>
            <div className="text-[10px] tracking-[0.16em] uppercase font-bold text-[#70695f] mt-1">
              VERIFIED EXPORTERS
            </div>
          </div>

          <div className="lg:border-r border-[#b9aa95] lg:pr-6">
            <div className="font-serif text-3xl sm:text-4xl leading-none">
              64
            </div>
            <div className="text-[10px] tracking-[0.16em] uppercase font-bold text-[#70695f] mt-1">
              TRADE DESTINATIONS
            </div>
          </div>

          <div className="sm:border-r border-[#b9aa95] sm:pr-6">
            <div className="font-serif text-3xl sm:text-4xl leading-none">
              18
            </div>
            <div className="text-[10px] tracking-[0.16em] uppercase font-bold text-[#70695f] mt-1">
              PORTS & DRY HUBS
            </div>
          </div>

          <div className="text-xs text-[#70695f] leading-relaxed flex items-center">
            {language === 'ar'
              ? 'يتم تدقيق وفحص كافة الشركات وفقاً للسجلات التجارية الرسمية وشهادات الفحص قبل إدراجها في الدليل الوطني.'
              : 'Every company is checked against registry, certificate and facility records before it reaches the directory.'
            }
          </div>
        </div>
      </div>
    </section>
  );
}
