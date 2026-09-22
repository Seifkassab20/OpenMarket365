'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Play } from 'lucide-react';

export default function MediaSpotlight() {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-[#eee8dc] border-b border-[#b9aa95]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="kicker mb-6">
          {language === 'ar' ? '٠٣ / تقارير الميدان وبرنامج هنقدر' : '03 / FIELD NOTES'}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Video Feature Card */}
          <div className="lg:col-span-7 space-y-3">
            <Link href="/media" className="group block relative aspect-[16/9] overflow-hidden bg-[#202522] border border-[#b9aa95]">
              <img
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=1000&auto=format&fit=crop&q=80"
                alt="Inside the Nile Harvest packing line"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-[#202522] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#9b452f] group-hover:text-white transition-all shadow-md">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 text-xs text-[#565047] font-medium pt-1">
              <span className="text-[#9b452f]">▷</span>
              <Link href="/media" className="hover:text-[#9b452f] transition-colors">
                {language === 'ar' 
                  ? 'شاهد: جولة داخل محطة فرز وتعبئة الحاصلات · برنامج هنقدر التلفزيوني (03:42)'
                  : 'Watch: Inside the Nile Harvest packing line · National TV Feature (03:42)'
                }
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Text & Link */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-serif text-4xl sm:text-6xl text-[#202522] leading-[1.08] font-normal">
              {language === 'ar' ? (
                <>
                  الجهد الكامن <br />
                  <span className="italic text-[#9b452f]">خلف كل علامة.</span>
                </>
              ) : (
                <>
                  The work behind <br />
                  <span className="italic text-[#9b452f]">the label.</span>
                </>
              )}
            </h2>

            <p className="text-sm text-[#565047] leading-relaxed">
              {language === 'ar'
                ? 'جولات مصورة في المحطات، تقارير الحصاد، وإحاطات الموانئ من المنتجين الذين يجعلون جودة الصادرات المصرية واضحة وموثقة أمام العالم.'
                : 'Factory tours, harvest reports and port briefings from the people who make Egyptian supply legible to the world.'
              }
            </p>

            <div className="pt-2">
              <Link
                href="/media"
                className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#202522] border-b-2 border-[#9b452f] pb-1 hover:text-[#9b452f] transition-colors"
              >
                {language === 'ar' ? 'استعراض الحلقات وتقارير الميدان' : 'RECEIVE FIELD NOTES'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
