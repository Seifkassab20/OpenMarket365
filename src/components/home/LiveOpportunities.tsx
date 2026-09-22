'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackRfqs, fallbackMarketListings } from '@/lib/data/fallbackData';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LiveOpportunities() {
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-[#eee8dc] border-b border-[#b9aa95]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Live Buyer Procurement RFQs */}
          <div>
            <div className="flex items-end justify-between pb-4 border-b border-[#202522] mb-6">
              <div>
                <div className="kicker mb-1">
                  {language === 'ar' ? 'مناقصات الشراء الدولية' : 'PROCUREMENT FLOW'}
                </div>
                <h3 className="font-serif text-3xl text-[#202522] font-normal">
                  {language === 'ar' ? 'أحدث طلبات التوريد' : 'Live buyer RFQs'}
                </h3>
              </div>
              <Link
                href="/rfqs"
                className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b452f] hover:underline flex items-center gap-1"
              >
                <span>{language === 'ar' ? 'عرض الكل' : 'VIEW ALL'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {fallbackRfqs.slice(0, 3).map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-[#e4dac9] border border-[#b9aa95] p-5 hover:border-[#9b452f] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="tag tag-olive">
                          {rfq.incoterm || 'CIF'}
                        </span>
                        <span className="text-xs font-bold text-[#9b452f]">
                          {rfq.required_quantity} {rfq.quantity_unit}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl text-[#202522]">
                        {rfq.destination_port}
                      </h4>
                    </div>

                    <div className="text-right text-[11px] text-[#70695f] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#9b452f]" />
                      <span>{rfq.delivery_deadline}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#565047] line-clamp-2 mb-4 leading-relaxed">
                    {rfq.technical_specifications}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#b9aa95] text-xs">
                    <span className="text-[11px] text-[#70695f]">
                      Buyer: <strong className="text-[#202522]">{rfq.requester?.company_name}</strong>
                    </span>
                    <Link
                      href={`/rfqs`}
                      className="text-xs font-bold uppercase tracking-[0.12em] text-[#9b452f] hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'تقديم عرض مغلق' : 'SUBMIT QUOTE'}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Distressed Port Cargo & Surplus Lots */}
          <div>
            <div className="flex items-end justify-between pb-4 border-b border-[#202522] mb-6">
              <div>
                <div className="kicker mb-1">
                  {language === 'ar' ? 'بورصة بضائع الموانئ الجاهزة' : 'PORT CLEARANCE'}
                </div>
                <h3 className="font-serif text-3xl text-[#202522] font-normal">
                  {language === 'ar' ? 'لوط بضائع فورية الشحن' : 'Distressed & spot cargo'}
                </h3>
              </div>
              <Link
                href="/market"
                className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b452f] hover:underline flex items-center gap-1"
              >
                <span>{language === 'ar' ? 'عرض البورصة' : 'VIEW BOARDS'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {fallbackMarketListings.slice(0, 3).map((lot) => (
                <div
                  key={lot.listing_id}
                  className="bg-[#e4dac9] border border-[#b9aa95] p-5 hover:border-[#9b452f] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="tag tag-rust">
                          {lot.listing_type === 'DISTRESSED_CARGO' ? 'PORT CLEARANCE' : 'SPOT LOT'}
                        </span>
                        <span className="text-xs font-mono text-[#70695f]">
                          B/L: {lot.bill_of_lading_number}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl text-[#202522]">
                        {lot.title}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-[#9b452f]">
                        ${lot.price} <span className="text-[10px] text-[#70695f] font-normal">/ {lot.quantity_unit}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#565047] line-clamp-2 mb-4 leading-relaxed">
                    {lot.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#b9aa95] text-xs">
                    <span className="text-[11px] text-[#70695f]">
                      Location: <strong className="text-[#202522]">{lot.location}</strong>
                    </span>
                    <Link
                      href={`/market`}
                      className="text-xs font-bold uppercase tracking-[0.12em] text-[#202522] hover:text-[#9b452f] flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'معاينة البضاعة' : 'INSPECT LOT'}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
