'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackProducts, fallbackCompanies } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  Box, 
  Calendar, 
  Award, 
  MapPin, 
  Anchor, 
  ArrowLeft, 
  ArrowRight, 
  FileSpreadsheet, 
  Share2, 
  CheckCircle2, 
  ThermometerSnowflake,
  Layers,
  Scale
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ProductDetailPage() {
  const { language, direction, t } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;

  const product = fallbackProducts.find((p) => p.slug === slug) || fallbackProducts[0];
  const company = product.company || fallbackCompanies.find((c) => c.id === product.company_id) || fallbackCompanies[0];
  const relatedProducts = fallbackProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const [activeImage, setActiveImage] = useState<string>(product.images?.[0] || '');
  const [copied, setCopied] = useState(false);

  const ArrowIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-goldLight transition-colors"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة إلى دليل المنتجات' : 'Back to Export Commodities'}</span>
        </Link>

        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-brand-border text-brand-dim hover:text-white hover:border-brand-gold/40 transition-all flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? (language === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!') : (language === 'ar' ? 'مشاركة المواصفة' : 'Share Specs')}</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-brand-border/60 shadow-card">
            <img
              src={activeImage || product.images?.[0] || ''}
              alt={product.title_en || 'Product Image'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent pointer-events-none"></div>

            {/* HS Code Overlay */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-black/80 text-brand-gold border border-brand-goldBorder backdrop-blur-md">
              HS Code: {product.hs_code}
            </div>

            {/* Verification Status */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-emeraldDark/90 border border-brand-emeraldLight/40 text-brand-emeraldLight text-xs font-bold shadow-lg backdrop-blur-md">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ar' ? 'مطابق لمواصفات التصدير' : 'Export Ready'}</span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === img ? 'border-brand-gold shadow-gold scale-105' : 'border-brand-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Procurement Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-goldBorder">
                {product.category?.name_en}
              </span>
              <span className="text-xs text-brand-dim">
                Harvest: {product.harvest_season_from} - {product.harvest_season_to}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {language === 'ar' ? product.title_ar : product.title_en}
            </h1>

            <p className="text-sm text-brand-muted leading-relaxed mt-3">
              {language === 'ar' ? product.body_ar : product.body_en}
            </p>
          </div>

          {/* Price & MOQ Banner */}
          <div className="glass-panel-gold rounded-2xl p-5 border border-brand-goldBorder flex items-center justify-between">
            <div>
              <span className="text-[10px] text-brand-dim uppercase tracking-wider block font-bold">
                {language === 'ar' ? 'السعر الاسترشادي (FOB)' : 'Indicative FOB Price'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-brand-gold">
                ${product.price}{' '}
                <span className="text-xs font-normal text-brand-dim">/ Metric Ton</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-brand-dim uppercase tracking-wider block font-bold">
                {language === 'ar' ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order'}
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                {product.minimum_order_quantity} <span className="text-xs font-normal text-brand-muted">MT</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="glass-panel rounded-2xl p-5 space-y-3.5 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-emeraldLight flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{language === 'ar' ? 'المواصفات اللوجستية والفنية' : 'Logistics & Export Parameters'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-brand-border/60">
                <span className="text-[11px] text-brand-dim flex items-center gap-1 mb-1">
                  <Box className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Packaging Spec</span>
                </span>
                <p className="font-semibold text-white">{product.packaging_type}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-brand-border/60">
                <span className="text-[11px] text-brand-dim flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Harvest Calendar</span>
                </span>
                <p className="font-semibold text-brand-gold">{product.harvest_season_from} - {product.harvest_season_to}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-brand-border/60">
                <span className="text-[11px] text-brand-dim flex items-center gap-1 mb-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
                  <span>Cold-Chain Reefer Temp</span>
                </span>
                <p className="font-semibold text-white">+3°C to +5°C (Reefer 40ft)</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-brand-border/60">
                <span className="text-[11px] text-brand-dim flex items-center gap-1 mb-1">
                  <Anchor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ports of Departure</span>
                </span>
                <p className="font-semibold text-white">Alexandria, Damietta, Port Said</p>
              </div>
            </div>
          </div>

          {/* Exporter Showroom Card */}
          <div className="glass-panel rounded-2xl p-5 border border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-brand-navy p-1.5 border border-brand-goldBorder overflow-hidden flex-shrink-0">
                <img
                  src={company.logo_url || ''}
                  alt={company.company_name_en}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">
                    {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-emeraldLight" />
                </div>
                <p className="text-[11px] text-brand-dim">
                  {company.governorate}, Egypt • Sorter: {company.sorting_machinery || 'Aweta InVision'}
                </p>
              </div>
            </div>

            <Link
              href={`/exporters/${company.slug}`}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-brand-border text-brand-gold hover:border-brand-gold hover:bg-brand-gold/10 transition-all flex items-center gap-1 flex-shrink-0"
            >
              <span>{language === 'ar' ? 'زيارة المعرض' : 'View Showroom'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Direct Actions: Masked Contact & RFQ Submission */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1">
              <MaskedContact
                phone={company.company_phone}
                whatsapp={company.company_phone}
                email={company.company_email}
                companyName={language === 'ar' ? (product.title_ar || product.title_en || '') : (product.title_en || '')}
                variant="button"
              />
            </div>

            <Link
              href={`/rfqs/create`}
              className="flex-1 px-5 py-3 rounded-xl font-bold text-xs bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald flex items-center justify-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{language === 'ar' ? 'طلب عرض سعر رسمي (RFQ)' : 'Request Official RFQ Quote'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-brand-border/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                {language === 'ar' ? 'حاصلات تصديرية ذات صلة' : 'Related Commodities'}
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {language === 'ar' ? 'منتجات إضافية من المصدرين المعتمدين' : 'More Certified Egyptian Commodities'}
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-brand-gold hover:underline flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View Catalog'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="glass-panel rounded-2xl p-4 hover:border-brand-gold/50 transition-all duration-300 group flex items-center gap-4"
              >
                <div className="w-20 h-20 rounded-xl bg-brand-navy overflow-hidden flex-shrink-0">
                  <img
                    src={rel.images?.[0] || ''}
                    alt={rel.title_en || 'Commodity'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-brand-gold block">HS {rel.hs_code}</span>
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors truncate">
                    {language === 'ar' ? rel.title_ar : rel.title_en}
                  </h4>
                  <div className="text-xs font-extrabold text-brand-emeraldLight mt-1">
                    ${rel.price} <span className="text-[10px] font-normal text-brand-dim">/ MT</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
