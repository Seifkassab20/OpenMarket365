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
    // Auto-align certificate if specific country selected
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
    <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6 mb-10 border border-brand-goldBorder/40">
      {/* 4-Level Taxonomy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>FR-CAT-001 • 4-LEVEL STRUCTURED TAXONOMY</span>
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            {language === 'ar' ? 'التصنيف الهرمي ومطابقة اشتراطات الدول المستوردة' : 'Hierarchical Taxonomy & Destination Market Compliance'}
          </h3>
        </div>

        {/* Visual Level Path */}
        <div className="flex items-center gap-1.5 text-xs text-brand-dim font-mono overflow-x-auto no-scrollbar">
          <span className={`px-2 py-0.5 rounded ${activeSector !== 'ALL' ? 'bg-brand-gold/20 text-brand-gold font-bold' : ''}`}>
            L1: Sector
          </span>
          <Chevron className="w-3 h-3 text-brand-dim" />
          <span className={`px-2 py-0.5 rounded ${activeCountry !== 'ALL' ? 'bg-brand-cyan/20 text-brand-cyan font-bold' : ''}`}>
            L2: Market
          </span>
          <Chevron className="w-3 h-3 text-brand-dim" />
          <span className={`px-2 py-0.5 rounded ${activeCertificate !== 'ALL' ? 'bg-brand-emerald/20 text-brand-emeraldLight font-bold' : ''}`}>
            L3: Cert
          </span>
          <Chevron className="w-3 h-3 text-brand-dim" />
          <span className="text-white font-bold">L4: Exporters</span>
        </div>
      </div>

      {/* Level 1: Sectors */}
      <div>
        <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
          {language === 'ar' ? 'المستوى 1: القطاع التصديري الرئيسي' : 'Level 1: Main Export Sector'}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => handleSectorClick('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSector === 'ALL'
                ? 'bg-brand-gold text-brand-dark shadow-sm'
                : 'bg-white/5 border border-brand-border text-brand-muted hover:text-white'
            }`}
          >
            {language === 'ar' ? 'جميع القطاعات' : 'All Sectors'}
          </button>
          {fallbackCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSectorClick(cat.code || '')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSector === cat.code
                  ? 'bg-brand-gold text-brand-dark shadow-sm'
                  : 'bg-white/5 border border-brand-border text-brand-muted hover:text-white'
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
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{language === 'ar' ? 'المستوى 2: سوق الوصول المستهدف' : 'Level 2: Destination Port / Market'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {destinationCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => handleCountryClick(c.code)}
                className={`p-2.5 rounded-xl text-xs text-left transition-all border ${
                  activeCountry === c.code
                    ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-sm'
                    : 'bg-white/5 border-brand-border text-brand-muted hover:text-white'
                }`}
              >
                <div className="font-bold truncate">{language === 'ar' ? c.nameAr : c.nameEn}</div>
                {c.reqCert && (
                  <div className="text-[10px] text-brand-cyan mt-0.5 font-mono">Req: {c.reqCert}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Level 3: Mandatory Certification */}
        <div>
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-brand-emeraldLight" />
            <span>{language === 'ar' ? 'المستوى 3: شهادة الجودة الإلزامية' : 'Level 3: Mandatory Quality Accreditation'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {mandatoryCerts.map((cert) => (
              <button
                key={cert}
                onClick={() => handleCertClick(cert)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  activeCertificate === cert
                    ? 'bg-brand-emeraldDark border-brand-emeraldLight text-brand-emeraldLight shadow-emerald'
                    : 'bg-white/5 border-brand-border text-brand-muted hover:text-white'
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
