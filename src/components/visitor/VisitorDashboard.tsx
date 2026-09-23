'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Lock, Search, Eye, Building2, ShoppingBag } from 'lucide-react';
import { fallbackProducts } from '@/lib/data/fallbackData';

export default function VisitorDashboard() {
  const { language, direction } = useLanguage();

  const isAr = language === 'ar';

  return (
    <div className="bg-[#eee8dc] min-h-screen text-[#202522]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#e4dac9] border-b border-[#b9aa95] pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#b9aa95] text-[#9b452f] text-[11px] font-mono font-bold tracking-widest uppercase">
              <Eye className="w-3.5 h-3.5" />
              <span>{isAr ? 'التصفح العام المجاني' : 'PUBLIC ACCESS TIER'}</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl tracking-tight leading-[1.05]">
              {isAr ? 'استكشف دليل المحاصيل المصري' : 'Explore the Egyptian Harvest Directory'}
            </h1>
            
            <p className="text-base sm:text-lg text-[#565047] leading-relaxed max-w-xl">
              {isAr 
                ? 'أنت تتصفح حالياً كزائر عام. يمكنك الاطلاع على بيانات المنتجات ومؤشرات السوق، لكن يتطلب كشف بيانات التواصل والأسعار حساباً معتمداً.' 
                : 'You are currently browsing as a guest. You can view product catalogs and market indicators, but full contact details and sealed-bid prices require a verified account.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Read Only Catalog */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#202522]">
              <h2 className="font-serif text-3xl">
                {isAr ? 'أحدث المنتجات المدرجة' : 'Recently Listed Commodities'}
              </h2>
              <Link href="/products" className="text-xs font-mono font-bold uppercase hover:text-[#9b452f] transition-colors flex items-center gap-2">
                <span>{isAr ? 'عرض الكل' : 'VIEW ALL'}</span>
                <Search className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fallbackProducts.map((product) => (
                <div key={product.id} className="bg-white border border-[#b9aa95] p-5 shadow-sm group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-serif text-xl mb-1 line-clamp-1">
                          {isAr ? product.title_ar : product.title_en}
                        </h3>
                        <div className="text-[10px] font-mono text-[#70695f] uppercase tracking-wider">
                          HS {product.hs_code} • {product.category?.name_en}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#e4dac9] flex items-center justify-center flex-shrink-0">
                        <Lock className="w-3.5 h-3.5 text-[#9b452f]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[#b9aa95]/40 mt-4">
                    <button className="w-full py-2 bg-[#eee8dc] text-[#70695f] text-xs font-mono uppercase tracking-wider flex justify-center items-center gap-2 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      {isAr ? 'بيانات التوريد والسعر مخفية' : 'PRICE & SUPPLIER MASKED'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Upgrade CTAs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#202522] text-[#eee8dc] p-6 shadow-md border border-[#434b36]">
              <div className="w-12 h-12 bg-[#596348] text-white flex items-center justify-center rounded mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl mb-2">
                {isAr ? 'ترقية لحساب مستورد' : 'Upgrade to Importer'}
              </h3>
              <p className="text-sm text-[#eee8dc]/70 mb-6 leading-relaxed">
                {isAr 
                  ? 'سجل كمستورد دولي لفتح عروض الأسعار، وتصفح الشحنات الجاهزة، والتواصل المباشر مع المصانع.' 
                  : 'Register as an international importer to unlock sealed bids, spot clearance cargo, and direct factory communications.'}
              </p>
              <button 
                onClick={() => window.dispatchEvent(new Event('om365_open_intro'))}
                className="w-full py-3 bg-[#596348] hover:bg-[#434b36] text-white text-xs font-mono font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                {isAr ? 'إنشاء حساب مستورد' : 'CREATE BUYER ACCOUNT'}
              </button>
            </div>

            <div className="bg-[#e4dac9] p-6 shadow-sm border border-[#b9aa95]">
              <div className="w-12 h-12 bg-[#c38b40] text-[#202522] flex items-center justify-center rounded mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-[#202522]">
                {isAr ? 'انضم كمصدر معتمد' : 'Join as Exporter'}
              </h3>
              <p className="text-sm text-[#202522]/70 mb-6 leading-relaxed">
                {isAr 
                  ? 'قم بإدراج منتجاتك وتلقي طلبات الشراء المباشرة من مشترين دوليين معتمدين.' 
                  : 'List your harvest and receive direct procurement requests from verified international buyers.'}
              </p>
              <button 
                onClick={() => window.dispatchEvent(new Event('om365_open_intro'))}
                className="w-full py-3 border-2 border-[#202522] hover:bg-[#202522] hover:text-white text-[#202522] text-xs font-mono font-bold uppercase tracking-widest transition-colors"
              >
                {isAr ? 'تسجيل كمصدر' : 'REGISTER AS SUPPLIER'}
              </button>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
