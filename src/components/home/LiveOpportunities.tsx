'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackRfqs, fallbackMarketListings } from '@/lib/data/fallbackData';
import { 
  FileSpreadsheet, 
  Flame, 
  MapPin, 
  Clock, 
  Ship, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export default function LiveOpportunities() {
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 border-b border-brand-border/60 bg-brand-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Live Buyer Procurement RFQs */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-emerald/10 border border-brand-emeraldLight/30 text-brand-emeraldLight">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {t('sectionRfqs')}
                  </h3>
                  <p className="text-xs text-brand-dim">
                    {language === 'ar' ? 'عروض أسعار مغلقة بدون عمولات' : 'Sealed Bidding • Direct Importers'}
                  </p>
                </div>
              </div>
              <Link
                href="/rfqs"
                className="text-xs font-semibold text-brand-emeraldLight hover:underline flex items-center gap-1"
              >
                <span>{t('viewAll')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {fallbackRfqs.slice(0, 3).map((rfq) => (
                <div
                  key={rfq.id}
                  className="glass-panel rounded-2xl p-5 hover:border-brand-emeraldLight/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-emeraldDark/80 text-brand-emeraldLight border border-brand-emeraldLight/30">
                          {rfq.incoterm || 'FOB'}
                        </span>
                        <span className="text-xs font-bold text-brand-gold">
                          {rfq.required_quantity} {rfq.quantity_unit}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-emeraldLight transition-colors">
                        {rfq.destination_port}
                      </h4>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] text-brand-muted bg-white/5 px-2 py-1 rounded-md border border-brand-border">
                        <Clock className="w-3 h-3 text-brand-gold" />
                        <span>Deadline: {rfq.delivery_deadline}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-brand-dim line-clamp-2 mb-4 leading-relaxed">
                    {rfq.technical_specifications}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
                    <span className="text-[11px] text-brand-muted">
                      {language === 'ar' ? 'المشتري:' : 'Buyer:'} <strong className="text-white font-medium">{rfq.requester?.company_name}</strong>
                    </span>
                    <Link
                      href={`/rfqs`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald/10 text-brand-emeraldLight hover:bg-brand-emerald hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>{t('submitQuote')}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Distressed Port Cargo & Surplus Desk */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{t('sectionDistressed')}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      URGENT
                    </span>
                  </h3>
                  <p className="text-xs text-brand-dim">
                    {language === 'ar' ? 'بضائع موانئ جاهزة للشحن الفوري بأسعار مخفضة' : 'Immediate Port Terminal Clearance Deals'}
                  </p>
                </div>
              </div>
              <Link
                href="/market"
                className="text-xs font-semibold text-brand-amber hover:underline flex items-center gap-1"
              >
                <span>{t('viewAll')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {fallbackMarketListings.map((deal) => {
                const isDistressed = deal.listing_type === 'DISTRESSED_CARGO';
                return (
                  <div
                    key={deal.listing_id}
                    className="glass-panel-gold rounded-2xl p-5 hover:border-brand-amber transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isDistressed 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                              : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                          }`}>
                            {isDistressed ? 'DISTRESSED CARGO' : 'LOCAL SURPLUS'}
                          </span>
                          <span className="text-xs font-semibold text-brand-muted">
                            {deal.quantity} {deal.quantity_unit}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-amber transition-colors line-clamp-1">
                          {deal.title}
                        </h4>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-extrabold text-brand-gold">
                          ${deal.price} <span className="text-xs font-normal text-brand-dim">/ MT</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-brand-dim line-clamp-2 mb-4 leading-relaxed">
                      {deal.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-brand-border/60 text-xs">
                      <div className="flex items-center gap-1.5 text-brand-muted text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{deal.location}</span>
                      </div>

                      <a
                        href={`https://wa.me/201008920110?text=${encodeURIComponent(`Inquiry about ${deal.title} on OpenMarket365`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t('directWhatsApp')}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
