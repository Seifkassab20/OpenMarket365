'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies } from '@/lib/data/fallbackData';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function FeaturedExporters() {
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const featured = fallbackCompanies.slice(0, 3);
  const tierBadges = ['ELITE', 'PREMIUM', 'PLUS'];

  return (
    <section className="py-20 bg-[#202522] text-[#eee8dc] border-b border-[#363e39]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[#c38b40] mb-2">
              {language === 'ar' ? '٠٢ / نخبة المصدرين المعتمدين' : '02 / THE VERIFIED SHELF'}
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-white font-normal">
              {language === 'ar' ? 'مصدرون جديرون بالثقة' : 'Exporters to know'}
            </h2>
          </div>
          <Link
            href="/exporters"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#dcd1bf] hover:text-white flex items-center gap-1.5 group"
          >
            <span>{language === 'ar' ? 'استعراض الدليل بالكامل' : 'VIEW FULL DIRECTORY'}</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Cards Grid matching Replit screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((company, idx) => (
            <Link
              key={company.id}
              href={`/exporters/${company.slug}`}
              className="group block border-b border-[#363e39] pb-6 hover:border-[#b9aa95] transition-colors"
            >
              {/* Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#151a17] mb-4">
                <img
                  src={
                    company.featured_gallery_url ||
                    company.cover_banner_url ||
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={company.company_name_en}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                />
              </div>

              {/* Info Row with Tier Tag */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal group-hover:text-[#c38b40] transition-colors">
                    {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
                  </h3>
                  <p className="text-xs text-[#b9aa95] mt-1">
                    {company.governorate}, Egypt · {company.sorting_machinery || 'Aweta Optical Sorters'}
                  </p>
                  <p className="text-[11px] text-[#70695f] mt-0.5">
                    CR: {company.cr_number} · Cold Chain: {company.cold_storage_capacity_ml ? `${company.cold_storage_capacity_ml} MT` : '12,000 MT'}
                  </p>
                </div>

                <span className={`px-2 py-1 text-[9px] font-bold tracking-[0.16em] uppercase flex-shrink-0 ${
                  idx === 0
                    ? 'bg-[#c38b40] text-[#202522]'
                    : 'bg-[#596348] text-[#f4efe5]'
                }`}>
                  {tierBadges[idx]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
