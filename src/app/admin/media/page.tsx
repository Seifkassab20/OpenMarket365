'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  Tv,
  Video,
  Play,
  Calendar,
  Plus,
  ExternalLink,
  Sparkles,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Youtube,
  ShieldCheck,
  X,
} from 'lucide-react';

interface TvEpisode {
  id: string;
  episodeNumber: number;
  titleEn: string;
  titleAr: string;
  youtubeId: string;
  featuredPackhouse: string;
  airDate: string;
  duration: string;
  isFeaturedOnVideoWall: boolean;
}

export default function AdminMediaSchedulerPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();

  const [episodes, setEpisodes] = useState<TvEpisode[]>([
    {
      id: 'ep-01',
      episodeNumber: 14,
      titleEn: 'Egyptian Valencia Citrus: Inside Nubaria Packhouses',
      titleAr: 'موسم الموالح المصري: جولة داخل محطات الفرز بالنوبارية',
      youtubeId: 'dQw4w9WgXcQ',
      featuredPackhouse: 'Nile Agro Export Industries',
      airDate: '2026-03-10',
      duration: '24:18',
      isFeaturedOnVideoWall: true,
    },
    {
      id: 'ep-02',
      episodeNumber: 15,
      titleEn: 'Golden Onions & Curing Technology in Belbeis',
      titleAr: 'البصل الذهبي وتكنولوجيا التجفيف الحديث ببلبيس',
      youtubeId: 'M7lc1UVf-VE',
      featuredPackhouse: 'Al-Ahram Delta Agri',
      airDate: '2026-03-18',
      duration: '21:05',
      isFeaturedOnVideoWall: true,
    },
    {
      id: 'ep-03',
      episodeNumber: 16,
      titleEn: 'Organic Medicinal Herbs of Upper Egypt',
      titleAr: 'الأعشاب والنباتات الطبية العضوية في بني سويف',
      youtubeId: 'jNQXAC9IVRw',
      featuredPackhouse: 'Delta Med Herbs & Botanicals',
      airDate: '2026-03-24',
      duration: '28:40',
      isFeaturedOnVideoWall: false,
    },
  ]);

  // Form modal
  const [showModal, setShowModal] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newYoutubeId, setNewYoutubeId] = useState('');
  const [newPackhouse, setNewPackhouse] = useState('Nile Agro Export');
  const [newEpNum, setNewEpNum] = useState(17);

  // Preview modal
  const [previewId, setPreviewId] = useState<string | null>(null);

  const extractYouTubeId = (url: string): string => {
    const trimmed = url.trim();
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (match) return match[1];
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
    return trimmed;
  };

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = extractYouTubeId(newYoutubeId);
    if (!cleanId) return;

    const newEp: TvEpisode = {
      id: `ep-${Date.now()}`,
      episodeNumber: newEpNum,
      titleEn: newTitleEn || `Episode ${newEpNum}: Egyptian Export Excellence`,
      titleAr: newTitleAr || `حلقة ${newEpNum}: جولة في الصادرات الزراعية المصرية`,
      youtubeId: cleanId,
      featuredPackhouse: newPackhouse,
      airDate: new Date().toISOString().split('T')[0],
      duration: '22:00',
      isFeaturedOnVideoWall: true,
    };

    setEpisodes([newEp, ...episodes]);
    setShowModal(false);
    setNewYoutubeId('');
    setNewTitleEn('');
    setNewTitleAr('');
    addToast('success', 'New TV episode and Video Wall slot scheduled via YouTube embed!');
  };

  const toggleVideoWall = (id: string) => {
    setEpisodes((prev) =>
      prev.map((ep) =>
        ep.id === id ? { ...ep, isFeaturedOnVideoWall: !ep.isFeaturedOnVideoWall } : ep
      )
    );
    addToast('info', 'Homepage Video Wall slot updated.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs font-mono">
              TV MEDIA & VIDEO WALL · FR-MED-002
            </span>
            <span className="text-xs text-[#70695f] font-mono">&quot;Yes We Can&quot; (نعم نستطيع) Pipeline</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            TV Episode & Video Wall Scheduling
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Schedule broadcast episodes of &quot;Yes We Can&quot; and feature verified packhouse commercials on the homepage video wall via YouTube embeds (zero storage cost).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule YouTube Episode</span>
        </button>
      </div>

      {/* Zero Storage Architecture Banner */}
      <div className="p-4 bg-[#e4dac9] border border-[#b9aa95] rounded-xl text-xs space-y-1">
        <div className="flex items-center gap-2 text-[#202522] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#596348]" />
          <span>Zero-Storage Architecture: 100% YouTube Hosted</span>
        </div>
        <p className="text-[11px] text-[#70695f] leading-relaxed">
          OpenMarket 365 never stores raw video files on servers. All media is hosted externally on YouTube and referenced via 11-character video IDs. The homepage video wall and showroom stream directly from YouTube&apos;s global CDN at $0 bandwidth and storage cost.
        </p>
      </div>

      {/* Episode Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between space-y-3 group"
          >
            {/* Thumbnail Poster with YouTube Badge */}
            <div
              onClick={() => setPreviewId(ep.youtubeId)}
              className="relative aspect-video bg-black/20 overflow-hidden cursor-pointer flex items-center justify-center group-hover:opacity-95 transition-opacity"
            >
              <img
                src={`https://img.youtube.com/vi/${ep.youtubeId}/mqdefault.jpg`}
                alt={ep.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-[#9b452f] text-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white rounded backdrop-blur-sm flex items-center gap-1">
                <Youtube className="w-3 h-3 text-[#ff0000]" />
                <span>YouTube Embed</span>
              </span>
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[9px] font-mono bg-black/80 text-white rounded">
                {ep.duration}
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#9b452f] uppercase bg-[#9b452f]/10 px-2 py-0.5 rounded">
                  EPISODE {ep.episodeNumber}
                </span>
                <span className="text-[10px] font-mono text-[#70695f] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {ep.airDate}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm text-[#202522] line-clamp-1">
                  {ep.titleEn}
                </h3>
                <div className="text-[11px] text-[#70695f] font-arabic line-clamp-1">
                  {ep.titleAr}
                </div>
              </div>

              <div className="text-xs text-[#565047] font-mono">
                Featured Packhouse: <strong className="text-[#202522]">{ep.featuredPackhouse}</strong>
              </div>

              <div className="pt-2 border-t border-[#b9aa95]/40 flex items-center justify-between">
                <button
                  onClick={() => toggleVideoWall(ep.id)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                    ep.isFeaturedOnVideoWall
                      ? 'bg-[#596348] text-white'
                      : 'bg-[#eee8dc] border border-[#b9aa95] text-[#70695f]'
                  }`}
                >
                  {ep.isFeaturedOnVideoWall ? '✓ Video Wall Active' : 'Slot on Video Wall'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewId(ep.youtubeId)}
                    className="text-xs font-mono text-[#565047] hover:text-[#202522] underline"
                  >
                    Preview
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#9b452f] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#b9aa95] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#202522]">
                Schedule New Episode / Video Wall Commercial
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm font-bold text-[#70695f] hover:text-[#202522]"
              >
                ✕
              </button>
            </div>

            {/* Zero-Cost Storage Rule Notice */}
            <div className="p-3 bg-[#dfd4c1] border border-[#b9aa95] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#202522] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#9b452f]" />
                <span>Zero-Cost Video Policy (YouTube Embedding Only)</span>
              </span>
              <p className="text-[11px] text-[#70695f] leading-relaxed">
                Direct video file uploads (MP4/MOV) are blocked platform-wide to protect free-tier cloud storage. All episode media must be uploaded to YouTube and embedded via public or unlisted URL.
              </p>
            </div>

            <form onSubmit={handleAddEpisode} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                    Episode Number
                  </label>
                  <input
                    type="number"
                    value={newEpNum}
                    onChange={(e) => setNewEpNum(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                    YouTube URL or 11-char ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://youtu.be/... or dQw4w9WgXcQ"
                    value={newYoutubeId}
                    onChange={(e) => setNewYoutubeId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522] font-mono"
                  />
                </div>
              </div>

              {/* YouTube Live Embed Preview */}
              {extractYouTubeId(newYoutubeId) && extractYouTubeId(newYoutubeId).length === 11 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#70695f] uppercase tracking-wider block">
                    YouTube Embed Preview:
                  </span>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-[#b9aa95]">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(newYoutubeId)}?rel=0&modestbranding=1`}
                      title="Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  placeholder="Episode Title in English"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                  العنوان (باللغة العربية)
                </label>
                <input
                  type="text"
                  placeholder="عنوان الحلقة بالعربية"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522] font-arabic"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                  Featured Packhouse / Exporter
                </label>
                <input
                  type="text"
                  value={newPackhouse}
                  onChange={(e) => setNewPackhouse(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                />
              </div>

              <div className="pt-3 border-t border-[#b9aa95] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#b9aa95] rounded text-xs font-bold text-[#202522]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded"
                >
                  Schedule Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightweight Preview Lightbox */}
      {previewId && (
        <div
          onClick={() => setPreviewId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#202522] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4"
          >
            <div className="flex items-center justify-between text-[#eee8dc] pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold flex items-center gap-2">
                <Youtube className="w-4 h-4 text-[#ff0000]" />
                <span>YouTube Zero-Cost Embed Preview</span>
              </span>
              <button
                onClick={() => setPreviewId(null)}
                className="text-xs text-[#b9aa95] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewId}?autoplay=1&rel=0`}
                title="Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
