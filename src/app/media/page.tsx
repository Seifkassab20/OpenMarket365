'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackContentItems } from '@/lib/data/fallbackData';
import { Tv, Play, FileText, ExternalLink, Building2, Anchor } from 'lucide-react';

export default function MediaHubPage() {
  const { language } = useLanguage();

  const episodes = fallbackContentItems.filter((c) => c.content_type === 'TV_EPISODE');
  const articles = fallbackContentItems.filter((c) => c.content_type === 'ARTICLE');

  const authorities = [
    { nameEn: 'Agricultural Export Council (AEC)', nameAr: 'المجلس التصديري للحاصلات الزراعية', url: 'https://aec-egypt.org' },
    { nameEn: 'Food Export Council (FEC)', nameAr: 'المجلس التصديري للصناعات الغذائية', url: 'https://fec-egypt.com' },
    { nameEn: 'General Authority for Investment (GAFI)', nameAr: 'الهيئة العامة للاستثمار والمناطق الحرة', url: 'https://gafi.gov.eg' },
    { nameEn: 'Alexandria Port Authority', nameAr: 'هيئة ميناء الإسكندرية', url: 'https://apa.gov.eg' },
    { nameEn: 'Damietta Port Authority', nameAr: 'هيئة ميناء دمياط', url: 'https://dpa.gov.eg' },
    { nameEn: 'General Organization for Export & Import Control (GOEIC)', nameAr: 'الهيئة العامة للرقابة على الصادرات والواردات', url: 'https://goeic.gov.eg' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="pb-6 border-b border-[#b9aa95]">
        <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2 flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5" />
          <span>07 / FIELD NOTES & REGULATORY DESK</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#202522] tracking-tight">
          {language === 'ar' ? 'برنامج "هنقدر" والمكتبة التصديرية.' : 'The work behind the label.'}
        </h1>
        <p className="text-sm text-[#70695f] mt-3 max-w-2xl leading-relaxed">
          {language === 'ar'
            ? 'تغطيات ميدانية لكبرى قلاع الصناعة والزراعة المصرية، وأحدث أدلة الامتثال للمواصفات القياسية الدولية.'
            : 'Television episodes of "Yes We Can", packhouse optical sorting walk-throughs, and verified regulatory compliance manuals.'
          }
        </p>
      </div>

      {/* Video Episodes Section */}
      <div className="space-y-6">
        <div className="pb-2 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
            BROADCAST REELS
          </span>
          <h2 className="text-2xl font-serif text-[#202522]">
            {language === 'ar' ? 'حلقات برنامج "هنقدر" (Yes We Can)' : 'Television Episodes.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {episodes.map((ep) => (
            <div key={ep.id} className="bg-[#e4dac9] border border-[#b9aa95] overflow-hidden shadow-sm">
              <div className="relative w-full aspect-video bg-[#202522]">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ep.youtube_video_id || 'dQw4w9WgXcQ'}`}
                  title={ep.title_en || 'TV Episode'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b452f] block mb-1">
                  HENEQDAR BROADCAST • EPISODE ARCHIVE
                </span>
                <h3 className="text-xl font-serif text-[#202522] mb-2">
                  {language === 'ar' ? ep.title_ar : ep.title_en}
                </h3>
                <p className="text-xs text-[#565047] leading-relaxed">
                  {language === 'ar' ? ep.body_ar : ep.body_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Intelligence Articles */}
      <div className="space-y-6">
        <div className="pb-2 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#596348] uppercase tracking-[0.22em]">
            EXPORT REGULATORY PLAYBOOKS
          </span>
          <h2 className="text-2xl font-serif text-[#202522]">
            {language === 'ar' ? 'أدلة الامتثال والمعايير الدولية' : 'Compliance & Market Analysis.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div key={art.id} className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white inline-block mb-3">
                  {art.category}
                </span>
                <h3 className="text-xl font-serif text-[#202522] mb-3">
                  {language === 'ar' ? art.title_ar : art.title_en}
                </h3>
                <p className="text-xs text-[#565047] leading-relaxed mb-6">
                  {language === 'ar' ? art.body_ar : art.body_en}
                </p>
              </div>

              <div className="pt-4 border-t border-[#b9aa95] text-xs font-mono text-[#70695f]">
                Published: March 2026 • Verified Regulatory Reference
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Directory of Export Councils & Port Authorities */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-8 space-y-6 shadow-sm">
        <div className="pb-4 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
            NATIONAL PORTS & COUNCILS
          </span>
          <h2 className="text-2xl font-serif text-[#202522] mt-1">
            {language === 'ar' ? 'دليل المجالس التصديرية وهيئات الموانئ' : 'Official Trade Councils & Maritime Directory.'}
          </h2>
          <p className="text-xs text-[#70695f] mt-1">
            {language === 'ar' ? 'روابط مباشرة للجهات الحكومية والرقابية المعتمدة لشهادات التصدير' : 'Direct access to Egyptian government regulatory bodies and inspection portals'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authorities.map((auth, idx) => (
            <a
              key={idx}
              href={auth.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#eee8dc] border border-[#b9aa95] hover:border-[#202522] transition-all flex items-center justify-between group text-xs shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Anchor className="w-4 h-4 text-[#596348] group-hover:text-[#9b452f] transition-colors flex-shrink-0" />
                <span className="font-serif text-sm text-[#202522]">
                  {language === 'ar' ? auth.nameAr : auth.nameEn}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#70695f] group-hover:text-[#202522] transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

