'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies, fallbackProducts } from '@/lib/data/fallbackData';
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  Video, 
  Anchor, 
  Package, 
  Layers,
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Box,
  Cpu
} from 'lucide-react';
import MaskedContact from '@/components/shared/MaskedContact';

export default function ExporterShowroomPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const company = fallbackCompanies.find((c) => c.slug === slug) || fallbackCompanies[0];
  const companyProducts = fallbackProducts.filter((p) => p.company_id === company.id);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-[#eee8dc]">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#70695f] uppercase tracking-wider font-semibold">
        <Link href="/exporters" className="hover:text-[#9b452f] transition-colors">
          EXPORTER DIRECTORY
        </Link>
        <span>/</span>
        <span className="text-[#202522]">{company.company_name_en}</span>
      </div>

      {/* Showroom Header */}
      <div className="border-b border-[#202522] pb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag tag-olive">OFFICIALLY VERIFIED EXPORTER</span>
              <span className="tag tag-amber">ELITE PACKHOUSE</span>
              <span className="tag tag-muted font-mono">CR: {company.cr_number}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#202522] font-normal leading-tight">
              {language === 'ar' ? (company.company_name_ar || company.company_name_en) : company.company_name_en}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#565047]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>{company.governorate}, Egypt</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-[#596348]" />
                <span>Ports: {company.export_port_history}</span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <MaskedContact
              phone={company.company_phone}
              whatsapp={company.company_phone}
              email={company.company_email}
              companyName={company.company_name_en}
              variant="card"
            />
          </div>
        </div>
      </div>

      {/* Facility Specs Matrix matching Replit */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[#202522]">
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            OPTICAL SORTING MACHINERY
          </div>
          <div className="font-serif text-2xl text-[#202522]">
            {company.sorting_machinery || 'Aweta InVision 6-Lane'}
          </div>
          <p className="text-xs text-[#565047] mt-1">High-speed blemish & color calibration</p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            COLD STORAGE CAPACITY
          </div>
          <div className="font-serif text-2xl text-[#202522]">
            {company.cold_storage_capacity_ml ? `${company.cold_storage_capacity_ml.toLocaleString()} MT` : '12,000 MT'}
          </div>
          <p className="text-xs text-[#565047] mt-1">Controlled atmosphere & pre-cooling</p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            ANNUAL EXPORT CAPACITY
          </div>
          <div className="font-serif text-2xl text-[#202522]">
            {company.annual_capacity_ml ? `${company.annual_capacity_ml.toLocaleString()} MT` : '45,000 MT'}
          </div>
          <p className="text-xs text-[#565047] mt-1">Direct port dispatch capability</p>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5">
          <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#70695f] mb-1">
            PRIMARY EXPORT ROUTES
          </div>
          <div className="font-serif text-2xl text-[#202522]">
            Rotterdam · Jeddah · Hamburg
          </div>
          <p className="text-xs text-[#565047] mt-1">Direct sea container lines</p>
        </div>
      </div>

      {/* Main Content: About & 4K Tour Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h3 className="font-serif text-2xl text-[#202522] font-normal">
              Facility profile & operations
            </h3>
            <p className="text-sm text-[#565047] leading-relaxed">
              {language === 'ar' ? (company.about_ar || company.about_en) : company.about_en}
            </p>
          </div>

          {/* 4K YouTube Video Tour Embed */}
          {company.youtube_video_id && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9b452f]">
                <Video className="w-4 h-4" />
                <span>4K Facility & Packing House Walkthrough</span>
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#202522] border border-[#b9aa95]">
                <iframe
                  src={`https://www.youtube.com/embed/${company.youtube_video_id}?rel=0`}
                  title="Facility Tour"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Certificate Vault */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#202522] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#9b452f]" />
                <span>Accreditation & Quality Vault</span>
              </span>
              <span className="tag tag-olive">AUDITED</span>
            </div>

            <p className="text-xs text-[#565047]">
              All certificates have been validated against official Egyptian accreditation councils and international audit bodies.
            </p>

            <div className="space-y-2.5 pt-2">
              {(company.quality_iso ? company.quality_iso.split(',') : ['GlobalG.A.P.', 'ISO 22000', 'BRCGS Food', 'SMETA Sedex', 'Halal']).map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#eee8dc] border border-[#b9aa95]/80 text-xs">
                  <div className="flex items-center gap-2 font-medium text-[#202522]">
                    <ShieldCheck className="w-4 h-4 text-[#596348]" />
                    <span>{cert.trim()}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#70695f] uppercase">Valid 2026/27</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Published Commodities Catalog Grid */}
      <div className="pt-8 border-t border-[#b9aa95] space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="kicker mb-1">EXPORT CATALOG</div>
            <h3 className="font-serif text-3xl text-[#202522]">
              Listed commodities & packing specs
            </h3>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b452f] hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companyProducts.map((prod) => (
            <Link
              key={prod.id}
              href={`/products/${prod.slug}`}
              className="group bg-[#e4dac9] border border-[#b9aa95] overflow-hidden hover:border-[#9b452f] transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#eee8dc]">
                <img
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80'}
                  alt={prod.title_en || 'Commodity'}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#70695f]">
                  <span>HS {prod.hs_code}</span>
                  <span className="tag tag-muted">{prod.harvest_season_from} - {prod.harvest_season_to}</span>
                </div>

                <h4 className="font-serif text-xl text-[#202522] group-hover:text-[#9b452f] transition-colors line-clamp-1">
                  {prod.title_en}
                </h4>

                <p className="text-xs text-[#565047] line-clamp-2">
                  {prod.body_en}
                </p>

                <div className="pt-3 border-t border-[#b9aa95] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#70695f] block uppercase">Indicative FOB</span>
                    <span className="text-base font-bold text-[#9b452f]">${prod.price} <span className="text-xs font-normal text-[#70695f]">/ MT</span></span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#202522] group-hover:text-[#9b452f]">
                    View Specs →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
