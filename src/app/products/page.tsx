'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackProducts, fallbackCategories } from '@/lib/data/fallbackData';
import { 
  Package, 
  Search, 
  Filter, 
  Calendar, 
  Box, 
  Building2, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export default function ProductsCatalogPage() {
  const { language, direction, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('ALL');

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const filteredProducts = fallbackProducts.filter((product) => {
    const matchesSearch = 
      (product.title_en && product.title_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.title_ar && product.title_ar.includes(searchTerm)) ||
      (product.hs_code && product.hs_code.includes(searchTerm));

    const matchesCategory = 
      selectedCategoryCode === 'ALL' || 
      product.category?.code === selectedCategoryCode;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
          {language === 'ar' ? 'دليل الصادرات والسلع' : 'National Commodity Catalog'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('sectionProducts')}
        </h1>
        <p className="text-sm text-brand-muted mt-2 max-w-2xl">
          {language === 'ar' 
            ? 'تصفح المواصفات الفنية المعتمدة للمحاصيل والسلع الزراعية والصناعية المصرية مع جداول مواسم الحصاد والحد الأدنى للطلب.'
            : 'Explore certified Egyptian agricultural and industrial export commodities with HS codes, harvest windows, packaging specifications, and pricing.'
          }
        </p>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4 mb-10">
        <div className="glass-panel rounded-2xl p-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-gold ml-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث باسم المحصول، كود البند الجمركي HS...' : 'Search by crop title, HS code (e.g. 0805)...'}
            className="w-full bg-transparent border-none text-white placeholder-brand-dim text-sm focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategoryCode('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryCode === 'ALL'
                ? 'bg-brand-gold text-brand-dark shadow-gold'
                : 'bg-white/5 border border-brand-border text-brand-muted hover:text-white'
            }`}
          >
            {t('filterAll')}
          </button>
          {fallbackCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryCode(cat.code || '')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryCode === cat.code
                  ? 'bg-brand-gold text-brand-dark shadow-gold'
                  : 'bg-white/5 border border-brand-border text-brand-muted hover:text-white'
              }`}
            >
              {language === 'ar' ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="glass-panel rounded-3xl overflow-hidden hover:border-brand-gold/40 transition-all duration-300 flex flex-col justify-between group shadow-card"
          >
            <div className="relative h-52 bg-brand-navy overflow-hidden">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title_en || 'Product'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-black/30"></div>

              {/* HS Code Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/70 text-brand-gold border border-brand-goldBorder backdrop-blur-md">
                HS {product.hs_code}
              </div>

              {/* Company Tag */}
              {product.company && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-white bg-brand-dark/80 px-3 py-1.5 rounded-xl backdrop-blur-md border border-brand-border">
                  <Building2 className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                  <span className="font-semibold truncate">{product.company.company_name_en}</span>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                  {language === 'ar' ? product.title_ar : product.title_en}
                </h3>
                <p className="text-xs text-brand-dim line-clamp-3 leading-relaxed mb-4">
                  {language === 'ar' ? product.body_ar : product.body_en}
                </p>

                {/* Specs Box */}
                <div className="space-y-2 text-xs p-3 rounded-xl bg-white/5 border border-brand-border/60 mb-6">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Box className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>{language === 'ar' ? 'التعبئة:' : 'Packaging:'}</span>
                    </span>
                    <strong className="text-white text-[11px] truncate max-w-[180px]">
                      {product.packaging_type}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{language === 'ar' ? 'موسم الحصاد:' : 'Season:'}</span>
                    </span>
                    <strong className="text-brand-gold text-[11px]">
                      {product.harvest_season_from} - {product.harvest_season_to}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="text-[11px]">{language === 'ar' ? 'الحد الأدنى (MOQ):' : 'Min Order (MOQ):'}</span>
                    <strong className="text-white text-[11px]">{product.minimum_order_quantity} Metric Tons</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-dim uppercase block">Indicative Price</span>
                  <div className="text-lg font-extrabold text-brand-gold">
                    ${product.price} <span className="text-xs font-normal text-brand-dim">/ MT</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/201008920110?text=${encodeURIComponent(`Inquiry for ${product.title_en} via OpenMarket365`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('directWhatsApp')}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
