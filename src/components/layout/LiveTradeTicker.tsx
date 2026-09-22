'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { TrendingUp, ShieldCheck, Flame, Globe2 } from 'lucide-react';

export default function LiveTradeTicker() {
  const { language, t } = useLanguage();

  return (
    <div className="bg-[#e4dac9] border-b border-[#b9aa95] py-1.5 px-4 text-xs overflow-hidden relative z-50 text-[#202522]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#9b452f] animate-pulse"></span>
          <span className="font-bold tracking-[0.18em] text-[#9b452f] uppercase text-[9px]">
            {language === 'ar' ? 'البث التجاري المباشر' : 'LIVE TRADE INDEX'}
          </span>
        </div>

        {/* Marquee ticker content */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-xs text-[#565047]">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 bg-[#596348] rounded-full"></span>
            <span>{language === 'ar' ? 'موسم تصدير البرتقال الفالنسيا مفتوح بكافة الموانئ' : 'Valencia Citrus Season Active · 2,480+ Verified Exporters'}</span>
          </div>

          <span className="text-[#b9aa95]">/</span>

          <div className="flex items-center gap-1.5 font-medium text-[#9b452f]">
            <span>{language === 'ar' ? 'مناقصات فورية: روتردام، هامبورغ، جدة' : 'Immediate Buyer RFQs: Rotterdam, Hamburg, Jeddah'}</span>
          </div>

          <span className="text-[#b9aa95]">/</span>

          <div className="flex items-center gap-1.5 font-medium">
            <span>{language === 'ar' ? 'ميناء الإسكندرية ودمياط: حركة الشحن منتظمة' : 'Ports Operating: Alexandria, Damietta, Sokhna'}</span>
          </div>

          <span className="text-[#b9aa95]">/</span>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#70695f]">
            <span>USD/EGP ~48.60</span>
            <span className="text-[#b9aa95]">|</span>
            <span>EUR/EGP ~52.80</span>
          </div>
        </div>

        {/* Right Status */}
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#70695f] font-semibold flex-shrink-0">
          <span>0% BROKERAGE MARKUP</span>
        </div>
      </div>
    </div>
  );
}
