'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackContentItems } from '@/lib/data/fallbackData';
import { Tv, Play, FileText, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';

export default function MediaSpotlight() {
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const tvEpisode = fallbackContentItems.find((c) => c.content_type === 'TV_EPISODE');
  const newsArticle = fallbackContentItems.find((c) => c.content_type === 'ARTICLE');

  return (
    <section className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الإعلام والتغطيات الميدانية' : 'National Broadcast & Intelligence'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('sectionTvMedia')}
            </h2>
          </div>
          <Link
            href="/media"
            className="text-xs sm:text-sm font-semibold text-brand-gold hover:text-brand-goldLight flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main TV Episode Video Embed Card (Takes 2 Columns) */}
          {tvEpisode && (
            <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border-brand-border/60 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              {/* Responsive Video Container */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${tvEpisode.youtube_video_id || 'dQw4w9WgXcQ'}`}
                  title={tvEpisode.title_en || 'TV Episode'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    HENEQDAR TV (هنقدر)
                  </span>
                  <span className="text-xs text-brand-dim">Episode #12</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {language === 'ar' ? tvEpisode.title_ar : tvEpisode.title_en}
                </h3>
                <p className="text-xs sm:text-sm text-brand-dim leading-relaxed">
                  {language === 'ar' ? tvEpisode.body_ar : tvEpisode.body_en}
                </p>
              </div>
            </div>
          )}

          {/* Trade Intelligence Article Spotlight */}
          {newsArticle && (
            <div className="glass-panel rounded-2xl overflow-hidden border-brand-border/60 flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>TRADE PLAYBOOK</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-3 hover:text-brand-gold transition-colors">
                  {language === 'ar' ? newsArticle.title_ar : newsArticle.title_en}
                </h3>

                <p className="text-xs text-brand-dim leading-relaxed mb-6">
                  {language === 'ar' ? newsArticle.body_ar : newsArticle.body_en}
                </p>

                {/* Quick Points */}
                <div className="space-y-2 border-t border-brand-border/60 pt-4 text-xs text-brand-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span>EU Pesticide MRL Directives 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span>Accredited Central Labs in Egypt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span>Pre-Harvest Interval (PHI) Calculations</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-border/60">
                <Link
                  href="/media"
                  className="w-full py-2.5 rounded-xl text-xs font-bold border border-brand-border text-white hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-2"
                >
                  <span>{language === 'ar' ? 'قراءة الدليل كاملاً' : 'Read Full Playbook'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
