'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
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
  LogOut,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  UserCheck,
  Eye,
  Ship
} from 'lucide-react';

export default function Navbar() {
  const { language, direction, toggleLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#eee8dc]/95 backdrop-blur-md border-b border-[#b9aa95] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Exact Replit Styling */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#9b452f] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="font-serif">٣٦٥</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-[0.14em] text-[#202522] uppercase">
                  MARKET <span className="text-[#9b452f]">365</span>
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#70695f] font-semibold">
                EGYPT EXPORT GATEWAY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Exact Replit Uppercase Tracking */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link 
              href="/" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'الرئيسية' : 'HOME'}
            </Link>

            <Link 
              href="/exporters" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'دليل المصدرين' : 'DIRECTORY'}
            </Link>

            <Link
              href="/importers"
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'دليل المستوردين' : 'IMPORTERS'}
            </Link>

            <Link 
              href="/products" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'المنتجات' : 'PRODUCTS'}
            </Link>

            <Link 
              href="/market" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'بورصة التوريدات' : 'MARKET BOARDS'}
            </Link>

            <Link 
              href="/rfqs" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'مكتب المستورد' : 'IMPORTER DESK'}
            </Link>

            <Link 
              href="/dashboard/exporter" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#202522] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'مكتب المصدر' : 'EXPORTER DESK'}
            </Link>

            <Link 
              href="/media" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#70695f] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'الإعلام' : 'MEDIA'}
            </Link>

            <Link 
              href="/dashboard/admin" 
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#70695f] hover:text-[#9b452f] transition-colors"
            >
              {language === 'ar' ? 'الرقابة' : 'GOVERNANCE'}
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Brand Intro Slideshow Trigger - Direct Page Link */}
            <Link
              href="/welcome"
              className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider text-[#9b452f] hover:text-[#202522] border border-[#b9aa95]/80 hover:border-[#202522] rounded transition-colors flex items-center gap-1.5 uppercase"
              title="Open Brand Story Pages"
            >
              <span className="text-[#c38b40]">✦</span>
              <span>{language === 'ar' ? 'قصة المنصة والأدوار' : 'STORY & ROLES'}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold text-[#202522] hover:text-[#9b452f] transition-colors flex items-center gap-1"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#70695f]" />
              <span>{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Post RFQ Button - Sharp Dark Replit Button */}
            <Link
              href="/rfqs/create"
              className="px-5 py-2.5 bg-[#202522] hover:bg-[#9b452f] text-white text-xs font-bold tracking-[0.12em] uppercase transition-all flex items-center gap-2 shadow-sm"
            >
              <span>{language === 'ar' ? 'طرح طلب توريد' : 'POST AN RFQ'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>

            {/* User Account State */}
            {currentUser.isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#b9aa95]">
                <Link
                  href={
                    currentUser.role === 'ADMIN'
                      ? '/dashboard/admin'
                      : currentUser.role === 'EXPORTER'
                      ? '/dashboard/exporter'
                      : '/rfqs'
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#e4dac9] border border-[#b9aa95] text-[#202522] hover:border-[#9b452f] transition-all"
                >
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-[#596348] text-[#f4efe5]'
                      : currentUser.role === 'EXPORTER'
                      ? 'bg-[#c38b40] text-[#202522]'
                      : 'bg-[#9b452f] text-white'
                  }`}>
                    {currentUser.role}
                  </span>
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title={language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                  className="p-1.5 text-[#70695f] hover:text-[#9b452f] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-bold text-[#70695f] hover:text-[#9b452f] transition-colors uppercase tracking-[0.12em]"
              >
                {language === 'ar' ? 'دخول' : 'SIGN IN'}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-bold text-[#202522]"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#202522] hover:text-[#9b452f]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#b9aa95] bg-[#e4dac9] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            HOME
          </Link>
          <Link
            href="/exporters"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            DIRECTORY
          </Link>
          <Link
            href="/importers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            IMPORTERS
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            PRODUCTS
          </Link>
          <Link
            href="/market"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            MARKET BOARDS
          </Link>
          <Link
            href="/rfqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            IMPORTER DESK
          </Link>
          <Link
            href="/dashboard/exporter"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            EXPORTER DESK
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-[0.14em] uppercase text-[#202522] py-1.5"
          >
            PRICING & TIERS
          </Link>
          <div className="pt-3 border-t border-[#b9aa95] flex flex-col gap-2">
            <Link
              href="/welcome"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 bg-[#e4dac9] border border-[#b9aa95] text-[#9b452f] text-xs font-mono font-bold uppercase tracking-[0.12em]"
            >
              ✦ {language === 'ar' ? 'قصة المنصة والأدوار' : 'STORY & ROLES'}
            </Link>
            <Link
              href="/rfqs/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-[#202522] text-white text-xs font-bold uppercase tracking-[0.12em]"
            >
              POST AN RFQ
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 border border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-[0.12em]"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
