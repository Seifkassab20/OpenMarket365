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
  ArrowRight, 
  ArrowLeft,
  Lock
} from 'lucide-react';
import TaxonomyNavigator from '@/components/shared/TaxonomyNavigator';
import MaskedContact from '@/components/shared/MaskedContact';
import { useAuth } from '@/lib/context/AuthContext';

export default function ProductsCatalogPage() {
  const { language, direction, t } = useLanguage();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedCert, setSelectedCert] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const handleTaxonomyFilter = (filters: {
    sector: string;
    commodity: string;
    certificate: string;
    targetCountry: string;
  }) => {
    setSelectedSector(filters.sector);
    setSelectedCert(filters.certificate);
    setSelectedCountry(filters.targetCountry);
  };

  const filteredProducts = fallbackProducts.filter((product) => {
    const matchesSearch = 
      (product.title_en && product.title_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.title_ar && product.title_ar.includes(searchTerm)) ||
      (product.hs_code && product.hs_code.includes(searchTerm));

    const matchesSector = 
      selectedSector === 'ALL' || 
      product.category?.code === selectedSector;

    const matchesCert = 
      selectedCert === 'ALL' || 
      (product.company?.quality_iso && product.company.quality_iso.toLowerCase().includes(selectedCert.toLowerCase()));

    return matchesSearch && matchesSector && matchesCert;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#b9aa95]">
        <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2">
          {language === 'ar' ? 'دليل الصادرات والسلع الوطنية' : '01 / COMMODITY REGISTER • NATIONAL CATALOG'}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#202522] tracking-tight">
          {language === 'ar' ? 'دليل الحاصلات والسلع المعتمدة للتصدير' : 'Egyptian Export Commodities.'}
        </h1>
        <p className="text-sm text-[#70695f] mt-3 max-w-2xl leading-relaxed">
          {language === 'ar' 
            ? 'تصفح المواصفات الفنية المعتمدة للمحاصيل والسلع الزراعية والصناعية المصرية مع جداول مواسم الحصاد والحد الأدنى للطلب واشتراطات الأسواق المستوردة.'
            : 'Explore certified Egyptian agricultural and industrial export commodities with verified HS codes, harvest windows, packaging specifications, and destination market compliance.'
          }
        </p>
      </div>

      {/* 4-Level Taxonomy & Destination Country Navigator */}
      <TaxonomyNavigator onFilterChange={handleTaxonomyFilter} />

      {/* Search Bar */}
      <div className="mb-10">
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-3.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9b452f] ml-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث باسم المحصول، كود البند الجمركي HS...' : 'Search by crop title, HS code (e.g. 0805 for citrus)...'}
            className="w-full bg-transparent border-none text-[#202522] placeholder-[#70695f] text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] transition-all duration-200 flex flex-col justify-between group shadow-sm"
          >
            <Link href={`/products/${product.slug}`} className="block relative h-56 bg-[#202522] overflow-hidden cursor-pointer">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title_en || 'Product'}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#202522] via-transparent to-transparent"></div>

              {/* HS Code Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono font-bold bg-[#202522] text-[#eee8dc] border border-[#b9aa95]">
                HS {product.hs_code}
              </div>

              {/* Company Tag */}
              {product.company && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-[#eee8dc] bg-[#202522]/90 px-3 py-1.5 border border-[#b9aa95]/40 backdrop-blur-sm">
                  <Building2 className="w-3.5 h-3.5 text-[#c38b40] flex-shrink-0" />
                  <span className="font-medium truncate">{product.company.company_name_en}</span>
                </div>
              )}
            </Link>

            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9b452f]">
                    {product.category?.name_en}
                  </span>
                  <span className="text-[10px] font-mono text-[#70695f]">
                    {product.harvest_season_from} - {product.harvest_season_to}
                  </span>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-xl font-serif text-[#202522] group-hover:text-[#9b452f] transition-colors line-clamp-1 mb-2">
                    {language === 'ar' ? product.title_ar : product.title_en}
                  </h3>
                </Link>
                <p className="text-xs text-[#565047] line-clamp-2 leading-relaxed mb-4">
                  {language === 'ar' ? product.body_ar : product.body_en}
                </p>

                {/* Specs Box */}
                <div className="space-y-1.5 text-xs p-3 bg-[#eee8dc] border border-[#b9aa95] mb-5">
                  <div className="flex items-center justify-between text-[#70695f]">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Box className="w-3.5 h-3.5 text-[#596348]" />
                      <span>{language === 'ar' ? 'التعبئة:' : 'Packaging:'}</span>
                    </span>
                    <strong className="text-[#202522] text-[11px] truncate max-w-[170px] font-medium">
                      {product.packaging_type}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#70695f]">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#9b452f]" />
                      <span>{language === 'ar' ? 'موسم الحصاد:' : 'Harvest Window:'}</span>
                    </span>
                    <strong className="text-[#9b452f] text-[11px] font-medium">
                      {product.harvest_season_from} - {product.harvest_season_to}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#70695f]">
                    <span className="text-[11px]">{language === 'ar' ? 'الحد الأدنى (MOQ):' : 'Min Order (MOQ):'}</span>
                    <strong className="text-[#202522] text-[11px] font-medium">{product.minimum_order_quantity} Metric Tons</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#b9aa95] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#70695f] uppercase tracking-wider block">Indicative FOB</span>
                    <div className="text-xl font-serif font-bold text-[#202522]">
                      {(!currentUser || currentUser.role === 'VISITOR') ? (
                        <span className="flex items-center gap-1.5 text-[#70695f]">
                          <Lock className="w-4 h-4 text-[#9b452f]" />
                          $••• <span className="text-xs font-sans font-normal">/ MT</span>
                        </span>
                      ) : (
                        <>${product.price} <span className="text-xs font-sans font-normal text-[#70695f]">/ MT</span></>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs font-bold text-[#9b452f] hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'المواصفات الفنية' : 'View Specs'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <MaskedContact
                      phone={product.company?.company_phone}
                      whatsapp={product.company?.company_phone}
                      email={product.company?.company_email}
                      companyName={product.title_en || 'Product'}
                      variant="button"
                    />
                  </div>
                  {(!currentUser || currentUser.role === 'VISITOR') ? (
                    <Link
                      href="/auth/register"
                      className="px-3.5 py-2 text-xs font-bold bg-[#eee8dc] hover:bg-[#202522] hover:text-[#eee8dc] border border-[#b9aa95] text-[#202522] flex items-center gap-1 flex-shrink-0 transition-colors"
                      title="Register to submit RFQs"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#9b452f]" />
                      <span>RFQ</span>
                    </Link>
                  ) : (
                    <Link
                      href="/rfqs/create"
                      className="px-3.5 py-2 text-xs font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-1 flex-shrink-0 transition-colors"
                    >
                      <span>RFQ →</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

