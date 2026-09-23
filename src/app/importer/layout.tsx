'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { ToastProvider } from '@/components/admin/ToastNotification';
import ImporterSidebar from '@/components/importer/ImporterSidebar';
import ImporterHeader from '@/components/importer/ImporterHeader';
import { ShieldAlert, LogIn, ArrowLeft, Ship } from 'lucide-react';

export default function ImporterRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, direction } = useLanguage();
  const { currentUser, loginAs } = useAuth();
  const isRtl = direction === 'rtl';

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Authorization Check: Must be IMPORTER or ADMIN
  const isAuthorized = currentUser.role === 'IMPORTER' || currentUser.role === 'ADMIN';

  if (!isAuthorized) {
    return (
      <div
        dir={direction}
        className={`min-h-screen bg-[#eee8dc] flex items-center justify-center p-6 ${
          language === 'ar' ? 'font-arabic' : 'font-sans'
        }`}
      >
        <div className="max-w-md w-full bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#596348]/15 border border-[#596348]/30 flex items-center justify-center mx-auto text-[#596348]">
            <Ship className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#596348] block">
              {language === 'ar' ? 'بوابة المشتريات الدولية للمستوردين' : 'GLOBAL IMPORTER PROCUREMENT CLEARANCE'}
            </span>
            <h2 className="text-2xl font-serif text-[#202522]">
              {language === 'ar' ? 'تصريح دخول المستورد مطلوب' : 'Importer Account Required'}
            </h2>
            <p className="text-xs text-[#70695f] leading-relaxed">
              {language === 'ar'
                ? 'لوحة إدارة طلبات التوريد، فحص عروض الأسعار المغلقة، وتتبع الشحنات مخصصة لشركات الاستيراد وسلاسل السوبرماركت المعتمدة.'
                : 'This procurement desk is reserved for verified international food importers, supermarket chains, and wholesale distributors. Please authenticate with your buyer seat.'}
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => loginAs('IMPORTER')}
              className="w-full py-3 rounded-xl text-xs font-mono font-bold bg-[#596348] hover:bg-[#48503a] text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {language === 'ar'
                  ? 'الدخول كـ (ماركوس ويبر - يوروفريش ألمانيا)'
                  : 'LOGIN AS IMPORTER (MARKUS WEBER)'}
              </span>
            </button>

            <Link
              href="/auth/login"
              className="w-full py-2.5 rounded-xl text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] bg-[#eee8dc] transition-colors flex items-center justify-center gap-2"
            >
              <span>{language === 'ar' ? 'صفحة تسجيل الدخول الموحدة' : 'Unified Login Page'}</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#70695f] hover:text-[#202522] transition-colors pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'العودة للمنصة العامة' : 'Return to Public Marketplace'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div
        dir={direction}
        className={`min-h-screen bg-[#eee8dc] text-[#202522] selection:bg-[#9b452f] selection:text-white antialiased ${
          language === 'ar' ? 'font-arabic' : 'font-sans'
        }`}
      >
        {/* Importer SaaS Sidebar */}
        <ImporterSidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          buyerName={currentUser.companyName || 'EuroFresh Logistics GmbH'}
        />

        {/* Content Canvas */}
        <div
          className={`flex min-h-screen flex-col transition-all duration-300 ${
            isRtl
              ? isCollapsed
                ? 'lg:pr-20 lg:pl-0'
                : 'lg:pr-64 lg:pl-0'
              : isCollapsed
              ? 'lg:pl-20 lg:pr-0'
              : 'lg:pl-64 lg:pr-0'
          }`}
        >
          {/* Top Importer Header */}
          <ImporterHeader
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            buyerName={currentUser.companyName || 'EuroFresh Logistics GmbH'}
            hubLocation="Rotterdam / Hamburg Gateway"
          />

          {/* Main Dynamic View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-[#eee8dc]">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
