'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  Building2, 
  ShieldCheck, 
  Package, 
  CreditCard, 
  FileSpreadsheet, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  Users,
  Award,
  Ship,
  Scale,
  Container
} from 'lucide-react';

export default function DashboardPortalPage() {
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e4dac9] border border-[#b9aa95] text-[#596348] text-[11px] font-bold tracking-widest uppercase font-mono">
          <Settings className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بوابة إدارة العمليات والتحكم' : '05 / OPERATOR SEAT • COMMAND PORTAL'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#202522] tracking-tight">
          {language === 'ar' ? 'لوحة تحكم OpenMarket365' : 'OpenMarket365 Operational Desks'}
        </h1>
        <p className="text-xs sm:text-sm text-[#202522]/70 max-w-xl mx-auto leading-relaxed">
          {language === 'ar' 
            ? 'اختر لوحة التحكم الملائمة لدورك لمتابعة السجلات، وتراخيص التصدير، والمناقصات، والتحقق الحكومي.'
            : 'Select your operational control desk to manage company showroom, subscriptions, RFQs, or platform governance.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Exporter Operations Console */}
        <Link
          href="/dashboard/exporter"
          className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 sm:p-8 hover:border-[#202522] transition-all duration-300 group flex flex-col justify-between shadow-sm"
        >
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-lg bg-[#202522] flex items-center justify-center text-[#eee8dc] group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag-olive">
                  EXPORTER CONSOLE
                </span>
                <span className="text-[11px] text-[#202522]/60 font-mono">Verified Exporter</span>
              </div>
              <h2 className="text-2xl font-serif text-[#202522] group-hover:text-[#596348] transition-colors">
                {language === 'ar' ? 'لوحة تحكم المصدر' : 'Exporter Workspace'}
              </h2>
              <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
                {language === 'ar' 
                  ? 'إدارة المنتجات، متابعة حصص الباقة والوسائط، الاستجابة لمناقصات المشترين الدوليين، وتحديث وثائق السجل التجاري.'
                  : 'Manage showroom catalog, monitor storage and video quotas, submit sealed bids to buyer RFQs, and manage memberships.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#202522]/80 font-mono">
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Package className="w-3.5 h-3.5 text-[#596348]" />
                <span>Commodities</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>Buyer Leads</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Award className="w-3.5 h-3.5 text-[#c38b40]" />
                <span>Cert Vault</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <CreditCard className="w-3.5 h-3.5 text-[#596348]" />
                <span>Quota Meters</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#b9aa95]/50 flex items-center justify-between text-xs font-bold text-[#202522] group-hover:text-[#596348] uppercase tracking-wider font-mono">
            <span>{language === 'ar' ? 'الدخول إلى لوحة المصدر' : 'Open Exporter Desk'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. Global Importer Operations Console */}
        <Link
          href="/dashboard/importer"
          className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 sm:p-8 hover:border-[#596348] transition-all duration-300 group flex flex-col justify-between shadow-sm"
        >
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-lg bg-[#596348] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Ship className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
                  IMPORTER DESK
                </span>
                <span className="text-[11px] text-[#202522]/60 font-mono">Verified Global Buyer</span>
              </div>
              <h2 className="text-2xl font-serif text-[#202522] group-hover:text-[#596348] transition-colors">
                {language === 'ar' ? 'لوحة تحكم المستورد الدولي' : 'Importer Workspace'}
              </h2>
              <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
                {language === 'ar'
                  ? 'طرح طلبات الشراء RFQ، مقارنة العروض الرسمية المغلقة، والتواصل المباشر مع المصدرين.'
                  : 'Publish international RFQs, compare sealed exporter quotations side-by-side, and unlock direct contacts.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#202522]/80 font-mono">
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>Active RFQs</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Scale className="w-3.5 h-3.5 text-[#596348]" />
                <span>Quotes Matrix</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Building2 className="w-3.5 h-3.5 text-[#c38b40]" />
                <span>Packhouses</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Container className="w-3.5 h-3.5 text-[#202522]" />
                <span>Reefer Fleet</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#b9aa95]/50 flex items-center justify-between text-xs font-bold text-[#202522] group-hover:text-[#596348] uppercase tracking-wider font-mono">
            <span>{language === 'ar' ? 'الدخول إلى لوحة المستورد' : 'Open Importer Desk'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3. Admin Governance & Compliance Console */}
        <Link
          href="/admin"
          className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 sm:p-8 hover:border-[#202522] transition-all duration-300 group flex flex-col justify-between shadow-sm"
        >
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-lg bg-[#9b452f] flex items-center justify-center text-[#eee8dc] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag-rust">
                  AUDIT & GOVERNANCE
                </span>
                <span className="text-[11px] text-[#202522]/60 font-mono">National Authority</span>
              </div>
              <h2 className="text-2xl font-serif text-[#202522] group-hover:text-[#9b452f] transition-colors">
                {language === 'ar' ? 'لوحة التدقيق والرقابة الإدارية' : 'National Audit Console'}
              </h2>
              <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
                {language === 'ar' 
                  ? 'مراجعة واعتماد السجلات التجارية، فحص شهادات المطابقة الدولية، ومطابقة التحويلات البنكية وكود فوري لتفعيل الاشتراكات.'
                  : 'Verify commercial registration (CR) documents, validate international certificates, and audit offline bank wire / Fawry payments.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#202522]/80 font-mono">
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#596348]" />
                <span>CR Queue</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Award className="w-3.5 h-3.5 text-[#c38b40]" />
                <span>Cert Audits</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <CreditCard className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>Wire Approvals</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/40">
                <Users className="w-3.5 h-3.5 text-[#202522]" />
                <span>Role Desk</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#b9aa95]/50 flex items-center justify-between text-xs font-bold text-[#202522] group-hover:text-[#9b452f] uppercase tracking-wider font-mono">
            <span>{language === 'ar' ? 'الدخول إلى لوحة التدقيق الإداري' : 'Open Governance Desk'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
