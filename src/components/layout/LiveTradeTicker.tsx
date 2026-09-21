'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { TrendingUp, ShieldCheck, Flame, Globe2, AlertCircle } from 'lucide-react';

export default function LiveTradeTicker() {
  const { language, t } = useLanguage();

  return (
    <div className="bg-brand-dark/95 border-b border-brand-goldBorder/30 py-2 px-4 text-xs overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
          </span>
          <span className="font-bold tracking-wider text-brand-gold uppercase text-[10px]">
            {t('tickerLive')}
          </span>
        </div>

        {/* Marquee ticker content */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-brand-muted">
          <div className="flex items-center gap-1.5 text-brand-text">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emeraldLight" />
            <span>{t('tickerVerifiedExporters')}</span>
          </div>

          <span className="text-brand-dim">•</span>

          <div className="flex items-center gap-1.5 text-brand-text">
            <TrendingUp className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{t('tickerActiveRfqs')}</span>
          </div>

          <span className="text-brand-dim">•</span>

          <div className="flex items-center gap-1.5 text-brand-amber">
            <Flame className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
            <span>{t('tickerDistressedDeals')}</span>
          </div>

          <span className="text-brand-dim">•</span>

          <div className="flex items-center gap-2 text-brand-muted">
            <Globe2 className="w-3.5 h-3.5 text-brand-gold" />
            <span>USD/EGP: ~48.50</span>
            <span className="text-brand-dim">|</span>
            <span>EUR/EGP: ~52.80</span>
          </div>
        </div>

        {/* Quick status */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-brand-dim flex-shrink-0">
          <span>Official Egyptian Trade Network</span>
        </div>
      </div>
    </div>
  );
}
