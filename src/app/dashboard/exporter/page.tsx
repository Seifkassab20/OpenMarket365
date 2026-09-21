'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies, fallbackProducts, fallbackSubscriptionPlans } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  Package, 
  TrendingUp, 
  HardDrive, 
  Video, 
  Plus, 
  FileSpreadsheet, 
  CreditCard,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function ExporterDashboardPage() {
  const { language, t } = useLanguage();
  const company = fallbackCompanies[0];
  const products = fallbackProducts.filter((p) => p.company_id === company.id);
  const activePlan = fallbackSubscriptionPlans.find((p) => p.subscription_code === 'PRM') || fallbackSubscriptionPlans[2];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-navy p-2 border-2 border-brand-gold shadow-lg flex-shrink-0">
            <img
              src={company.logo_url || ''}
              alt={company.company_name_en}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-emeraldDark text-brand-emeraldLight text-[10px] font-bold border border-brand-emeraldLight/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{language === 'ar' ? 'منشأة معتمدة' : 'Verified Packhouse'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold border border-brand-goldBorder">
                {activePlan.name_en}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
            </h1>
            <p className="text-xs text-brand-dim mt-0.5">
              CR: {company.cr_number} • Tax ID: {company.tax_id} • {company.governorate}, Egypt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href={`/exporters/${company.slug}`}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border border-brand-border text-white hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{language === 'ar' ? 'معاينة المعرض العام' : 'View Public Showroom'}</span>
          </Link>
          <Link
            href="/pricing"
            className="w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-gold"
          >
            <CreditCard className="w-4 h-4" />
            <span>{language === 'ar' ? 'ترقية الباقة' : 'Manage Subscription'}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats & Quotas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Quota */}
        <div className="glass-panel rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Showroom Products</span>
            <Package className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {products.length} <span className="text-xs font-normal text-brand-dim">/ {activePlan.max_products} limit</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-cyan" style={{ width: `${(products.length / (activePlan.max_products || 100)) * 100}%` }}></div>
          </div>
        </div>

        {/* Cloud Storage Quota */}
        <div className="glass-panel rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Storage Utilization</span>
            <HardDrive className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            185 MB <span className="text-xs font-normal text-brand-dim">/ {activePlan.max_storage_mb} MB</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gold" style={{ width: '18%' }}></div>
          </div>
        </div>

        {/* 4K Video Tour Entitlement */}
        <div className="glass-panel rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>4K Video Packhouse Tour</span>
            <Video className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-lg font-extrabold text-brand-emeraldLight flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>Active & Streaming</span>
          </div>
          <p className="text-[11px] text-brand-dim">Zero-cost YouTube 4K stream embedded</p>
        </div>

        {/* Active RFQ Inquiries */}
        <div className="glass-panel rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Matching Buyer RFQs</span>
            <FileSpreadsheet className="w-4 h-4 text-brand-emeraldLight" />
          </div>
          <div className="text-2xl font-extrabold text-brand-emeraldLight">
            3 New
          </div>
          <p className="text-[11px] text-brand-dim">Rotterdam, Jeddah, Hamburg</p>
        </div>
      </div>

      {/* Published Products Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {language === 'ar' ? 'المنتجات المسجلة في المعرض' : 'Listed Export Commodities'}
            </h2>
            <p className="text-xs text-brand-dim mt-0.5">
              {language === 'ar' ? 'إدارة المواصفات الفنية والأسعار الاسترشادية' : 'Manage published specs, packaging details, and MOQ'}
            </p>
          </div>

          <Link
            href="/products"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة محصول جديد' : 'Add New Commodity'}</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-muted">
            <thead className="bg-white/5 border-b border-brand-border text-brand-dim uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">HS Code</th>
                <th className="py-3 px-4">Packaging Spec</th>
                <th className="py-3 px-4">Harvest Window</th>
                <th className="py-3 px-4">Indicative Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                    {prod.images && prod.images[0] && (
                      <img src={prod.images[0]} alt={prod.title_en || ''} className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <span>{prod.title_en}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-brand-gold">HS {prod.hs_code}</td>
                  <td className="py-4 px-4">{prod.packaging_type}</td>
                  <td className="py-4 px-4">{prod.harvest_season_from} - {prod.harvest_season_to}</td>
                  <td className="py-4 px-4 font-extrabold text-white">${prod.price} / MT</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-emerald/10 text-brand-emeraldLight border border-brand-emeraldLight/30">
                      PUBLISHED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
