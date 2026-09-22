'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies, fallbackProducts, fallbackSubscriptionPlans } from '@/lib/data/fallbackData';
import { 
  Building2, 
  ShieldCheck, 
  Package, 
  HardDrive, 
  Video, 
  Plus, 
  FileSpreadsheet, 
  CreditCard,
  ExternalLink
} from 'lucide-react';

export default function ExporterDashboardPage() {
  const { language } = useLanguage();
  const company = fallbackCompanies[0];
  const products = fallbackProducts.filter((p) => p.company_id === company.id);
  const activePlan = fallbackSubscriptionPlans.find((p) => p.subscription_code === 'PRM') || fallbackSubscriptionPlans[2];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-[#202522] p-1.5 border border-[#b9aa95] flex-shrink-0">
            <img
              src={company.logo_url || ''}
              alt={company.company_name_en}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{language === 'ar' ? 'منشأة معتمدة' : 'Verified Packhouse'}</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#9b452f] text-white">
                {activePlan.name_en}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#202522]">
              {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
            </h1>
            <p className="text-xs text-[#70695f] mt-0.5 font-mono">
              CR: {company.cr_number} • Tax ID: {company.tax_id} • {company.governorate}, Egypt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href={`/exporters/${company.slug}`}
            className="w-full md:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-[#202522] text-[#202522] hover:bg-[#202522] hover:text-[#eee8dc] transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{language === 'ar' ? 'معاينة المعرض العام' : 'View Showroom'}</span>
          </Link>
          <Link
            href="/pricing"
            className="w-full md:w-auto px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span>{language === 'ar' ? 'ترقية الباقة' : 'Manage Tier'}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats & Quotas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Quota */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Catalog Limit</span>
            <Package className="w-4 h-4 text-[#596348]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#202522]">
            {products.length} <span className="text-xs font-sans font-normal text-[#70695f]">/ {activePlan.max_products} limit</span>
          </div>
          <div className="w-full h-1.5 bg-[#eee8dc] border border-[#b9aa95] overflow-hidden">
            <div className="h-full bg-[#596348]" style={{ width: `${(products.length / (activePlan.max_products || 100)) * 100}%` }}></div>
          </div>
        </div>

        {/* Cloud Storage Quota */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Storage Vault</span>
            <HardDrive className="w-4 h-4 text-[#9b452f]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#202522]">
            185 MB <span className="text-xs font-sans font-normal text-[#70695f]">/ {activePlan.max_storage_mb} MB</span>
          </div>
          <div className="w-full h-1.5 bg-[#eee8dc] border border-[#b9aa95] overflow-hidden">
            <div className="h-full bg-[#9b452f]" style={{ width: '18%' }}></div>
          </div>
        </div>

        {/* 4K Video Tour Entitlement */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">4K Packhouse Stream</span>
            <Video className="w-4 h-4 text-[#202522]" />
          </div>
          <div className="text-base font-serif font-bold text-[#596348] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Active & Streaming</span>
          </div>
          <p className="text-[11px] text-[#70695f]">Zero-cost YouTube 4K stream embedded</p>
        </div>

        {/* Active RFQ Inquiries */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Buyer Inquiries</span>
            <FileSpreadsheet className="w-4 h-4 text-[#596348]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#9b452f]">
            3 New
          </div>
          <p className="text-[11px] text-[#70695f]">Rotterdam, Jeddah, Hamburg</p>
        </div>
      </div>

      {/* Published Products Table */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#b9aa95]">
          <div>
            <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-1">
              COMMODITY ROSTER
            </div>
            <h2 className="text-2xl font-serif text-[#202522]">
              {language === 'ar' ? 'المنتجات المسجلة في المعرض' : 'Listed Export Commodities.'}
            </h2>
            <p className="text-xs text-[#70695f] mt-0.5">
              {language === 'ar' ? 'إدارة المواصفات الفنية والأسعار الاسترشادية' : 'Manage published specs, packaging details, and MOQ'}
            </p>
          </div>

          <Link
            href="/products"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة محصول جديد' : 'Add Commodity'}</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#565047]">
            <thead className="bg-[#eee8dc] border-b border-[#b9aa95] text-[#70695f] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">HS Code</th>
                <th className="py-3 px-4">Packaging Spec</th>
                <th className="py-3 px-4">Harvest Window</th>
                <th className="py-3 px-4">Indicative Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/40">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#eee8dc]/50 transition-colors">
                  <td className="py-4 px-4 font-serif text-base text-[#202522] flex items-center gap-3">
                    {prod.images && prod.images[0] && (
                      <img src={prod.images[0]} alt={prod.title_en || ''} className="w-10 h-10 object-cover border border-[#b9aa95]" />
                    )}
                    <span>{prod.title_en}</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-[#9b452f]">HS {prod.hs_code}</td>
                  <td className="py-4 px-4">{prod.packaging_type}</td>
                  <td className="py-4 px-4 font-medium">{prod.harvest_season_from} - {prod.harvest_season_to}</td>
                  <td className="py-4 px-4 font-serif font-bold text-base text-[#202522]">${prod.price} / MT</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white">
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

