'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCategories } from '@/lib/data/fallbackData';
import { 
  Layers, 
  Globe, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Filter,
  ShieldCheck
} from 'lucide-react';

interface TaxonomyNavigatorProps {
  onFilterChange: (filters: {
    sector: string;
    commodity: string;
    certificate: string;
    targetCountry: string;
  }) => void;
}

export default function TaxonomyNavigator({ onFilterChange }: TaxonomyNavigatorProps) {
  const { language, direction } = useLanguage();
  const Chevron = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [activeSector, setActiveSector] = useState<string>('ALL');
  const [activeCommodity, setActiveCommodity] = useState<string>('ALL');
  const [activeCertificate, setActiveCertificate] = useState<string>('ALL');
  const [activeCountry, setActiveCountry] = useState<string>('ALL');

  const destinationCountries = [
    { code: 'ALL', nameEn: 'All Destination Markets', nameAr: 'جميع أسواق التصدير' },
    { code: 'EU', nameEn: 'European Union (Rotterdam, Hamburg)', nameAr: 'الاتحاد الأوروبي (روتردام، هامبورغ)', reqCert: 'GlobalGAP, BRC' },
    { code: 'GCC', nameEn: 'Gulf & Saudi Arabia (Jeddah, Jebel Ali)', nameAr: 'الخليج والمملكة العربية السعودية', reqCert: 'SFDA, Halal' },
    { code: 'USA', nameEn: 'United States & Canada', nameAr: 'أمريكا الشمالية وكندا', reqCert: 'FDA, USDA Organic' },
    { code: 'UK', nameEn: 'United Kingdom (Felixstowe)', nameAr: 'المملكة المتحدة', reqCert: 'BRCGS, Sedex' },
    { code: 'ASIA', nameEn: 'East Asia & China', nameAr: 'شرق آسيا والصين', reqCert: 'Phytosanitary, CIQ' },
  ];

  const mandatoryCerts = [
    'ALL',
    'GlobalGAP',
    'ISO 22000',
    'BRC Food',
    'Halal',
    'USDA Organic',
    'Sedex / SMETA',
  ];

  const handleSectorClick = (code: string) => {
    setActiveSector(code);
    setActiveCommodity('ALL');
    onFilterChange({
      sector: code,
      commodity: 'ALL',
      certificate: activeCertificate,
      targetCountry: activeCountry,
    });
  };

  const handleCountryClick = (code: string) => {
    setActiveCountry(code);
    let autoCert = activeCertificate;
    if (code === 'EU') autoCert = 'GlobalGAP';
    if (code === 'GCC') autoCert = 'Halal';
    if (code === 'USA') autoCert = 'USDA Organic';
    setActiveCertificate(autoCert);

    onFilterChange({
      sector: activeSector,
      commodity: activeCommodity,
      certificate: autoCert,
      targetCountry: code,
    });
  };

  const handleCertClick = (cert: string) => {
    setActiveCertificate(cert);
    onFilterChange({
      sector: activeSector,
      commodity: activeCommodity,
      certificate: cert,
      targetCountry: activeCountry,
    });
  };

  return (
    <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-6 mb-10 shadow-sm">
      {/* 4-Level Taxonomy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b452f] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>01 / TAXONOMY & DESTINATION COMPLIANCE</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-[#202522] mt-1">
            {language === 'ar' ? 'التصنيف الهرمي ومطابقة اشتراطات الدول المستوردة' : 'Origin Taxonomy & Market Compliance'}
          </h3>
        </div>

        {/* Visual Level Path */}
        <div className="flex items-center gap-1.5 text-xs text-[#70695f] font-mono overflow-x-auto no-scrollbar">
          <span className={`px-2 py-0.5 border ${activeSector !== 'ALL' ? 'bg-[#9b452f] text-white border-[#9b452f] font-bold' : 'border-[#b9aa95] bg-[#eee8dc]'}`}>
            L1: Sector
          </span>
          <Chevron className="w-3 h-3 text-[#70695f]" />
          <span className={`px-2 py-0.5 border ${activeCountry !== 'ALL' ? 'bg-[#596348] text-white border-[#596348] font-bold' : 'border-[#b9aa95] bg-[#eee8dc]'}`}>
            L2: Market
          </span>
          <Chevron className="w-3 h-3 text-[#70695f]" />
          <span className={`px-2 py-0.5 border ${activeCertificate !== 'ALL' ? 'bg-[#202522] text-[#eee8dc] border-[#202522] font-bold' : 'border-[#b9aa95] bg-[#eee8dc]'}`}>
            L3: Cert
          </span>
          <Chevron className="w-3 h-3 text-[#70695f]" />
          <span className="text-[#202522] font-bold">L4: Exporters</span>
        </div>
      </div>

      {/* Level 1: Sectors */}
      <div>
        <label className="block text-[10px] font-bold text-[#70695f] uppercase tracking-[0.2em] mb-2">
          {language === 'ar' ? 'المستوى 1: القطاع التصديري الرئيسي' : 'Level 1: Main Export Sector'}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => handleSectorClick('ALL')}
            className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all border ${
              activeSector === 'ALL'
                ? 'bg-[#202522] text-[#eee8dc] border-[#202522]'
                : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#202522]'
            }`}
          >
            {language === 'ar' ? 'جميع القطاعات' : 'All Sectors'}
          </button>
          {fallbackCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSectorClick(cat.code || '')}
              className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all border ${
                activeSector === cat.code
                  ? 'bg-[#202522] text-[#eee8dc] border-[#202522]'
                  : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#202522]'
              }`}
            >
              {language === 'ar' ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Level 2 & 3: Target Country & Mandated Accreditation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Destination Country / Market */}
        <div>
          <label className="block text-[10px] font-bold text-[#70695f] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#596348]" />
            <span>{language === 'ar' ? 'المستوى 2: سوق الوصول المستهدف' : 'Level 2: Destination Port / Market'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {destinationCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => handleCountryClick(c.code)}
                className={`p-2.5 text-xs text-left transition-all border ${
                  activeCountry === c.code
                    ? 'bg-[#596348] text-white border-[#596348] shadow-sm'
                    : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#596348]'
                }`}
              >
                <div className="font-bold truncate">{language === 'ar' ? c.nameAr : c.nameEn}</div>
                {c.reqCert && (
                  <div className={`text-[10px] mt-0.5 font-mono ${activeCountry === c.code ? 'text-[#eee8dc]' : 'text-[#70695f]'}`}>
                    Req: {c.reqCert}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Level 3: Mandatory Certification */}
        <div>
          <label className="block text-[10px] font-bold text-[#70695f] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#9b452f]" />
            <span>{language === 'ar' ? 'المستوى 3: شهادة الجودة الإلزامية' : 'Level 3: Mandatory Quality Accreditation'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {mandatoryCerts.map((cert) => (
              <button
                key={cert}
                onClick={() => handleCertClick(cert)}
                className={`px-3 py-1.5 text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  activeCertificate === cert
                    ? 'bg-[#9b452f] border-[#9b452f] text-white shadow-sm'
                    : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#9b452f]'
                }`}
              >
                {activeCertificate === cert && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{cert === 'ALL' ? (language === 'ar' ? 'أي شهادة جودة' : 'Any Certification') : cert}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

