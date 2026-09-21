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
  Award
} from 'lucide-react';

export default function DashboardPortalPage() {
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-goldBorder text-brand-gold text-xs font-bold">
          <Settings className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بوابة إدارة العمليات والتحكم' : 'Operational Command Portal'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {language === 'ar' ? 'لوحة تحكم OpenMarket365' : 'OpenMarket365 Dashboards'}
        </h1>
        <p className="text-xs sm:text-sm text-brand-dim">
          {language === 'ar' 
            ? 'اختر لوحة التحكم الملائمة لدورك لمتابعة السجلات، وتراخيص التصدير، والمناقصات، والتحقق الحكومي.'
            : 'Select your operational control desk to manage company showroom, subscriptions, RFQs, or platform governance.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exporter Operations Console */}
        <Link
          href="/dashboard/exporter"
          className="glass-panel-gold rounded-3xl p-8 hover:border-brand-gold transition-all duration-300 group flex flex-col justify-between shadow-card"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-navy p-3 border border-brand-gold flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-emeraldDark text-brand-emeraldLight border border-brand-emeraldLight/30">
                  EXPORTER PORTAL
                </span>
                <span className="text-xs text-brand-dim">Role: Exporter</span>
              </div>
              <h2 className="text-xl font-extrabold text-white group-hover:text-brand-gold transition-colors">
                {language === 'ar' ? 'لوحة تحكم المصدر' : 'Exporter Control Desk'}
              </h2>
              <p className="text-xs text-brand-dim mt-2 leading-relaxed">
                {language === 'ar' 
                  ? 'إدارة المنتجات، متابعة حصص الباقة والوسائط، الاستجابة لمناقصات المشترين الدوليين، وتحديث وثائق السجل التجاري.'
                  : 'Manage showroom catalog, monitor storage and video quotas, submit sealed bids to buyer RFQs, and manage subscriptions.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-brand-muted">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <Package className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Commodity Catalog</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-brand-emeraldLight" />
                <span>Buyer Inquiries</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <Award className="w-3.5 h-3.5 text-brand-gold" />
                <span>Certificate Vault</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                <span>Tier Quota Meters</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-brand-gold">
            <span>{language === 'ar' ? 'الدخول إلى لوحة المصدر' : 'Access Exporter Workspace'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Admin Governance & Compliance Console */}
        <Link
          href="/dashboard/admin"
          className="glass-panel rounded-3xl p-8 hover:border-brand-emeraldLight transition-all duration-300 group flex flex-col justify-between shadow-card"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-navy p-3 border border-brand-emeraldLight/60 flex items-center justify-center text-brand-emeraldLight group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                  GOVERNANCE & AUDIT
                </span>
                <span className="text-xs text-brand-dim">Role: Platform Admin</span>
              </div>
              <h2 className="text-xl font-extrabold text-white group-hover:text-brand-emeraldLight transition-colors">
                {language === 'ar' ? 'لوحة التدقيق والرقابة الإدارية' : 'Admin Audit & Compliance'}
              </h2>
              <p className="text-xs text-brand-dim mt-2 leading-relaxed">
                {language === 'ar' 
                  ? 'مراجعة واعتماد السجلات التجارية، فحص شهادات المطابقة الدولية، ومطابقة التحويلات البنكية وكود فوري لتفعيل الاشتراكات.'
                  : 'Verify commercial registration (CR) documents, validate international certificates, and audit offline bank wire / Fawry subscription payments.'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-brand-muted">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emeraldLight" />
                <span>CR Verification Queue</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <Award className="w-3.5 h-3.5 text-brand-gold" />
                <span>Certificates Audit</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Wire Approvals</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                <Users className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Role Management</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-brand-emeraldLight">
            <span>{language === 'ar' ? 'الدخول إلى لوحة التدقيق الإداري' : 'Access Admin Console'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
