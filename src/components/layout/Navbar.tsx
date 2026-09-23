'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  LogOut,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';

const navigation = [
  { href: '/', en: 'Home', ar: 'الرئيسية' },
  { href: '/exporters', en: 'Directory', ar: 'دليل المصدرين' },
  { href: '/importers', en: 'Importers', ar: 'دليل المستوردين' },
  { href: '/products', en: 'Products', ar: 'المنتجات' },
  { href: '/market', en: 'Market boards', ar: 'بورصة التوريدات' },
  { href: '/rfqs', en: 'Importer desk', ar: 'مكتب المستورد' },
  { href: '/dashboard/exporter', en: 'Exporter desk', ar: 'مكتب المصدر' },
  { href: '/media', en: 'Media', ar: 'الإعلام' },
  { href: '/admin', en: 'Governance', ar: 'الرقابة' },
];

const focusStyle = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b452f]';

export default function Navbar() {
  const { language, direction, toggleLanguage } = useLanguage();
  const { currentUser, logout } = useAuth();
  const pathname = usePathname() ?? '';
  const [menuOpen, setMenuOpen] = useState(false);

  // Exclude Navbar from all admin routes so the Admin Dashboard has its own dedicated shell
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;
  const isArabic = language === 'ar';

  const accountHref = currentUser.role === 'ADMIN'
    ? '/admin'
    : currentUser.role === 'EXPORTER'
      ? '/dashboard/exporter'
      : '/rfqs';

  return (
    <header dir={direction} className="sticky top-0 z-40 w-full border-b border-[#b9aa95] bg-[#eee8dc]/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 2xl:px-10">
        <div className="flex h-20 items-center justify-between gap-5">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`flex shrink-0 items-center gap-3 text-[#202522] ${focusStyle}`}
            aria-label={isArabic ? 'ماركت 365 — الرئيسية' : 'Market 365 — home'}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#9b452f] font-serif text-lg font-bold text-white" aria-hidden="true">
              ٣٦٥
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.12em]">
                MARKET <span className="text-[#9b452f]">365</span>
              </span>
              <span className="hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-[#70695f] sm:block">
                EGYPT EXPORT GATEWAY
              </span>
            </span>
          </Link>

          <nav aria-label={isArabic ? 'التنقل الرئيسي' : 'Primary navigation'} className="hidden min-w-0 items-center gap-4 min-[1800px]:flex">
            {navigation.map(({ href, en, ar }) => {
              const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap border-b-2 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${focusStyle} ${
                    active
                      ? 'border-[#9b452f] text-[#9b452f]'
                      : 'border-transparent text-[#202522] hover:text-[#9b452f]'
                  }`}
                >
                  {isArabic ? ar : en}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 min-[1800px]:flex">
            <Link
              href="/welcome"
              className={`inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded border border-[#b9aa95] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b452f] transition-colors hover:border-[#9b452f] ${focusStyle}`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isArabic ? 'قصة المنصة والأدوار' : 'Story & roles'}
            </Link>
            <button
              type="button"
              onClick={toggleLanguage}
              className={`inline-flex h-10 items-center gap-1.5 whitespace-nowrap px-2 text-xs font-semibold text-[#202522] transition-colors hover:text-[#9b452f] ${focusStyle}`}
              aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              {isArabic ? 'EN' : 'عربي'}
            </button>
            <Link
              href="/rfqs/create"
              className={`inline-flex h-10 items-center gap-2 whitespace-nowrap bg-[#202522] px-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#9b452f] ${focusStyle}`}
            >
              {isArabic ? 'طرح طلب توريد' : 'Post an RFQ'}
              <ArrowIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            {currentUser.isLoggedIn ? (
              <div className="flex items-center gap-1 border-s border-[#b9aa95] ps-2">
                <Link href={accountHref} className={`flex items-center gap-1.5 whitespace-nowrap px-2 text-xs font-semibold text-[#202522] hover:text-[#9b452f] ${focusStyle}`}>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-[#596348] text-[#f4efe5]'
                      : currentUser.role === 'EXPORTER'
                        ? 'bg-[#c38b40] text-[#202522]'
                        : 'bg-[#9b452f] text-white'
                  }`}>
                    {currentUser.role}
                  </span>
                  <span className="max-w-36 truncate">{currentUser.name}</span>
                </Link>
                <button type="button" onClick={logout} aria-label={isArabic ? 'تسجيل الخروج' : 'Sign out'} className={`flex h-10 w-10 items-center justify-center text-[#70695f] hover:text-[#9b452f] ${focusStyle}`}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className={`whitespace-nowrap px-1 text-xs font-bold uppercase tracking-[0.08em] text-[#202522] hover:text-[#9b452f] ${focusStyle}`}>
                {isArabic ? 'دخول' : 'Sign in'}
              </Link>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 min-[1800px]:hidden">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`flex h-11 min-w-11 items-center justify-center px-2 text-xs font-bold text-[#202522] ${focusStyle}`}
              aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {isArabic ? 'EN' : 'عربي'}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? (isArabic ? 'إغلاق القائمة' : 'Close menu') : (isArabic ? 'فتح القائمة' : 'Open menu')}
              className={`flex h-11 w-11 items-center justify-center text-[#202522] hover:text-[#9b452f] ${focusStyle}`}
            >
              {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="site-menu"
          aria-label={isArabic ? 'قائمة التنقل' : 'Menu navigation'}
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[#b9aa95] bg-[#eee8dc] px-4 py-4 sm:px-6 min-[1800px]:hidden"
        >
          <div className="mx-auto grid max-w-[1600px] gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {navigation.map(({ href, en, ar }) => {
              const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center border-s-2 px-3 text-xs font-bold uppercase tracking-[0.08em] ${focusStyle} ${
                    active
                      ? 'border-[#9b452f] bg-[#e4dac9] text-[#9b452f]'
                      : 'border-transparent text-[#202522] hover:bg-[#e4dac9]'
                  }`}
                >
                  {isArabic ? ar : en}
                </Link>
              );
            })}
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-11 items-center border-s-2 border-transparent px-3 text-xs font-bold uppercase tracking-[0.08em] text-[#202522] hover:bg-[#e4dac9] ${focusStyle}`}
            >
              {isArabic ? 'الأسعار والباقات' : 'Pricing & tiers'}
            </Link>
          </div>
          <div className="mx-auto mt-4 flex max-w-[1600px] flex-wrap items-center gap-2 border-t border-[#b9aa95] pt-4">
            <Link href="/welcome" onClick={() => setMenuOpen(false)} className={`inline-flex min-h-11 items-center gap-2 border border-[#b9aa95] px-4 text-xs font-bold text-[#9b452f] ${focusStyle}`}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isArabic ? 'قصة المنصة والأدوار' : 'Story & roles'}
            </Link>
            <Link href="/rfqs/create" onClick={() => setMenuOpen(false)} className={`inline-flex min-h-11 items-center bg-[#202522] px-4 text-xs font-bold text-white ${focusStyle}`}>
              {isArabic ? 'طرح طلب توريد' : 'Post an RFQ'}
            </Link>
            {currentUser.isLoggedIn ? (
              <>
                <Link href={accountHref} onClick={() => setMenuOpen(false)} className={`inline-flex min-h-11 items-center px-3 text-xs font-bold text-[#202522] ${focusStyle}`}>
                  {currentUser.name}
                </Link>
                <button type="button" onClick={() => { logout(); setMenuOpen(false); }} className={`inline-flex min-h-11 items-center gap-2 px-3 text-xs font-bold text-[#202522] ${focusStyle}`}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {isArabic ? 'تسجيل الخروج' : 'Sign out'}
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className={`inline-flex min-h-11 items-center px-3 text-xs font-bold text-[#202522] ${focusStyle}`}>
                {isArabic ? 'دخول' : 'Sign in'}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
