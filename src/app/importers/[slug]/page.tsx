'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackImporters, fallbackRfqs } from '@/lib/data/fallbackData';
import {
  ShieldCheck,
  MapPin,
  Award,
  Anchor,
  Package,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Clock,
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ImporterProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const importer = fallbackImporters.find((i) => i.slug === slug) || fallbackImporters[0];
  const importerRfqs = fallbackRfqs.filter((r) => r.requester_id === importer.id);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-[#eee8dc]">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#70695f] uppercase tracking-wider font-semibold">
        <span>BUYER DIRECTORY</span>
        <span>/</span>
        <span className="text-[#202522]">{importer.company_name_en}</span>
      </div>

      {/* Profile Header */}
      <div className="border-b border-[#202522] pb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag tag-olive">VERIFIED INTERNATIONAL BUYER</span>
              <span className="tag tag-amber">{importer.tier} SOURCING PROGRAM</span>
              <span className="tag tag-muted font-mono">
                {importer.country_code} · SINCE {importer.member_since}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#202522] font-normal leading-tight">
              {language === 'ar'
                ? importer.company_name_ar || importer.company_name_en
                : importer.company_name_en}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#565047]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>
                  {importer.country_en} · {importer.hub_port}
                </span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-[#596348]" />
                <span>Prefers {importer.preferred_incoterms}</span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <MaskedContact
              phone={importer.company_phone}
              whatsapp={importer.company_phone}
              email={importer.company_email}
              companyName={importer.company_name_en}
              variant="card"
            />
          </div>
        </div>
      </div>

      {/* Sourcing Specs Matrix matching Exporter showroom */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[#202522]">
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            ANNUAL SOURCING VOLUME
          </div>
          <div className="font-serif text-2xl text-[#202522]">
            {importer.annual_volume_mt.toLocaleString()} MT
          </div>
          <p className="text-xs text-[#565047] mt-1">Year-round contracted programs</p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            ACTIVE RFQS
          </div>
          <div className="font-serif text-2xl text-[#202522]">{importer.active_rfqs} open</div>
          <p className="text-xs text-[#565047] mt-1">Sealed-bid procurement runs</p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            PREFERRED INCOTERM
          </div>
          <div className="font-serif text-2xl text-[#202522]">{importer.preferred_incoterms}</div>
          <p className="text-xs text-[#565047] mt-1">Direct vessel nomination</p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            SOURCING FOCUS
          </div>
          <div className="font-serif text-xl text-[#202522] leading-snug">
            {language === 'ar'
              ? importer.sourcing_focus_ar || importer.sourcing_focus_en
              : importer.sourcing_focus_en}
          </div>
          <p className="text-xs text-[#565047] mt-1">Certified Egyptian origin only</p>
        </div>
      </div>

      {/* Main Content: About & Terms Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h3 className="font-serif text-2xl text-[#202522] font-normal">
              Sourcing profile & operations
            </h3>
            <p className="text-sm text-[#565047] leading-relaxed">
              {language === 'ar' ? importer.about_ar || importer.about_en : importer.about_en}
            </p>
          </div>

          {/* Active RFQs by this buyer */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9b452f]">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Live procurement runs on Market 365</span>
            </div>
            {importerRfqs.length > 0 ? (
              <div className="space-y-3">
                {importerRfqs.map((rfq) => (
                  <div key={rfq.id} className="bg-[#e4dac9] border border-[#b9aa95] p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#202522] text-[#eee8dc]">
                        {rfq.incoterm}
                      </span>
                      <span className="text-xs font-bold text-[#9b452f]">
                        {rfq.required_quantity} {rfq.quantity_unit}
                      </span>
                    </div>
                    <h4 className="font-serif text-xl text-[#202522]">{rfq.destination_port}</h4>
                    <p className="text-xs text-[#565047] mt-1 line-clamp-2">
                      {rfq.technical_specifications}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[#b9aa95]/60 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 font-mono text-[#9b452f]">
                        <Clock className="w-3.5 h-3.5" />
                        {rfq.quote_deadline}
                      </span>
                      <Link
                        href="/rfqs"
                        className="font-bold uppercase tracking-wider text-[#9b452f] hover:underline flex items-center gap-1"
                      >
                        <span>View RFQ</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 text-xs text-[#565047]">
                No live RFQs published in this demo slice — new sealed tenders appear here once the
                buyer posts via the Importer Desk.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Procurement Terms Vault */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#202522] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#9b452f]" />
                <span>Procurement & Compliance Terms</span>
              </span>
              <span className="tag tag-olive">AUDITED</span>
            </div>

            <p className="text-xs text-[#565047]">
              Standard commercial terms this buyer trades under. Final pricing locks only through
              sealed RFQ acceptance with mutual contact unlock.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                `Incoterm: ${importer.preferred_incoterms}`,
                `Payment: ${importer.payment_terms || 'L/C at sight'}`,
                'Docs: Phytosanitary + SGS / Bureau Veritas',
                `Hub: ${importer.hub_port}`,
              ].map((term, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#eee8dc] border border-[#b9aa95]/80 text-xs"
                >
                  <div className="flex items-center gap-2 font-medium text-[#202522]">
                    <ShieldCheck className="w-4 h-4 text-[#596348]" />
                    <span>{term}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#70695f] uppercase">STD 2026</span>
                </div>
              ))}
            </div>

            <Link
              href="/importer/new-rfq"
              className="w-full py-2.5 bg-[#202522] hover:bg-black text-[#eee8dc] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Invite to Quote / Post RFQ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Other buyers strip */}
      <div className="pt-8 border-t border-[#b9aa95] space-y-6">
        <div>
          <div className="kicker mb-1">BUYER INDEX</div>
          <h3 className="font-serif text-3xl text-[#202522]">Other verified buyers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fallbackImporters
            .filter((i) => i.slug !== importer.slug)
            .slice(0, 3)
            .map((other) => (
              <Link
                key={other.id}
                href={`/importers/${other.slug}`}
                className="group bg-[#e4dac9] border border-[#b9aa95] p-5 hover:border-[#9b452f] transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#70695f]">
                  <span>{other.country_code}</span>
                  <span className="tag tag-muted">{other.tier}</span>
                </div>
                <h4 className="font-serif text-xl text-[#202522] group-hover:text-[#9b452f] transition-colors line-clamp-1">
                  {other.company_name_en}
                </h4>
                <p className="text-xs text-[#565047] line-clamp-2">{other.sourcing_focus_en}</p>
                <div className="pt-3 border-t border-[#b9aa95] flex items-center justify-between text-xs">
                  <span className="text-[#70695f]">{other.hub_port}</span>
                  <span className="font-bold uppercase tracking-wider text-[#202522] group-hover:text-[#9b452f]">
                    View Profile →
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
