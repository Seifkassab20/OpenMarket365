'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  FileSpreadsheet, 
  Sparkles,
  TrendingUp,
  Globe2,
  CheckCircle2
} from 'lucide-react';

export default function Hero() {
  const { language, direction, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const quickPills = [
    { labelEn: 'Valencia Oranges', labelAr: 'برتقال فالنسيا', query: 'oranges' },
    { labelEn: 'Frozen Strawberries (IQF)', labelAr: 'فراولة مجمدة', query: 'strawberries' },
    { labelEn: 'Golden Onions', labelAr: 'بصل ذهبي', query: 'onions' },
    { labelEn: 'Organic Chamomile', labelAr: 'بابونج عضوي', query: 'chamomile' },
    { labelEn: 'Extra Virgin Olive Oil', labelAr: 'زيت زيتون بكر', query: 'olive oil' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-brand-border/60">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-radial-glow pointer-events-none blur-3xl opacity-50"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-radial-emerald pointer-events-none blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Announcement Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-goldBorder/60 bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-wide animate-fade-in shadow-gold">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin" />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            {language === 'ar' ? (
              <>
                بوابة الصادرات المصرية المعتمدة <br />
                <span className="text-gold-gradient">نحو كبرى الأسواق العالمية</span>
              </>
            ) : (
              <>
                Egypt’s Verified Export Showcase <br />
                <span className="text-gold-gradient">To High-Volume Global Buyers</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar Container */}
          <div className="pt-2 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative glass-panel-gold rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 items-center shadow-2xl">
              <div className="flex items-center gap-3 px-3 w-full sm:w-auto sm:flex-grow">
                <Search className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('heroSearchPlaceholder')}
                  className="w-full bg-transparent border-none text-white placeholder-brand-dim text-sm sm:text-base focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark hover:brightness-110 active:scale-98 transition-all shadow-gold flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>{t('heroSearchButton')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Search Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-brand-muted">
              <span className="text-brand-dim font-medium">{language === 'ar' ? 'الأكثر بحثاً:' : 'Trending Crops:'}</span>
              {quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(`/products?search=${encodeURIComponent(pill.query)}`)}
                  className="px-2.5 py-1 rounded-lg border border-brand-border bg-white/5 hover:border-brand-gold/50 hover:text-white hover:bg-brand-gold/10 transition-all text-[11px]"
                >
                  {language === 'ar' ? pill.labelAr : pill.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rfqs/create"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-emerald hover:bg-brand-emeraldLight text-white transition-all shadow-emerald flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('heroPostRfqCta')}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>

            <Link
              href="/exporters"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm border border-brand-goldBorder text-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{t('heroVerifiedShowroomCta')}</span>
            </Link>
          </div>
        </div>

        {/* Highlighted B2B Trust Metrics Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel rounded-2xl p-5 text-center border-brand-border/60 hover:border-brand-gold/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">450K+ MT</div>
            <div className="text-xs text-brand-muted mt-1 font-medium">{t('statVolume')}</div>
          </div>

          <div className="glass-panel rounded-2xl p-5 text-center border-brand-border/60 hover:border-brand-gold/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-cyan">65+ Ports</div>
            <div className="text-xs text-brand-muted mt-1 font-medium">{t('statCountries')}</div>
          </div>

          <div className="glass-panel rounded-2xl p-5 text-center border-brand-border/60 hover:border-brand-gold/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-emeraldLight flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-6 h-6 text-brand-emeraldLight" />
              <span>100%</span>
            </div>
            <div className="text-xs text-brand-muted mt-1 font-medium">{t('statInspection')}</div>
          </div>

          <div className="glass-panel rounded-2xl p-5 text-center border-brand-border/60 hover:border-brand-gold/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-gold">0.0% FEE</div>
            <div className="text-xs text-brand-muted mt-1 font-medium">{t('statZeroCommission')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
