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
  AlertCircle,
  Play,
} from 'lucide-react';

export default function ExporterMediaPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [company, setCompany] = useState<ExporterCompany | null>(null);
  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const galleryImages = [
    {
      url: company.cover_banner_url || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1200',
      titleEn: 'Main Packhouse & Export Cold Storage Terminal',
      titleAr: 'المحطة الرئيسية للتعبئة ومجمع التبريد السريع والتصدير',
      tag: 'Infrastructure',
    },
    {
      url: company.featured_gallery_url || 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&q=80&w=1000',
      titleEn: 'Aweta Optical Sizing & Sorting Line (Dutch Technology)',
      titleAr: 'خط الفرز والتدريج البصري أوويتا (Aweta) الهولندي',
      tag: 'Sorting Machinery',
    },
    {
      url: company.featured_gallery_url_2 || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1000',
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
  ];

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

          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/15 text-[#2d7a58] border border-[#2d7a58]/30 self-start sm:self-auto">
            {isAr ? 'مفعل في المعرض العام' : 'LIVE IN SHOWROOM'}
          </span>
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
        <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]/40">
          <div className="space-y-0.5">
            <h3 className="text-base font-serif font-bold text-[#202522]">
              {isAr ? 'معرض صور البنية التحتية والفرز (4K Photographic Vault)' : 'High-Resolution Infrastructure Gallery'}
            </h3>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'صور معتمدة للشهادات، المحاصيل قبل الشحن، وغرف التبريد.'
                : 'Audited photographic evidence of packhouse hygiene, palletization, and pre-cooling.'}
            </p>
          </div>

          <span className="text-xs font-mono text-[#70695f]">
            {quota.current_images} / {quota.max_images} {isAr ? 'صورة معتمدة' : 'Slots Used'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {galleryImages.map((img, idx) => (
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
