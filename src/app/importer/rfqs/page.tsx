'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { importerService, ImporterRfqItem } from '@/lib/services/importerService';
import RfqStatusBadge, { ModerationNote, isBroadcast } from '@/components/importer/RfqStatusBadge';
import ScrollReveal from '@/components/admin/ScrollReveal';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import { Plus, Anchor, Scale } from 'lucide-react';

export default function ImporterRfqsPage() {
  const { language } = useLanguage();
  const [rfqs, setRfqs] = useState<ImporterRfqItem[]>([]);

  useEffect(() => {
    importerService.getActiveRfqs().then(setRfqs);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ScrollReveal direction="down" delayMs={0}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
              SOURCING TENDERS
            </span>
            <span className="text-xs text-[#70695f] font-mono">Open Procurement Demands</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#202522]">
            {language === 'ar' ? 'طلبات التوريد والمناقصات النشطة' : 'Active Sourcing RFQs'}
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            {language === 'ar'
              ? 'متابعة طلبات الشراء المطروحة لموردي الحاصلات الزراعية المصريين والعطاءات المستلمة.'
              : 'Manage international procurement requirements published to Egyptian exporters and track incoming sealed bids.'}
          </p>
        </div>

        <Link
          href="/importer/new-rfq"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm rounded-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'طرح طلب توريد جديد' : 'New Sourcing RFQ'}</span>
        </Link>
      </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4">
        {rfqs.map((rfq, idx) => (
          <ScrollReveal key={rfq.id} delayMs={idx * 80} direction="up">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 hover:border-[#202522] transition-all shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#9b452f] bg-[#9b452f]/10 px-2 py-0.5 rounded">
                  {rfq.rfq_number}
                </span>
                <RfqStatusBadge status={rfq.status} />
              </div>
              <div className="text-xs font-mono text-[#70695f]">
                Published {rfq.published_at} • <strong className="text-[#9b452f]">Deadline: {rfq.deadline_date}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6 space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#202522]">
                  {language === 'ar' ? rfq.commodity_ar : rfq.commodity_en}
                </h3>
                <p className="text-xs text-[#565047] font-mono">
                  {rfq.variety} · <AnimatedCounter end={rfq.quantity_mt} /> Metric Tons
                </p>
                <p className="text-xs text-[#70695f]">{rfq.packaging_spec}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {rfq.required_certificates.map((cert, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold px-2 py-0.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-xs"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 space-y-1 text-xs">
                <div className="text-[10px] uppercase font-bold text-[#70695f]">DESTINATION PORT</div>
                <div className="font-bold text-[#202522] flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-[#596348]" />
                  <span>{rfq.target_port}</span>
                </div>
                <div className="text-[11px] font-mono text-[#9b452f]">Terms: {rfq.incoterm_preference}</div>
              </div>

              <div className="md:col-span-3 flex flex-col sm:items-end justify-center gap-2">
                {isBroadcast(rfq) ? (
                  <>
                    <div className="text-center sm:text-right">
                      <span className="text-2xl font-serif font-bold text-[#202522]">
                        <AnimatedCounter end={rfq.bids_count} />
                      </span>
                      <span className="text-xs text-[#70695f] block font-mono">sealed bids submitted</span>
                    </div>

                    <Link
                      href="/importer/quotes"
                      className="px-3.5 py-2 bg-[#202522] hover:bg-[#9b452f] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>View Sealed Quotes</span>
                    </Link>
                  </>
                ) : (
                  <ModerationNote rfq={rfq} />
                )}
              </div>
            </div>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
