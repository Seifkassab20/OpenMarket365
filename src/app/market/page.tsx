'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackMarketListings } from '@/lib/data/fallbackData';
import { ListingType } from '@/lib/types/database.types';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  Plus,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function MarketBoardPage() {
  const { language, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<ListingType | 'ALL'>('ALL');

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const filteredDeals = fallbackMarketListings.filter((deal) => {
    if (activeTab === 'ALL') return true;
    return deal.listing_type === activeTab;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#b9aa95] mb-8">
        <div>
          <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2">
            {language === 'ar' ? 'البورصة الفورية للبضائع' : '03 / SECONDARY & CLEARANCE'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#202522] tracking-tight">
            {language === 'ar' ? 'بورصة البضائع الفورية.' : 'Market boards.'}
          </h1>
          <p className="text-sm text-[#70695f] mt-3 max-w-2xl leading-relaxed">
            {language === 'ar' 
              ? 'فرص شراء وتخليص فورية للبضائع المحتجزة بالموانئ والشحنات الفائضة بموانئ الإسكندرية ودمياط وبورسعيد مع فحص SGS وبوليصة الشحن.'
              : 'Spot cargo, port terminal liquidation, and packhouse surplus across Egypt\'s 18 maritime and dry ports with SGS inspection and Bill of Lading verification.'
            }
          </p>
        </div>

        <button className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة عرض بضاعة' : 'Post a Listing'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[#b9aa95] pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 text-xs font-bold transition-all border ${
            activeTab === 'ALL'
              ? 'bg-[#202522] text-[#eee8dc] border-[#202522]'
              : 'bg-[#e4dac9] border-[#b9aa95] text-[#565047] hover:border-[#202522]'
          }`}
        >
          {language === 'ar' ? 'جميع العروض الفورية' : 'All Listings'}
        </button>

        <button
          onClick={() => setActiveTab('DISTRESSED_CARGO')}
          className={`px-4 py-2 text-xs font-bold transition-all border flex items-center gap-1.5 ${
            activeTab === 'DISTRESSED_CARGO'
              ? 'bg-[#9b452f] text-white border-[#9b452f]'
              : 'bg-[#e4dac9] border-[#b9aa95] text-[#565047] hover:border-[#9b452f]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بضائع موانئ متعثرة (Distressed)' : 'Distressed Cargo'}</span>
        </button>

        <button
          onClick={() => setActiveTab('LOCAL_SUPPLIER')}
          className={`px-4 py-2 text-xs font-bold transition-all border ${
            activeTab === 'LOCAL_SUPPLIER'
              ? 'bg-[#596348] text-white border-[#596348]'
              : 'bg-[#e4dac9] border-[#b9aa95] text-[#565047] hover:border-[#596348]'
          }`}
        >
          {language === 'ar' ? 'فائض محطات التعبئة (Local Market)' : 'Local Market / Surplus'}
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDeals.map((deal) => {
          const isDistressed = deal.listing_type === 'DISTRESSED_CARGO';
          return (
            <div
              key={deal.listing_id}
              className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="relative h-60 bg-[#202522] overflow-hidden">
                {deal.image_url && (
                  <img
                    src={deal.image_url}
                    alt={deal.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#202522] via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    isDistressed 
                      ? 'bg-[#9b452f] text-white border-[#9b452f]' 
                      : 'bg-[#596348] text-[#eee8dc] border-[#596348]'
                  }`}>
                    {isDistressed ? 'DISTRESSED CARGO' : 'LOCAL SURPLUS'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#eee8dc] bg-[#202522]/90 px-3 py-1.5 border border-[#b9aa95]/40 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c38b40]" />
                    <span>{deal.location}</span>
                  </div>
                  <strong className="text-[#eee8dc] font-mono font-bold">
                    {deal.quantity} {deal.quantity_unit}
                  </strong>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-[#202522] group-hover:text-[#9b452f] transition-colors mb-2">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-[#565047] leading-relaxed mb-6">
                    {deal.description}
                  </p>

                  {/* Audit Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs p-3.5 bg-[#eee8dc] border border-[#b9aa95] mb-6">
                    <div>
                      <span className="text-[#70695f] text-[10px] block uppercase font-bold tracking-wider">Inspection Agency</span>
                      <strong className="text-[#202522] flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#596348]" />
                        <span>{deal.inspection_company || 'SGS Inspected'}</span>
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#70695f] text-[10px] block uppercase font-bold tracking-wider">Bill of Lading</span>
                      <strong className="text-[#9b452f] font-mono truncate block mt-0.5">
                        {deal.bill_of_lading_number || 'Issued on BL'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#b9aa95] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#70695f] uppercase tracking-wider block font-bold">Clearance Price</span>
                    <div className="text-2xl font-serif font-bold text-[#202522]">
                      ${deal.price} <span className="text-xs font-sans font-normal text-[#70695f]">/ MT</span>
                    </div>
                  </div>

                  <MaskedContact
                    phone={deal.seller_contact_phone}
                    whatsapp={deal.seller_contact_phone}
                    email={deal.seller_contact_email}
                    companyName={deal.title}
                    variant="button"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

