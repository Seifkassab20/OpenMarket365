'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Video, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Warehouse
} from 'lucide-react';

export default function FeaturedExporters() {
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-bold text-brand-emeraldLight uppercase tracking-wider mb-2">
              {language === 'ar' ? 'الشركات الموثقة قانونياً' : 'Verified Egyptian Exporters'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('sectionShowrooms')}
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              {t('sectionShowroomsSub')}
            </p>
          </div>
          <Link
            href="/exporters"
            className="text-xs sm:text-sm font-semibold text-brand-gold hover:text-brand-goldLight flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Exporter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fallbackCompanies.map((company) => (
            <div
              key={company.id}
              className="glass-panel rounded-2xl overflow-hidden hover:border-brand-gold/40 transition-all duration-300 flex flex-col justify-between group shadow-card"
            >
              {/* Cover Banner */}
              <div className="relative h-44 w-full bg-brand-navy overflow-hidden">
                {company.cover_banner_url ? (
                  <img
                    src={company.cover_banner_url}
                    alt={company.company_name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-card flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-brand-dim" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/30"></div>

                {/* Verification Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-emeraldDark/90 border border-brand-emeraldLight/40 text-brand-emeraldLight text-[11px] font-bold shadow-lg backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('verifiedBadge')}</span>
                </div>

                {/* Video Tour Indicator */}
                {company.youtube_video_id && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-semibold backdrop-blur-md">
                    <Video className="w-3 h-3 text-red-500" />
                    <span>{language === 'ar' ? 'فيديو المعرض' : '4K Tour'}</span>
                  </div>
                )}

                {/* Location Pill */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-brand-muted bg-brand-dark/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-brand-border">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  <span>{company.governorate}, Egypt</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                    {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
                  </h3>
                  <p className="text-xs text-brand-dim line-clamp-2 leading-relaxed mb-4">
                    {language === 'ar' ? (company.about_ar || company.about_en) : company.about_en}
                  </p>

                  {/* Operational Metrics */}
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

                  {/* Certifications Vault */}
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

                {/* Card CTA */}
                <div className="pt-4 border-t border-brand-border/60">
                  <Link
                    href={`/exporters/${company.slug}`}
                    className="w-full py-2.5 rounded-xl text-xs font-bold border border-brand-goldBorder text-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-center gap-2 group-hover:shadow-gold"
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
    </section>
  );
}
