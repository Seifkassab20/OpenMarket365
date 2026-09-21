'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackContentItems } from '@/lib/data/fallbackData';
import { Tv, Play, FileText, ExternalLink, Building2, Anchor } from 'lucide-react';

export default function MediaHubPage() {
  const { language, t } = useLanguage();

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
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
          <Tv className="w-4 h-4" />
          <span>{language === 'ar' ? 'المركز الإعلامي والتوثيق الميداني' : 'National Trade Media & Broadcast'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {language === 'ar' ? 'برنامج "هنقدر" ومكتبة الدراسات التصديرية' : '"Yes We Can" TV Hub & Trade Intelligence'}
        </h1>
        <p className="text-sm text-brand-muted mt-2 max-w-2xl">
          {language === 'ar'
            ? 'تغطيات ميدانية لكبرى قلاع الصناعة والزراعة المصرية، وأحدث أدلة الامتثال للمواصفات القياسية الدولية.'
            : 'Field video documentaries of Egyptian export powerhouses, combined with actionable regulatory compliance playbooks.'
          }
        </p>
      </div>

      {/* Video Episodes Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-red-500 fill-current" />
          <span>{language === 'ar' ? 'حلقات برنامج "هنقدر" (Yes We Can)' : 'Featured TV Episodes'}</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {episodes.map((ep) => (
            <div key={ep.id} className="glass-panel rounded-3xl overflow-hidden border-brand-border/60">
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ep.youtube_video_id || 'dQw4w9WgXcQ'}`}
                  title={ep.title_en || 'TV Episode'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6">
                <span className="text-[10px] font-bold uppercase text-purple-400 block mb-1">HENEQDAR BROADCAST</span>
                <h3 className="text-base font-bold text-white mb-2">
                  {language === 'ar' ? ep.title_ar : ep.title_en}
                </h3>
                <p className="text-xs text-brand-dim leading-relaxed">
                  {language === 'ar' ? ep.body_ar : ep.body_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Intelligence Articles */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-cyan" />
          <span>{language === 'ar' ? 'أدلة الامتثال والمعايير الدولية' : 'Export Playbooks & Market Analysis'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div key={art.id} className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-brand-border/60">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 inline-block mb-3">
                  {art.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-3">
                  {language === 'ar' ? art.title_ar : art.title_en}
                </h3>
                <p className="text-xs text-brand-dim leading-relaxed mb-6">
                  {language === 'ar' ? art.body_ar : art.body_en}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60 text-xs text-brand-gold font-semibold">
                Published: March 2026 • Verified Regulatory Reference
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Directory of Export Councils & Port Authorities */}
      <div className="glass-panel-gold rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-gold" />
            <span>{language === 'ar' ? 'دليل المجالس التصديرية وهيئات الموانئ' : 'Official Trade Councils & Maritime Directory'}</span>
          </h2>
          <p className="text-xs text-brand-dim mt-1">
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
              className="p-4 rounded-2xl bg-white/5 border border-brand-border hover:border-brand-gold/40 hover:bg-white/10 transition-all flex items-center justify-between group text-xs"
            >
              <div className="flex items-center gap-3">
                <Anchor className="w-4 h-4 text-brand-cyan group-hover:text-brand-gold transition-colors flex-shrink-0" />
                <span className="font-semibold text-white">
                  {language === 'ar' ? auth.nameAr : auth.nameEn}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-brand-dim group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
