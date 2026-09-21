'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackMarketListings } from '@/lib/data/fallbackData';
import { ListingType } from '@/lib/types/database.types';
import { 
  Flame, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Phone, 
  Building2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function MarketBoardPage() {
  const { language, direction, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ListingType | 'ALL'>('ALL');

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const filteredDeals = fallbackMarketListings.filter((deal) => {
    if (activeTab === 'ALL') return true;
    return deal.listing_type === activeTab;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-amber uppercase tracking-wider mb-2">
          <Flame className="w-4 h-4 animate-pulse" />
          <span>{language === 'ar' ? 'البورصة الفورية للبضائع' : 'Secondary Trade & Emergency Clearance Board'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('sectionDistressed')}
        </h1>
        <p className="text-sm text-brand-muted mt-2 max-w-2xl">
          {language === 'ar' 
            ? 'فرص شراء وتخليص فورية للبضائع المحتجزة بالموانئ والشحنات الفائضة بأسعار تصفية تنافسية مع فحص SGS وبوليصة الشحن.'
            : 'Immediate port terminal liquidation deals, distressed cargo clearance, and farm surplus lots ready for swift re-vessel nomination.'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-brand-border/60 pb-4">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-brand-amber text-brand-dark shadow-sm'
              : 'bg-white/5 text-brand-muted hover:text-white'
          }`}
        >
          {language === 'ar' ? 'جميع العروض الفورية' : 'All Port Deals'}
        </button>

        <button
          onClick={() => setActiveTab('DISTRESSED_CARGO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'DISTRESSED_CARGO'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white/5 text-brand-muted hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بضائع موانئ متعثرة (Distressed)' : 'Distressed Port Cargo'}</span>
        </button>

        <button
          onClick={() => setActiveTab('LOCAL_SUPPLIER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LOCAL_SUPPLIER'
              ? 'bg-brand-cyan text-brand-dark shadow-sm'
              : 'bg-white/5 text-brand-muted hover:text-white'
          }`}
        >
          {language === 'ar' ? 'فائض محطات التعبئة (Surplus)' : 'Packhouse Surplus Lots'}
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDeals.map((deal) => {
          const isDistressed = deal.listing_type === 'DISTRESSED_CARGO';
          return (
            <div
              key={deal.listing_id}
              className="glass-panel-gold rounded-3xl overflow-hidden hover:border-brand-amber transition-all flex flex-col justify-between group shadow-card"
            >
              <div className="relative h-56 bg-brand-navy overflow-hidden">
                {deal.image_url && (
                  <img
                    src={deal.image_url}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/30"></div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase shadow-lg ${
                    isDistressed 
                      ? 'bg-red-600 text-white border border-red-400/40' 
                      : 'bg-brand-cyan text-brand-dark font-bold'
                  }`}>
                    {isDistressed ? 'DISTRESSED CARGO' : 'LOCAL SURPLUS'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-brand-dark/80 px-3 py-1.5 rounded-xl backdrop-blur-md border border-brand-border">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{deal.location}</span>
                  </div>
                  <strong className="text-brand-amber font-mono font-bold">
                    {deal.quantity} {deal.quantity_unit}
                  </strong>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-amber transition-colors mb-2">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-brand-dim leading-relaxed mb-6">
                    {deal.description}
                  </p>

                  {/* Audit Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-white/5 border border-brand-border mb-6">
                    <div>
                      <span className="text-brand-dim text-[10px] block uppercase">Inspection Agency</span>
                      <strong className="text-white flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-emeraldLight" />
                        <span>{deal.inspection_company || 'SGS Inspected'}</span>
                      </strong>
                    </div>

                    <div>
                      <span className="text-brand-dim text-[10px] block uppercase">Bill of Lading</span>
                      <strong className="text-brand-gold font-mono truncate block">
                        {deal.bill_of_lading_number || 'Issued on BL'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-dim uppercase block">Clearance Price</span>
                    <div className="text-2xl font-extrabold text-brand-gold">
                      ${deal.price} <span className="text-xs font-normal text-brand-dim">/ MT</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/201008920110?text=${encodeURIComponent(`Inquiry for ${deal.title} via OpenMarket365`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald flex items-center gap-2 transition-all hover:scale-102"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('directWhatsApp')}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
