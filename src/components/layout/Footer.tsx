'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  const { language } = useLanguage();

  // Exclude Footer from all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#202522] text-[#eee8dc] text-sm pt-16 pb-12 border-t border-[#363e39]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#363e39]">
          {/* Left Column: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-3xl text-white font-normal">
              Market 365
            </h3>
            <p className="text-xs text-[#b9aa95] leading-relaxed max-w-sm">
              {language === 'ar'
                ? 'البوابة الوطنية لمنتجات وتجارة مصر الموثوقة. ربط محطات التعبئة والمصانع المعتمدة بكبرى الأسواق العالمية بدون وسطاء.'
                : 'The national gateway for Egyptian products, producers and trusted trade. Direct access to verified packing stations, cold chains and wholesale routes.'
              }
            </p>
            <p className="font-serif text-lg text-[#c38b40] pt-1">
              بوابة مصر للتجارة العالمية
            </p>
          </div>

          {/* Column 1: Trade with Egypt */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b9aa95]">
              {language === 'ar' ? 'التجارة مع مصر' : 'TRADE WITH EGYPT'}
            </h4>
            <ul className="space-y-2 text-xs text-[#dcd1bf]">
              <li><Link href="/exporters" className="hover:text-white transition-colors">{language === 'ar' ? 'دليل المصدرين' : 'Find exporters'}</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">{language === 'ar' ? 'كتالوج السلع' : 'Commodity index'}</Link></li>
              <li><Link href="/market" className="hover:text-white transition-colors">{language === 'ar' ? 'بورصة البضائع' : 'Market Boards'}</Link></li>
              <li><Link href="/rfqs/create" className="hover:text-white transition-colors">{language === 'ar' ? 'طرح مناقصة' : 'Request a quote'}</Link></li>
            </ul>
          </div>

          {/* Column 2: For Exporters */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b9aa95]">
              {language === 'ar' ? 'للمصدرين' : 'FOR EXPORTERS'}
            </h4>
            <ul className="space-y-2 text-xs text-[#dcd1bf]">
              <li><Link href="/pricing" className="hover:text-white transition-colors">{language === 'ar' ? 'باقات الاشتراك 0% عمولة' : 'List your company'}</Link></li>
              <li><Link href="/dashboard/exporter" className="hover:text-white transition-colors">{language === 'ar' ? 'لوحة تحكم المصنع' : 'Exporter console'}</Link></li>
              <li><Link href="/exporters" className="hover:text-white transition-colors">{language === 'ar' ? 'اعتماد الشهادات' : 'Manage certificates'}</Link></li>
              <li><Link href="/media" className="hover:text-white transition-colors">{language === 'ar' ? 'برنامج هنقدر التلفزيوني' : '"Yes We Can" TV'}</Link></li>
            </ul>
          </div>

          {/* Column 3: Institution & Governance */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b9aa95]">
              {language === 'ar' ? 'المؤسسة والرقابة' : 'INSTITUTION'}
            </h4>
            <ul className="space-y-2 text-xs text-[#dcd1bf]">
              <li><Link href="/admin" className="hover:text-white transition-colors">{language === 'ar' ? 'لوحة التدقيق والرقابة' : 'Audit & Verification'}</Link></li>
              <li><Link href="/media" className="hover:text-white transition-colors">{language === 'ar' ? 'الهيئات والموانئ المصرية' : 'Port authorities'}</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">{language === 'ar' ? 'بوابة الدخول الموحدة' : 'Unified Login'}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{language === 'ar' ? 'التحويل البنكي وفوري' : 'Offline Payment'}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#b9aa95]">
          <div>
            © 2026 Market 365. National Export Gateway. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Alexandria · Damietta · Port Said · Sokhna</span>
            <span className="text-[#9b452f] font-bold">0% Transaction Commission</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
