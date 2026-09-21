'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  Building2, 
  Package, 
  FileSpreadsheet, 
  Flame, 
  Tv, 
  CreditCard, 
  Globe, 
  Menu, 
  X, 
  PlusCircle, 
  LogIn, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function Navbar() {
  const { language, direction, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-border backdrop-blur-xl bg-brand-surface/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-amber via-brand-gold to-brand-goldDark flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform duration-300">
              <span className="font-bold text-brand-dark text-xl tracking-tighter">365</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>OpenMarket</span>
                <span className="text-brand-gold">365</span>
              </span>
              <span className="text-[10px] text-brand-muted tracking-wider uppercase font-medium">
                {t('brandTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link 
              href="/exporters" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-brand-gold" />
              <span>{t('navShowrooms')}</span>
            </Link>

            <Link 
              href="/products" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-brand-cyan" />
              <span>{t('navProducts')}</span>
            </Link>

            <Link 
              href="/rfqs" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-brand-emeraldLight" />
              <span>{t('navRfqs')}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-emeraldDark/60 text-brand-emeraldLight border border-brand-emeraldLight/30">
                LIVE
              </span>
            </Link>

            <Link 
              href="/market" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-brand-amber animate-pulse" />
              <span>{t('navMarket')}</span>
            </Link>

            <Link 
              href="/media" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Tv className="w-4 h-4 text-purple-400" />
              <span>{t('navMedia')}</span>
            </Link>

            <Link 
              href="/pricing" 
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4 text-brand-gold" />
              <span>{t('navPricing')}</span>
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-brand-border bg-white/5 text-xs font-semibold text-brand-text hover:border-brand-gold/50 hover:bg-brand-gold/10 transition-all flex items-center gap-1.5"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Post RFQ Button */}
            <Link
              href="/rfqs/create"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald transition-all flex items-center gap-1.5 hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('navPostRfq')}</span>
            </Link>

            {/* Sign In CTA */}
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-goldBorder bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center gap-1.5 hover:scale-102 active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('navSignIn')}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-md border border-brand-border text-xs font-semibold text-brand-gold"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-muted hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-border bg-brand-surface/98 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/exporters"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text hover:bg-white/5"
          >
            <Building2 className="w-5 h-5 text-brand-gold" />
            <span>{t('navShowrooms')}</span>
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text hover:bg-white/5"
          >
            <Package className="w-5 h-5 text-brand-cyan" />
            <span>{t('navProducts')}</span>
          </Link>
          <Link
            href="/rfqs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text hover:bg-white/5"
          >
            <FileSpreadsheet className="w-5 h-5 text-brand-emeraldLight" />
            <span>{t('navRfqs')}</span>
          </Link>
          <Link
            href="/market"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text hover:bg-white/5"
          >
            <Flame className="w-5 h-5 text-brand-amber" />
            <span>{t('navMarket')}</span>
          </Link>
          <Link
            href="/media"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text hover:bg-white/5"
          >
            <Tv className="w-5 h-5 text-purple-400" />
            <span>{t('navMedia')}</span>
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-text hover:bg-white/5"
          >
            <CreditCard className="w-5 h-5 text-brand-gold" />
            <span>{t('navPricing')}</span>
          </Link>
          
          <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
            <Link
              href="/rfqs/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl font-bold bg-brand-emerald text-white text-sm"
            >
              {t('navPostRfq')}
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl font-bold border border-brand-goldBorder text-brand-gold bg-brand-gold/10 text-sm"
            >
              {t('navSignIn')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
