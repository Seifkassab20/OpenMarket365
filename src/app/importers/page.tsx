'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackImporters } from '@/lib/data/fallbackData';
import {
  Search,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ImportersDirectoryPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');

  const filteredImporters = fallbackImporters.filter((importer) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      importer.company_name_en.toLowerCase().includes(query) ||
      (importer.company_name_ar && importer.company_name_ar.includes(searchTerm)) ||
      (importer.sourcing_focus_en && importer.sourcing_focus_en.toLowerCase().includes(query)) ||
      (importer.hub_port && importer.hub_port.toLowerCase().includes(query)) ||
      (importer.country_en && importer.country_en.toLowerCase().includes(query));

    const matchesCountry = selectedCountry === 'ALL' || importer.country_code === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const countries = ['ALL', ...Array.from(new Set(fallbackImporters.map((i) => i.country_code)))];
  const countryLabel = (code: string) =>
    code === 'ALL' ? code : fallbackImporters.find((i) => i.country_code === code)?.country_en ?? code;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header matching Exporter Directory */}
      <div className="space-y-3">
        <div className="kicker">
          {language === 'ar' ? 'سجل المستوردين الدولي · الدليل ٠٣' : 'BUYER DIRECTORY · REGISTRY 03'}
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl text-[#202522] leading-tight font-normal">
          {language === 'ar' ? (
            <>
              المشترون <br />
              <span className="italic text-[#9b452f]">وراء كل طلب.</span>
            </>
          ) : (
            <>
              The buyers <br />
              <span className="italic text-[#9b452f]">behind demand.</span>
            </>
          )}
        </h1>
        <p className="text-sm text-[#70695f] max-w-xl leading-relaxed">
          {language === 'ar'
            ? 'فهرس عملي للمستوردين الدوليين المعتمدين وبرامج التوريد السنوية والموانئ المستهدفة لمحادثات التوريد بالجملة.'
            : 'A working index of verified international buyers cleared for wholesale sourcing conversations with Egyptian exporters.'}
        </p>
      </div>

      {/* Search & Filter Bar matching Exporters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 border-t border-[#b9aa95] pt-6">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-[#70695f] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search buyer, commodity, destination port"
              className="w-full pl-10 pr-4 py-3 bg-[#e4dac9] border border-[#b9aa95] text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none px-4 py-3 bg-[#e4dac9] border border-[#b9aa95] text-xs font-bold uppercase tracking-[0.12em] text-[#202522] pr-8 focus:outline-none focus:border-[#9b452f] cursor-pointer"
              >
                <option value="ALL">ALL BUYERS & HUB PORTS</option>
                {countries
                  .filter((c) => c !== 'ALL')
                  .map((code) => (
                    <option key={code} value={code}>
                      {countryLabel(code).toUpperCase()}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#70695f] absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('ALL');
              }}
              className="px-4 py-3 border border-[#202522] bg-transparent hover:bg-[#202522] hover:text-white text-xs font-bold uppercase tracking-[0.14em] transition-colors flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
            </button>
          </div>
        </div>

        {/* Filter Pills matching Exporters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag tag-olive">VERIFIED BUYERS ONLY</span>
            <span className="tag tag-muted">L/C & CAD TERMS</span>
            <span className="tag tag-muted">ROTTERDAM · JEDDAH · HAMBURG</span>
            <span className="tag tag-amber">SEALED RFQ PROTOCOL</span>
          </div>
          <span className="text-[11px] font-mono text-[#70695f]">
            {filteredImporters.length} verified records
          </span>
        </div>
      </div>

      {/* Directory Table matching Exporters */}
      <div className="border-t border-[#202522]">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#70695f] border-b border-[#b9aa95]">
          <div className="col-span-4">BUYER</div>
          <div className="col-span-3">SOURCING FOCUS</div>
          <div className="col-span-2">HUB PORT</div>
          <div className="col-span-1">TIER</div>
          <div className="col-span-2 text-right">ACTIVE RFQS</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#b9aa95]">
          {filteredImporters.map((importer) => (
            <div key={importer.id} className="py-6 group hover:bg-[#e4dac9]/30 transition-colors px-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Buyer Name & Verification */}
                <div className="col-span-4 space-y-1">
                  <Link
                    href={`/importers/${importer.slug}`}
                    className="font-serif text-2xl text-[#202522] group-hover:text-[#9b452f] transition-colors inline-block"
                  >
                    {language === 'ar'
                      ? importer.company_name_ar || importer.company_name_en
                      : importer.company_name_en}
                  </Link>
                  <div className="flex items-center gap-2 text-[11px] text-[#70695f]">
                    <span className="flex items-center gap-1 text-[#596348] font-bold uppercase tracking-wider text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-[#596348]" />
                      <span>{importer.verification_status}</span>
                    </span>
                    <span>·</span>
                    <span className="font-mono">{importer.country_code} · Since {importer.member_since}</span>
                  </div>
                </div>

                {/* Sourcing focus */}
                <div className="col-span-3 text-xs text-[#565047]">
                  {language === 'ar' ? importer.sourcing_focus_ar || importer.sourcing_focus_en : importer.sourcing_focus_en}
                </div>

                {/* Hub port */}
                <div className="col-span-2 flex items-center gap-1.5 text-xs text-[#202522]">
                  <MapPin className="w-3.5 h-3.5 text-[#9b452f] flex-shrink-0" />
                  <span>{importer.hub_port}</span>
                </div>

                {/* Tier */}
                <div className="col-span-1">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase ${
                      importer.tier === 'ELITE'
                        ? 'bg-[#c38b40] text-[#202522]'
                        : 'bg-[#596348] text-[#f4efe5]'
                    }`}
                  >
                    {importer.tier}
                  </span>
                </div>

                {/* Active RFQs & profile link */}
                <div className="col-span-2 flex items-center justify-end gap-2 text-xs">
                  <span className="text-[#565047] font-medium">
                    {importer.active_rfqs} open · {importer.preferred_incoterms}
                  </span>
                  <Link
                    href={`/importers/${importer.slug}`}
                    className="p-1 text-[#202522] hover:text-[#9b452f] transition-colors"
                    title="View Buyer Profile"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Sub-row: Direct Contact Masked Gate matching Exporters */}
              <div className="mt-3 pt-3 border-t border-[#b9aa95]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#70695f]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#70695f]">
                    Direct Contact:
                  </span>
                  <span className="font-mono text-xs text-[#b9aa95]">
                    {importer.company_email
                      ? `${importer.company_email.slice(0, 4)}••••@••••••.com`
                      : 'info••••@••••••.com'}
                  </span>
                  <span className="font-mono text-xs text-[#b9aa95]">
                    {importer.company_phone ? `${importer.company_phone.slice(0, 6)} ••• ••••` : '+•• ••• ••• ••••'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MaskedContact
                    phone={importer.company_phone}
                    whatsapp={importer.company_phone}
                    email={importer.company_email}
                    companyName={importer.company_name_en}
                    variant="inline"
                  />
                  <Link
                    href={`/importers/${importer.slug}`}
                    className="text-xs font-bold text-[#9b452f] hover:underline uppercase tracking-wider"
                  >
                    View Full Profile →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
