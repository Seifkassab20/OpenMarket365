'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies } from '@/lib/data/fallbackData';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ExportersDirectoryPage() {
  const { language, direction, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGov, setSelectedGov] = useState<string>('ALL');

  const filteredCompanies = fallbackCompanies.filter((company) => {
    const matchesSearch = 
      company.company_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.company_name_ar && company.company_name_ar.includes(searchTerm)) ||
      (company.about_en && company.about_en.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGov = selectedGov === 'ALL' || company.governorate === selectedGov;

    return matchesSearch && matchesGov;
  });

  const governorates = ['ALL', 'Al-Beheira', 'Al-Sharkia', 'Beni Suef', 'Alexandria', 'Ismailia'];
  const tierBadges: Record<number, string> = { 0: 'ELITE', 1: 'PREMIUM', 2: 'PLUS', 3: 'STANDARD' };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header matching Replit Directory */}
      <div className="space-y-3">
        <div className="kicker">
          {language === 'ar' ? 'سجل المصدرين الوطني · الدليل ٠٢' : 'EXPORTER DIRECTORY · REGISTRY 02'}
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl text-[#202522] leading-tight font-normal">
          {language === 'ar' ? (
            <>
              الشركات <br />
              <span className="italic text-[#9b452f]">خلف كل منشأ.</span>
            </>
          ) : (
            <>
              The companies <br />
              <span className="italic text-[#9b452f]">behind origin.</span>
            </>
          )}
        </h1>
        <p className="text-sm text-[#70695f] max-w-xl leading-relaxed">
          {language === 'ar'
            ? 'فهرس عملي للشركات ومحطات التعبئة المصرية المعتمدة والمطابقة لمحادثات التوريد بالجملة الدولية.'
            : 'A working index of Egyptian producers cleared for international wholesale conversations.'
          }
        </p>
      </div>

      {/* Search & Filter Bar matching Replit */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-2 border-t border-[#b9aa95] pt-6">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-[#70695f] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company, commodity, destination"
              className="w-full pl-10 pr-4 py-3 bg-[#e4dac9] border border-[#b9aa95] text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="appearance-none px-4 py-3 bg-[#e4dac9] border border-[#b9aa95] text-xs font-bold uppercase tracking-[0.12em] text-[#202522] pr-8 focus:outline-none focus:border-[#9b452f] cursor-pointer"
              >
                <option value="ALL">ALL SECTORS & GOVERNORATES</option>
                {governorates.filter(g => g !== 'ALL').map((gov) => (
                  <option key={gov} value={gov}>{gov.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#70695f] absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            <button
              onClick={() => { setSearchTerm(''); setSelectedGov('ALL'); }}
              className="px-4 py-3 border border-[#202522] bg-transparent hover:bg-[#202522] hover:text-white text-xs font-bold uppercase tracking-[0.14em] transition-colors flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>FILTERS</span>
            </button>
          </div>
        </div>

        {/* Filter Pills matching Replit */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag tag-olive">64 DESTINATIONS</span>
            <span className="tag tag-muted">HACCP & ISO CHECKED</span>
            <span className="tag tag-muted">ALEXANDRIA · DAMIETTA · SUEZ</span>
            <span className="tag tag-amber">AWETA OPTICAL SORTING</span>
          </div>
          <span className="text-[11px] font-mono text-[#70695f]">
            {filteredCompanies.length} verified records
          </span>
        </div>
      </div>

      {/* Directory Table matching Replit */}
      <div className="border-t border-[#202522]">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#70695f] border-b border-[#b9aa95]">
          <div className="col-span-4">COMPANY</div>
          <div className="col-span-3">SPECIALISM</div>
          <div className="col-span-2">ORIGIN</div>
          <div className="col-span-1">TIER</div>
          <div className="col-span-2 text-right">PRIMARY ROUTES</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#b9aa95]">
          {filteredCompanies.map((company, idx) => (
            <div key={company.id} className="py-6 group hover:bg-[#e4dac9]/30 transition-colors px-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Company Name & Verification */}
                <div className="col-span-4 space-y-1">
                  <Link
                    href={`/exporters/${company.slug}`}
                    className="font-serif text-2xl text-[#202522] group-hover:text-[#9b452f] transition-colors inline-block"
                  >
                    {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
                  </Link>
                  <div className="flex items-center gap-2 text-[11px] text-[#70695f]">
                    <span className="flex items-center gap-1 text-[#596348] font-bold uppercase tracking-wider text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-[#596348]" />
                      <span>VERIFIED</span>
                    </span>
                    <span>·</span>
                    <span className="font-mono">Registry {company.cr_number}</span>
                  </div>
                </div>

                {/* Specialism */}
                <div className="col-span-3 text-xs text-[#565047]">
                  {company.about_en?.split('.')[0] || 'Citrus · Dates · IQF Frozen Strawberries'}
                </div>

                {/* Origin */}
                <div className="col-span-2 flex items-center gap-1.5 text-xs text-[#202522]">
                  <MapPin className="w-3.5 h-3.5 text-[#9b452f] flex-shrink-0" />
                  <span>{company.governorate}, Egypt</span>
                </div>

                {/* Tier */}
                <div className="col-span-1">
                  <span className={`px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] uppercase ${
                    idx === 0 ? 'bg-[#c38b40] text-[#202522]' : 'bg-[#596348] text-[#f4efe5]'
                  }`}>
                    {tierBadges[idx] || 'STANDARD'}
                  </span>
                </div>

                {/* Primary Routes & Showroom link */}
                <div className="col-span-2 flex items-center justify-end gap-2 text-xs">
                  <span className="text-[#565047] font-medium">EU / GCC / NA</span>
                  <Link
                    href={`/exporters/${company.slug}`}
                    className="p-1 text-[#202522] hover:text-[#9b452f] transition-colors"
                    title="View Showroom"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Sub-row: Direct Contact Masked Gate matching Replit */}
              <div className="mt-3 pt-3 border-t border-[#b9aa95]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#70695f]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#70695f]">Direct Contact:</span>
                  <span className="font-mono text-xs text-[#b9aa95]">
                    {company.company_email ? `${company.company_email.slice(0, 4)}••••@••••••.com` : 'info••••@••••••.com'}
                  </span>
                  <span className="font-mono text-xs text-[#b9aa95]">
                    {company.company_phone ? `${company.company_phone.slice(0, 6)} ••• ••••` : '+20 ••• ••• ••••'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MaskedContact
                    phone={company.company_phone}
                    whatsapp={company.company_phone}
                    email={company.company_email}
                    companyName={company.company_name_en}
                    variant="inline"
                  />
                  <Link
                    href={`/exporters/${company.slug}`}
                    className="text-xs font-bold text-[#9b452f] hover:underline uppercase tracking-wider"
                  >
                    View Full Showroom →
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
