'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Search, 
  Award, 
  Video, 
  ArrowRight, 
  ArrowLeft,
  SlidersHorizontal
} from 'lucide-react';

export default function ExportersDirectoryPage() {
  const { language, direction, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGov, setSelectedGov] = useState<string>('ALL');

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const filteredCompanies = fallbackCompanies.filter((company) => {
    const matchesSearch = 
      company.company_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.company_name_ar && company.company_name_ar.includes(searchTerm)) ||
      (company.about_en && company.about_en.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGov = selectedGov === 'ALL' || company.governorate === selectedGov;

    return matchesSearch && matchesGov;
  });

  const governorates = ['ALL', 'Al-Beheira', 'Al-Sharkia', 'Beni Suef', 'Alexandria', 'Ismailia'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs font-bold text-brand-emeraldLight uppercase tracking-wider mb-2">
          {language === 'ar' ? 'الدليل الوطني للمصدرين' : 'National Exporter Directory'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('sectionShowrooms')}
        </h1>
        <p className="text-sm text-brand-muted mt-2 max-w-2xl">
          {language === 'ar' 
            ? 'تصفح كبرى محطات التعبئة والمصانع وسلاسل التبريد المصرية المعتمدة بالسجل التجاري وشهادات الجودة الدولية.'
            : 'Browse Egypt’s accredited agricultural packing stations, food processing complexes, and cold chain export facilities.'
          }
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-brand-dim absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'بحث باسم الشركة أو المحصول...' : 'Search by exporter name or crop...'}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
          />
        </div>

        {/* Governorate Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-brand-gold flex-shrink-0" />
          {governorates.map((gov) => (
            <button
              key={gov}
              onClick={() => setSelectedGov(gov)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGov === gov
                  ? 'bg-brand-gold text-brand-dark shadow-sm'
                  : 'bg-white/5 border border-brand-border text-brand-muted hover:text-white'
              }`}
            >
              {gov === 'ALL' ? (language === 'ar' ? 'جميع المحافظات' : 'All Governorates') : gov}
            </button>
          ))}
        </div>
      </div>

      {/* Exporter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="glass-panel rounded-2xl overflow-hidden hover:border-brand-gold/40 transition-all flex flex-col justify-between group shadow-card"
          >
            <div className="relative h-44 w-full bg-brand-navy overflow-hidden">
              {company.cover_banner_url && (
                <img
                  src={company.cover_banner_url}
                  alt={company.company_name_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/30"></div>

              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-emeraldDark/90 border border-brand-emeraldLight/40 text-brand-emeraldLight text-[11px] font-bold shadow-lg backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('verifiedBadge')}</span>
              </div>

              {company.youtube_video_id && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-semibold backdrop-blur-md">
                  <Video className="w-3 h-3 text-red-500" />
                  <span>{language === 'ar' ? 'فيديو المعرض' : '4K Tour'}</span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-brand-muted bg-brand-dark/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-brand-border">
                <MapPin className="w-3 h-3 text-brand-gold" />
                <span>{company.governorate}, Egypt</span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                  {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
                </h3>
                <p className="text-xs text-brand-dim line-clamp-2 leading-relaxed mb-4">
                  {language === 'ar' ? (company.about_ar || company.about_en) : company.about_en}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-brand-border/60 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-brand-dim uppercase block">
                      {language === 'ar' ? 'الطاقة السنوية' : 'Annual Capacity'}
                    </span>
                    <span className="font-bold text-white">
                      {company.annual_capacity_ml ? `${company.annual_capacity_ml.toLocaleString()} MT` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-dim uppercase block">
                      {language === 'ar' ? 'سعة التبريد' : 'Cold Storage'}
                    </span>
                    <span className="font-bold text-brand-cyan">
                      {company.cold_storage_capacity_ml ? `${company.cold_storage_capacity_ml.toLocaleString()} MT` : 'Ambient'}
                    </span>
                  </div>
                </div>

                {company.quality_iso && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {company.quality_iso.split(',').slice(0, 3).map((cert, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-goldBorder/40 flex items-center gap-1"
                      >
                        <Award className="w-2.5 h-2.5" />
                        <span>{cert.trim()}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-brand-border/60">
                <Link
                  href={`/exporters/${company.slug}`}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border border-brand-goldBorder text-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('viewShowroom')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
