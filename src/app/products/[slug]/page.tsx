'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackProducts, fallbackCompanies } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  Box, 
  Calendar, 
  MapPin, 
  Anchor, 
  ArrowLeft, 
  ArrowRight, 
  FileSpreadsheet, 
  Share2, 
  ThermometerSnowflake,
  Layers
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ProductDetailPage() {
  const { language, direction } = useLanguage();
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
      <div className="flex items-center justify-between pb-4 border-b border-[#b9aa95]">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#9b452f] hover:underline transition-colors uppercase tracking-[0.16em]"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة إلى دليل الحاصلات' : 'Back to Export Commodities'}</span>
        </Link>

        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 text-xs font-semibold bg-[#e4dac9] border border-[#b9aa95] text-[#565047] hover:text-[#202522] hover:border-[#202522] transition-all flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? (language === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!') : (language === 'ar' ? 'مشاركة المواصفة' : 'Share Specs')}</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 sm:h-[480px] bg-[#202522] border border-[#b9aa95] overflow-hidden shadow-sm">
            <img
              src={activeImage || product.images?.[0] || ''}
              alt={product.title_en || 'Product Image'}
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#202522] via-transparent to-transparent pointer-events-none"></div>

            {/* HS Code Overlay */}
            <div className="absolute top-4 left-4 px-3 py-1 text-xs font-mono font-bold bg-[#202522] text-[#eee8dc] border border-[#b9aa95]">
              HS Code: {product.hs_code}
            </div>

            {/* Verification Status */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-[#596348] text-[#eee8dc] text-xs font-bold border border-[#eee8dc]/20 shadow-sm">
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
                  className={`w-24 h-20 overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === img ? 'border-[#9b452f] opacity-100' : 'border-[#b9aa95] opacity-60 hover:opacity-100'
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
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#9b452f]/10 text-[#9b452f] border border-[#9b452f]/30">
                {product.category?.name_en}
              </span>
              <span className="text-xs font-mono text-[#70695f]">
                Harvest: {product.harvest_season_from} - {product.harvest_season_to}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#202522] leading-tight">
              {language === 'ar' ? product.title_ar : product.title_en}
            </h1>

            <p className="text-sm text-[#565047] leading-relaxed mt-3">
              {language === 'ar' ? product.body_ar : product.body_en}
            </p>
          </div>

          {/* Price & MOQ Banner */}
          <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#70695f] uppercase tracking-[0.2em] block font-bold">
                {language === 'ar' ? 'السعر الاسترشادي (FOB)' : 'Indicative FOB Price'}
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#202522]">
                ${product.price}{' '}
                <span className="text-xs font-sans font-normal text-[#70695f]">/ Metric Ton</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#70695f] uppercase tracking-[0.2em] block font-bold">
                {language === 'ar' ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order'}
              </span>
              <div className="text-2xl font-serif font-bold text-[#9b452f]">
                {product.minimum_order_quantity} <span className="text-xs font-sans font-normal text-[#565047]">MT</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 space-y-3.5 text-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#596348] flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{language === 'ar' ? 'المواصفات اللوجستية والفنية' : 'Logistics & Export Parameters'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95]">
                <span className="text-[10px] uppercase font-bold text-[#70695f] flex items-center gap-1 mb-1">
                  <Box className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Packaging Spec</span>
                </span>
                <p className="font-medium text-[#202522]">{product.packaging_type}</p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95]">
                <span className="text-[10px] uppercase font-bold text-[#70695f] flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#9b452f]" />
                  <span>Harvest Calendar</span>
                </span>
                <p className="font-medium text-[#9b452f]">{product.harvest_season_from} - {product.harvest_season_to}</p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95]">
                <span className="text-[10px] uppercase font-bold text-[#70695f] flex items-center gap-1 mb-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Cold-Chain Reefer Temp</span>
                </span>
                <p className="font-medium text-[#202522]">+3°C to +5°C (Reefer 40ft)</p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95]">
                <span className="text-[10px] uppercase font-bold text-[#70695f] flex items-center gap-1 mb-1">
                  <Anchor className="w-3.5 h-3.5 text-[#202522]" />
                  <span>Ports of Departure</span>
                </span>
                <p className="font-medium text-[#202522]">Alexandria, Damietta, Port Said</p>
              </div>
            </div>
          </div>

          {/* Exporter Showroom Card */}
          <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#202522] p-1 border border-[#b9aa95] overflow-hidden flex-shrink-0">
                <img
                  src={company.logo_url || ''}
                  alt={company.company_name_en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-serif text-[#202522]">
                    {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#596348]" />
                </div>
                <p className="text-[11px] text-[#70695f]">
                  {company.governorate}, Egypt • Sorter: {company.sorting_machinery || 'Aweta InVision'}
                </p>
              </div>
            </div>

            <Link
              href={`/exporters/${company.slug}`}
              className="px-3.5 py-2 text-xs font-bold border border-[#202522] text-[#202522] hover:bg-[#202522] hover:text-[#eee8dc] transition-all flex items-center gap-1 flex-shrink-0"
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
              href={`/importer/new-rfq`}
              className="flex-1 px-5 py-3 font-bold text-xs bg-[#9b452f] hover:bg-[#833824] text-white flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{language === 'ar' ? 'طلب عرض سعر رسمي (RFQ)' : 'Request Official RFQ Quote'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#b9aa95]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
                {language === 'ar' ? 'حاصلات تصديرية ذات صلة' : '02 / RELATED COMMODITIES'}
              </span>
              <h2 className="text-2xl font-serif text-[#202522]">
                {language === 'ar' ? 'منتجات إضافية من المصدرين المعتمدين' : 'More Certified Egyptian Commodities'}
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#9b452f] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View Full Catalog'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="bg-[#e4dac9] border border-[#b9aa95] p-4 hover:border-[#202522] transition-all duration-200 group flex items-center gap-4 shadow-sm"
              >
                <div className="w-20 h-20 bg-[#202522] overflow-hidden flex-shrink-0 border border-[#b9aa95]">
                  <img
                    src={rel.images?.[0] || ''}
                    alt={rel.title_en || 'Commodity'}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#9b452f] block">HS {rel.hs_code}</span>
                  <h4 className="text-sm font-serif text-[#202522] group-hover:text-[#9b452f] transition-colors truncate">
                    {language === 'ar' ? rel.title_ar : rel.title_en}
                  </h4>
                  <div className="text-sm font-serif font-bold text-[#202522] mt-1">
                    ${rel.price} <span className="text-[10px] font-sans font-normal text-[#70695f]">/ MT</span>
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

