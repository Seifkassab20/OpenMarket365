'use client';

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies, fallbackProducts } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Video, 
  Phone, 
  Mail, 
  Globe, 
  Warehouse, 
  Cpu, 
  Anchor, 
  Package, 
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ExporterShowroomPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const company = fallbackCompanies.find((c) => c.slug === slug) || fallbackCompanies[0];
  const companyProducts = fallbackProducts.filter((p) => p.company_id === company.id);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-brand-dim">
        <Link href="/exporters" className="hover:text-white transition-colors">
          {t('navShowrooms')}
        </Link>
        <span>/</span>
        <span className="text-brand-gold font-medium">{company.company_name_en}</span>
      </div>

      {/* Hero Showroom Header Banner */}
      <div className="relative glass-panel rounded-3xl overflow-hidden border-brand-border">
        {company.cover_banner_url && (
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={company.cover_banner_url}
              alt={company.company_name_en}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent"></div>
          </div>
        )}

        {/* Floating Identity Card */}
        <div className="p-6 sm:p-8 -mt-20 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {company.logo_url && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-surface p-2 border-2 border-brand-gold shadow-2xl flex-shrink-0">
                <img
                  src={company.logo_url}
                  alt={company.company_name_en}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-emeraldDark/90 border border-brand-emeraldLight/40 text-brand-emeraldLight text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'ar' ? 'مصدّر معتمد رسمياً' : 'Officially Verified Exporter'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-brand-text text-xs font-mono border border-brand-border">
                  CR: {company.cr_number}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-brand-text text-xs font-mono border border-brand-border">
                  Tax ID: {company.tax_id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{company.governorate}, Egypt</span>
                </span>
                <span className="flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Ports: {company.export_port_history}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Masked Contact & Reveal Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <MaskedContact
              phone={company.company_phone}
              whatsapp={company.company_phone}
              email={company.company_email}
              companyName={company.company_name_en}
              variant="button"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Specs, Tour & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols): About, 4K Factory Tour, Products */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-3">
              {language === 'ar' ? 'نبذة عن الشركة والمنشأة' : 'Company & Packhouse Overview'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {language === 'ar' ? (company.about_ar || company.about_en) : company.about_en}
            </p>
          </div>

          {/* 4K YouTube Factory Tour Embed */}
          {company.youtube_video_id && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-brand-goldBorder/40">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-white">
                  {language === 'ar' ? 'جولة تفقدية في المصنع ومحطة الفرز' : '4K Optical Sorting & Packhouse Tour'}
                </h3>
              </div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${company.youtube_video_id}`}
                  title={`${company.company_name_en} Video Tour`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Published Products Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {language === 'ar' ? 'المنتجات والمحاصيل المتاحة للتصدير' : 'Export Commodities & Harvests'}
              </h3>
              <span className="text-xs text-brand-gold font-bold">
                {companyProducts.length} {language === 'ar' ? 'محاصيل' : 'Products'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {companyProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="glass-panel rounded-2xl overflow-hidden hover:border-brand-gold/40 transition-all flex flex-col justify-between group"
                >
                  <div className="h-44 bg-brand-navy relative overflow-hidden">
                    {prod.images && prod.images[0] && (
                      <img
                        src={prod.images[0]}
                        alt={prod.title_en || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-white border border-white/20">
                      HS {prod.hs_code}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                        {language === 'ar' ? prod.title_ar : prod.title_en}
                      </h4>
                      <p className="text-xs text-brand-dim line-clamp-2 leading-relaxed mb-4">
                        {language === 'ar' ? prod.body_ar : prod.body_en}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-white/5 border border-brand-border mb-4">
                        <div>
                          <span className="text-brand-dim block">MOQ:</span>
                          <strong className="text-white">{prod.minimum_order_quantity} MT</strong>
                        </div>
                        <div>
                          <span className="text-brand-dim block">Season:</span>
                          <strong className="text-brand-gold">{prod.harvest_season_from} - {prod.harvest_season_to}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-brand-border/60">
                      <div className="text-base font-extrabold text-white">
                        ${prod.price} <span className="text-[10px] font-normal text-brand-dim">/ MT</span>
                      </div>
                      <Link
                        href={`/products`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all"
                      >
                        {t('viewProductDetails')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Technical Specs & Certificate Vault */}
        <div className="space-y-8">
          {/* Facility Specs Box */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-brand-border/60 pb-3">
              {language === 'ar' ? 'القدرات الفنية والتخزينية' : 'Packhouse & Cold Storage Specs'}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Warehouse className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-dim block">Cold Storage Capacity:</span>
                  <span className="font-bold text-white">
                    {company.cold_storage_capacity_ml?.toLocaleString()} MT (Controlled Atmosphere)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cpu className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-dim block">Optical Sorting Machinery:</span>
                  <span className="font-bold text-white">{company.sorting_machinery}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-brand-emeraldLight flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-dim block">Annual Output:</span>
                  <span className="font-bold text-white">
                    {company.annual_capacity_ml?.toLocaleString()} Metric Tons / Year
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-dim flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-dim block">Factory Address:</span>
                  <span className="text-white">
                    {language === 'ar' ? (company.factory_address_ar || company.factory_address_en) : company.factory_address_en}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Quality Certificate Vault */}
          <div className="glass-panel-gold rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-goldBorder/40 pb-3">
              <Award className="w-4 h-4 text-brand-gold" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {language === 'ar' ? 'خزينة الشهادات والاعتمادات' : 'Compliance Certificate Vault'}
              </h4>
            </div>

            <div className="space-y-2.5">
              {company.quality_iso?.split(',').map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-brand-border text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-brand-text">
                    <ShieldCheck className="w-4 h-4 text-brand-emeraldLight" />
                    <span>{cert.trim()}</span>
                  </div>
                  <span className="text-[10px] font-bold text-brand-emeraldLight bg-brand-emerald/10 px-2 py-0.5 rounded border border-brand-emeraldLight/30">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Masked Contact Card */}
          <MaskedContact
            phone={company.company_phone}
            whatsapp={company.company_phone}
            email={company.company_email}
            companyName={company.company_name_en}
            variant="card"
          />
        </div>
      </div>
    </div>
  );
}
