'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterCompany,
  SubscriptionQuota,
} from '@/lib/services/exporterService';
import {
  Video,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Play,
  Upload,
  X,
  Loader2,
  Camera,
  Layers,
  Youtube,
} from 'lucide-react';
import {
  compressImageToWebP,
  formatFileSize,
  CompressionResult,
} from '@/lib/utils/imageCompressor';

interface GalleryItem {
  url: string;
  titleEn: string;
  titleAr: string;
  tag: string;
}

export default function ExporterMediaPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [company, setCompany] = useState<ExporterCompany | null>(null);
  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Gallery and In-Browser WebP compression states
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitleEn, setUploadTitleEn] = useState('');
  const [uploadTitleAr, setUploadTitleAr] = useState('');
  const [uploadTag, setUploadTag] = useState('Packhouse Infrastructure');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  // YouTube Zero-Cost Video Embed State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  const extractYouTubeId = (url: string): string => {
    const trimmed = url.trim();
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (match) return match[1];
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
    return trimmed;
  };

  const handleOpenVideoModal = () => {
    setYoutubeUrlInput(company?.youtube_video_id ? `https://www.youtube.com/watch?v=${company.youtube_video_id}` : '');
    setIsVideoModalOpen(true);
  };

  const handleSaveVideoEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    const cleanId = extractYouTubeId(youtubeUrlInput);
    if (!cleanId) return;

    setIsSavingVideo(true);
    try {
      const res = await exporterService.updateCompany(company.id, {
        youtube_video_id: cleanId,
      });
      if (res.success) {
        setCompany((prev) => (prev ? { ...prev, youtube_video_id: cleanId } : null));
        setIsVideoModalOpen(false);
        showToast({
          title: isAr ? 'تم تحديث رابط الفيديو' : 'YouTube Tour Updated',
          message: isAr
            ? 'تم حفظ وتضمين فيديو جولة المحطة من YouTube بنجاح دون أي استهلاك لمساحة التخزين.'
            : '4K Packhouse virtual tour successfully embedded from YouTube with zero storage impact.',
          type: 'success',
        });
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل حفظ رابط الفيديو' : 'Failed to update video embed link',
        type: 'error',
      });
    } finally {
      setIsSavingVideo(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const [comp, quot] = await Promise.all([
        exporterService.getCompany(),
        exporterService.getSubscriptionQuota('c-nileagro-01'),
      ]);
      setCompany(comp);
      setQuota(quot);

      if (comp) {
        setGallery([
          {
            url: comp.cover_banner_url || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1200',
            titleEn: 'Main Packhouse & Export Cold Storage Terminal',
            titleAr: 'المحطة الرئيسية للتعبئة ومجمع التبريد السريع والتصدير',
            tag: 'Infrastructure',
          },
          {
            url: comp.featured_gallery_url || 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&q=80&w=1000',
            titleEn: 'Aweta Optical Sizing & Sorting Line (Dutch Technology)',
            titleAr: 'خط الفرز والتدريج البصري أوويتا (Aweta) الهولندي',
            tag: 'Sorting Machinery',
          },
          {
            url: comp.featured_gallery_url_2 || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1000',
            titleEn: 'IQF Fluidized Bed Freezing Tunnel & Packing Bay',
            titleAr: 'نفق التجميد السريع الفردي IQF وصالة التعبئة المعقمة',
            tag: 'Freezing Line',
          },
          {
            url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1000',
            titleEn: 'Certified GlobalG.A.P. Citrus Orchards (Ismailia Desert Road)',
            titleAr: 'مزارع الموالح المعتمدة من جلوبال جاب (طريق مصر الإسماعيلية)',
            tag: 'Orchards & Farm',
          },
        ]);
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل وسائط المعرض' : 'Failed to retrieve media showcase',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDynamicRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await exporterService.requestMediaRefresh('c-nileagro-01');
      if (res.success) {
        showToast({
          title: isAr ? 'تم التحديث بنجاح' : 'Media Showcase Refreshed',
          message: isAr
            ? 'تم تحديث وسائط المعرض الرقمي وجدولتها لدورة سبتمبر 2026 بنجاح.'
            : 'Digital showroom 4K media showcase successfully refreshed for September 2026.',
          type: 'success',
        });
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل طلب التحديث' : 'Refresh request failed',
        type: 'error',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const res = await compressImageToWebP(file, 2560, 2560, 0.85);
      setCompressionResult(res);
      if (!uploadTitleEn) {
        setUploadTitleEn(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل ضغط الصورة إلى WebP' : 'Failed to compress image to WebP',
        type: 'error',
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAddPhoto = () => {
    if (!compressionResult) return;

    const newItem: GalleryItem = {
      url: compressionResult.dataUrl,
      titleEn: uploadTitleEn || 'Automated Packhouse Facility',
      titleAr: uploadTitleAr || 'محطة التعبئة والتجهيز الآلية',
      tag: uploadTag,
    };

    setGallery((prev) => [newItem, ...prev]);
    setIsUploadModalOpen(false);
    setCompressionResult(null);
    setUploadTitleEn('');
    setUploadTitleAr('');

    showToast({
      title: isAr ? 'تم إضافة الصورة بنجاح' : 'Photo Added to Vault',
      message: isAr
        ? `تم ضغط الصورة إلى صيغة WebP وتوفير ${compressionResult.savingsPercent}% من الحجم.`
        : `Image converted to WebP with ${compressionResult.savingsPercent}% client-side bandwidth reduction.`,
      type: 'success',
    });
  };

  if (isLoading || !company || !quota) {
    return (
      <div className="py-24 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#70695f]">
          {isAr ? 'جارِ تحميل استوديو الوسائط ومعرض 4K...' : 'Loading 4K media studio...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
              {isAr ? 'معرض الوسائط الرقمية ومحطات التعبئة' : 'ELITE MULTIMEDIA & PACKHOUSE SHOWCASE'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/10 text-[#2d7a58] border border-[#2d7a58]/30">
              4K Broadcast Ready
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#202522]">
            {isAr ? 'معرض الوسائط التصديرية والفيديو 4K' : 'Showroom Video & Media Assets'}
          </h1>
          <p className="text-xs text-[#70695f]">
            {isAr
              ? 'استعراض فيديوهات وصور محطات التعبئة، خطوط الفرز البصري، وغرف التبريد لبناء أقصى درجات الثقة مع المستوردين الدوليين.'
              : 'Broadcast video tours of your optical sorting line, cold storage infrastructure, and packaging lines to international buyers.'}
          </p>
        </div>

        <button
          onClick={handleDynamicRefresh}
          disabled={isRefreshing}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-2 transition-all shadow-sm self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'تحديث الوسائط (دورة 30 يوماً)' : 'TRIGGER 30-DAY REFRESH'}</span>
        </button>
      </div>

      {/* 30-Day Dynamic Refresh Schedule Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#dfd4c1]/60 border border-[#b9aa95] text-xs">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#c38b40] flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#202522] block">
              {isAr ? 'بروتوكول التحديث الدوري للوسائط (SRS v4.0 Elite Schedule):' : '30-Day Dynamic Media Refresh Protocol:'}
            </span>
            <p className="text-[#70695f]">
              {isAr
                ? 'يحق لباقتك تحديث فيديو المحطة ومجموعة صور المعرض كل 30 يوماً لضمان عكس المحاصيل الحالية لمواسم الحصاد.'
                : 'Your plan allows refreshing promotional videos and packhouse galleries every 30 days to reflect ongoing seasonal crops.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-auto bg-[#eee8dc] border border-[#b9aa95] px-3 py-1.5 rounded-lg text-[#202522]">
          <Calendar className="w-3.5 h-3.5 text-[#9b452f]" />
          <span>{isAr ? 'الدورة الحالية: سبتمبر 2026' : 'Active Cycle: September 2026'}</span>
        </div>
      </div>

      {/* Video Showcase Section */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#b9aa95]/40">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9b452f]" />
              <h3 className="text-base font-serif font-bold text-[#202522]">
                {isAr ? 'فيديو جولة محطة التعبئة والتجهيز (4K Packhouse Virtual Tour)' : 'Packhouse Infrastructure Video Showcase'}
              </h3>
            </div>
            <p className="text-xs text-[#70695f]">
              {isAr ? 'فيديو يعرض خط الفرز البصري والتبريد السريع مباشرة للمستوردين.' : 'Embedded video tour demonstrating automated optical grading and cold-chain compliance.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/15 text-[#2d7a58] border border-[#2d7a58]/30">
              {isAr ? 'مفعل في المعرض العام' : 'LIVE IN SHOWROOM'}
            </span>
            <button
              onClick={handleOpenVideoModal}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#202522] hover:bg-[#343b37] text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Youtube className="w-3.5 h-3.5 text-[#9b452f]" />
              <span>{isAr ? 'تحديث رابط YouTube' : 'Update YouTube Link'}</span>
            </button>
          </div>
        </div>

        {/* Zero-Cost Storage Architecture Notice */}
        <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#565047] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#9b452f] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#202522] block text-[11px] uppercase tracking-wider">
              {isAr ? 'بروتوكول الوسائط الصفرية (Zero-Cost Video Policy):' : 'Zero-Cost Video Architecture (YouTube Embed Only):'}
            </span>
            <p className="text-[11px] text-[#70695f] leading-relaxed">
              {isAr
                ? 'يمنع رفع ملفات الفيديو المباشرة (مثل MP4 و MOV) نهائياً على خوادم المنصة لحماية مساحات التخزين والباندويث. يتم استضافة جميع جولات المحطات عبر YouTube وتضمينها فورياً في معرضك الرقمي.'
                : 'Direct video file uploads (MP4, MOV) are strictly prohibited across the platform to eliminate storage exhaustion. Videos must be hosted on YouTube and embedded via URL for zero-cost, high-performance streaming.'}
            </p>
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#b9aa95] shadow-inner">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${company.youtube_video_id || 'dQw4w9WgXcQ'}?rel=0&modestbranding=1`}
            title="Packhouse Infrastructure Tour"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono text-[#70695f] block">
              {isAr ? 'تكنولوجيا الفرز المصورة' : 'Featured Machinery'}
            </span>
            <div className="font-mono font-bold text-[#202522]">{company.sorting_machinery}</div>
          </div>

          <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono text-[#70695f] block">
              {isAr ? 'طاقة التبريد السريع' : 'Cold Chain Capacity'}
            </span>
            <div className="font-mono font-bold text-[#202522]">{company.cold_storage_capacity_ml} MT Forced-Air</div>
          </div>

          <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-mono text-[#70695f] block">
              {isAr ? 'موانئ الشحن والتصدير' : 'Export Port History'}
            </span>
            <div className="font-mono font-bold text-[#202522]">{company.export_port_history}</div>
          </div>
        </div>
      </div>

      {/* 4K Photo Gallery Showcase */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#b9aa95]/40">
          <div className="space-y-0.5">
            <h3 className="text-base font-serif font-bold text-[#202522]">
              {isAr ? 'معرض صور البنية التحتية والفرز (4K Photographic Vault)' : 'High-Resolution Infrastructure Gallery'}
            </h3>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'صور معتمدة للشهادات، خطوط الفرز، والمحاصيل قبل الشحن (يتم ضغطها تلقائياً بصيغة WebP).'
                : 'Audited photographic evidence of packhouse hygiene, palletization, and pre-cooling.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#70695f]">
              {gallery.length} / {quota.max_images} {isAr ? 'صورة معتمدة' : 'Slots Used'}
            </span>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isAr ? 'رفع صورة 4K (WebP)' : 'Upload 4K Photo'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gallery.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(img.url)}
              className="group cursor-pointer bg-[#eee8dc] border border-[#b9aa95] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all space-y-2 pb-3"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
                <img
                  src={img.url}
                  alt={img.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#202522]/85 text-white backdrop-blur-sm">
                  {img.tag}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rtl:right-auto rtl:left-2.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#2d7a58]/90 text-white backdrop-blur-sm">
                  WebP 4K
                </span>
              </div>

              <div className="px-3 space-y-0.5">
                <h4 className="font-serif font-bold text-xs text-[#202522] group-hover:text-[#9b452f] transition-colors line-clamp-1">
                  {isAr ? img.titleAr : img.titleEn}
                </h4>
                <p className="text-[10px] font-mono text-[#70695f]">
                  4K Master Quality • GPS Nile Agro Packhouse
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload 4K Photo Modal with WebP Compression */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-[#e4dac9] border border-[#b9aa95] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#9b452f]" />
                <h3 className="text-base font-serif font-bold text-[#202522]">
                  {isAr ? 'رفع صورة بنية تحتية 4K مع ضغط WebP' : 'Upload 4K Packhouse Photo (Auto WebP)'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setCompressionResult(null);
                }}
                className="p-1 rounded-md text-[#70695f] hover:text-[#202522] hover:bg-[#eee8dc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Dropzone */}
              <div className="border-2 border-dashed border-[#b9aa95] bg-[#eee8dc] rounded-xl p-5 text-center space-y-2 hover:border-[#9b452f] transition-colors cursor-pointer">
                <Upload className="w-7 h-7 text-[#9b452f] mx-auto" />
                <div className="text-xs text-[#202522] font-semibold">
                  {compressionResult
                    ? compressionResult.file.name
                    : (isAr ? 'اختر صورة الكاميرا أو الهاتف (JPEG, PNG)' : 'Select camera or packhouse photo (JPEG, PNG)')}
                </div>
                <p className="text-[10px] text-[#70695f]">
                  {isAr
                    ? 'يتم ضغط الصورة تلقائياً بصيغة WebP لتقليل الحجم بنسبة 80% مع الحفاظ على دقة 4K'
                    : 'Image is compressed client-side to WebP saving ~80% bandwidth while preserving 4K clarity'}
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="media-upload-input"
                />
                <label
                  htmlFor="media-upload-input"
                  className="inline-block px-3.5 py-1.5 bg-[#202522] text-[#eee8dc] text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer rounded"
                >
                  {isAr ? 'تصفح الصور' : 'Browse Photo'}
                </label>

                {isCompressing && (
                  <div className="mt-3 p-2 bg-[#dfd4c1] border border-[#b9aa95] rounded text-xs text-[#202522] flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#9b452f]" />
                    <span>{isAr ? 'جارِ التحويل إلى WebP بنقاء 4K...' : 'Converting to WebP with 4K resolution...'}</span>
                  </div>
                )}

                {compressionResult && (
                  <div className="mt-3 p-2.5 bg-[#2d7a58]/10 border border-[#2d7a58]/30 rounded-lg text-xs text-[#2d7a58] flex flex-col sm:flex-row items-center justify-between gap-2 text-start">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2d7a58] shrink-0" />
                      <span className="font-semibold text-[11px]">
                        {isAr ? '✓ تم الضغط بنجاح (SRS FR-MED-001)' : '✓ WebP In-Browser Optimized'}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] bg-[#2d7a58]/20 px-2 py-0.5 rounded">
                      {formatFileSize(compressionResult.originalSize)} → {formatFileSize(compressionResult.compressedSize)} (-{compressionResult.savingsPercent}%)
                    </div>
                  </div>
                )}
              </div>

              {/* Title Inputs */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                  {isAr ? 'عنوان الصورة بالإنجليزية' : 'Photo Title (English)'}
                </label>
                <input
                  type="text"
                  value={uploadTitleEn}
                  onChange={(e) => setUploadTitleEn(e.target.value)}
                  placeholder="e.g. Automated Carton Packing & Palletizing Bay"
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded focus:border-[#9b452f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                  {isAr ? 'عنوان الصورة بالعربية' : 'Photo Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={uploadTitleAr}
                  onChange={(e) => setUploadTitleAr(e.target.value)}
                  placeholder="مثال: خط تعبئة الكراتين ورص البالتات الآلي"
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded focus:border-[#9b452f] focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                  {isAr ? 'قسم المنشأة / التصنيف' : 'Facility Area / Tag'}
                </label>
                <select
                  value={uploadTag}
                  onChange={(e) => setUploadTag(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded focus:border-[#9b452f] focus:outline-none"
                >
                  <option value="Infrastructure">Infrastructure (البنية التحتية)</option>
                  <option value="Sorting Machinery">Sorting Machinery (ماكينات الفرز البصري)</option>
                  <option value="Freezing Line">Freezing Line (نفق التجميد السريع)</option>
                  <option value="Cold Storage">Cold Storage (غرف التبريد المسبق)</option>
                  <option value="Orchards & Farm">Orchards & Farm (المزارع وبساتين الفاكهة)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setCompressionResult(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#565047] hover:text-[#202522]"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={!compressionResult}
                  className="px-5 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50"
                >
                  {isAr ? 'إضافة إلى المعرض' : 'Add to Showroom Vault'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update YouTube Video Link Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-[#e4dac9] border border-[#b9aa95] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-[#9b452f]" />
                <h3 className="text-base font-serif font-bold text-[#202522]">
                  {isAr ? 'تحديث رابط فيديو جولة المحطة (YouTube)' : 'Update Packhouse Tour Video (YouTube)'}
                </h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-md text-[#70695f] hover:text-[#202522] hover:bg-[#eee8dc]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Zero Upload Notice */}
            <div className="p-3 bg-[#dfd4c1] border border-[#b9aa95] rounded-lg text-xs space-y-1">
              <span className="font-bold text-[#202522] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#9b452f]" />
                <span>{isAr ? 'تنبيه معماري: لا يتم رفع ملفات الفيديو نهائياً' : 'Storage Protection Notice'}</span>
              </span>
              <p className="text-[11px] text-[#70695f] leading-relaxed">
                {isAr
                  ? 'رفع ملفات الفيديو يستهلك مساحة التخزين السحابية فورياً. ارفع الفيديو على YouTube (عام أو غير مدرج Unlisted)، ثم الصق رابطه هنا.'
                  : 'Direct video uploads are prohibited to prevent storage exhaustion. Upload your 4K virtual tour to YouTube (Public or Unlisted), then paste the link below.'}
              </p>
            </div>

            <form onSubmit={handleSaveVideoEmbed} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                  {isAr ? 'رابط الفيديو على يوتيوب أو معرف الفيديو (Video ID)' : 'YouTube Video URL or 11-char Video ID'}
                </label>
                <input
                  type="text"
                  required
                  value={youtubeUrlInput}
                  onChange={(e) => setYoutubeUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded focus:border-[#9b452f] focus:outline-none font-mono text-xs"
                />
              </div>

              {/* Live Preview if ID detected */}
              {extractYouTubeId(youtubeUrlInput) && extractYouTubeId(youtubeUrlInput).length === 11 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#70695f] uppercase tracking-wider block">
                    {isAr ? 'معاينة الفيديو المضمن:' : 'Detected YouTube Embed Preview:'}
                  </span>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-[#b9aa95]">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(youtubeUrlInput)}?rel=0&modestbranding=1`}
                      title="Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#565047] hover:text-[#202522]"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingVideo || !extractYouTubeId(youtubeUrlInput)}
                  className="px-5 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSavingVideo
                    ? (isAr ? 'جاري الحفظ...' : 'Saving Embed...')
                    : (isAr ? 'تثبيت التضمين' : 'Save YouTube Embed')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Image Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#b9aa95] bg-[#202522]">
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
