'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import { importerService, EnquiryKind } from '@/lib/services/importerService';
import { Send, Video } from 'lucide-react';

/** US-IMP-04: direct enquiry or video verification request to one exporter. */
export default function EnquiryButton({ supplierId, supplierName }: { supplierId: string; supplierName: string }) {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isAr = language === 'ar';

  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<EnquiryKind>('ENQUIRY');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await importerService.sendEnquiry(supplierId, kind, message);
      addToast(
        'success',
        kind === 'VIDEO_VERIFICATION'
          ? isAr
            ? `تم إرسال طلب التحقق بالفيديو إلى ${supplierName}.`
            : `Video verification request sent to ${supplierName}.`
          : isAr
          ? `تم إرسال استفسارك إلى ${supplierName}.`
          : `Enquiry sent to ${supplierName}.`
      );
      setOpen(false);
      setMessage('');
    } catch {
      addToast('error', isAr ? 'تعذر إرسال الطلب.' : 'Could not send the request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-3 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
      >
        <Send className="w-3.5 h-3.5" />
        {isAr ? 'استفسار' : 'Enquire'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-title"
        >
          <form
            onSubmit={submit}
            className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-start justify-between border-b border-[#b9aa95] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#9b452f]">
                  {isAr ? 'تواصل مباشر مع المصنع' : 'Direct factory request'}
                </span>
                <h3 id="enquiry-title" className="font-serif text-xl font-bold text-[#202522]">
                  {supplierName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="text-[#70695f] hover:text-[#202522] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <fieldset className="grid grid-cols-2 gap-2">
              <legend className="sr-only">{isAr ? 'نوع الطلب' : 'Request type'}</legend>
              {(
                [
                  { value: 'ENQUIRY', icon: <Send className="w-3.5 h-3.5" />, en: 'Information enquiry', ar: 'استفسار معلومات' },
                  { value: 'VIDEO_VERIFICATION', icon: <Video className="w-3.5 h-3.5" />, en: 'Video verification', ar: 'تحقق بالفيديو' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-1.5 p-2.5 border rounded cursor-pointer font-bold ${
                    kind === opt.value ? 'border-[#9b452f] bg-[#9b452f]/10 text-[#9b452f]' : 'border-[#b9aa95] bg-[#eee8dc] text-[#202522]'
                  }`}
                >
                  <input
                    type="radio"
                    name="enquiry-kind"
                    value={opt.value}
                    checked={kind === opt.value}
                    onChange={() => setKind(opt.value)}
                    className="sr-only"
                  />
                  {opt.icon}
                  {isAr ? opt.ar : opt.en}
                </label>
              ))}
            </fieldset>

            <label className="block">
              <span className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                {isAr ? 'الرسالة' : 'Message'}
              </span>
              <textarea
                required
                rows={4}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  kind === 'VIDEO_VERIFICATION'
                    ? isAr
                      ? 'مثال: نرجو جولة فيديو مباشرة لخط الفرز والتبريد.'
                      : 'e.g. Please arrange a live video walkthrough of your sorting line and cold storage.'
                    : isAr
                    ? 'اكتب استفسارك...'
                    : 'Ask about capacity, specifications, certificates...'
                }
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none leading-relaxed"
              />
            </label>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-[#9b452f] hover:bg-[#833824] disabled:opacity-60 text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              {sending ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : isAr ? 'إرسال الطلب' : 'Send Request'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
