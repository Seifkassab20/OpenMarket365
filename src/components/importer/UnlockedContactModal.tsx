'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  importerService,
  applyAcceptance,
  SealedQuotation,
  SupplierContact,
  whatsappLink,
  revealsUsedToday,
  RevealLimitError,
  REVEAL_DAILY_LIMIT,
} from '@/lib/services/importerService';
import { MessageSquare, Phone, Mail, Unlock } from 'lucide-react';

/** Accept & Unlock flow shared by the procurement desk and the quotes matrix. */
export function useQuoteAcceptance(
  setQuotes: React.Dispatch<React.SetStateAction<SealedQuotation[]>>,
  onAccepted?: (quote: SealedQuotation) => void
) {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const [unlocked, setUnlocked] = useState<{ quote: SealedQuotation; contact: SupplierContact } | null>(null);

  const accept = async (quote: SealedQuotation) => {
    const alreadyAccepted = quote.status === 'ACCEPTED';
    const confirmText =
      language === 'ar'
        ? `قبول عرض ${quote.supplier_name}؟ سيتم رفض باقي العروض على نفس الطلب وكشف بيانات التواصل للطرفين.`
        : `Accept ${quote.supplier_name}'s quote? Competing bids on this RFQ will be declined and contacts revealed to both parties.`;
    if (!alreadyAccepted && !window.confirm(confirmText)) return;

    try {
      const contact = await importerService.acceptQuote(quote.id);
      if (!alreadyAccepted) {
        setQuotes((qs) => applyAcceptance(qs, quote));
        onAccepted?.(quote);
      }
      setUnlocked({ quote, contact });
    } catch (err) {
      if (err instanceof RevealLimitError) {
        addToast(
          'error',
          language === 'ar'
            ? `وصلت للحد اليومي لكشف بيانات التواصل (${REVEAL_DAILY_LIMIT}). حاول غداً.`
            : `Daily contact reveal limit reached (${REVEAL_DAILY_LIMIT}/day). Try again tomorrow.`
        );
        return;
      }
      addToast('error', language === 'ar' ? 'تعذر قبول العرض.' : 'Could not accept this quote.');
    }
  };

  return { accept, unlocked, closeUnlocked: () => setUnlocked(null) };
}

export function AcceptQuoteButton({
  quote,
  onAccept,
  className,
}: {
  quote: SealedQuotation;
  onAccept: (quote: SealedQuotation) => void;
  className: string;
}) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  if (quote.status === 'DECLINED') {
    return (
      <button disabled className={`${className} bg-[#b9aa95]/50 text-[#70695f] cursor-not-allowed`}>
        {isAr ? 'مرفوض' : 'Declined'}
      </button>
    );
  }
  if (quote.status === 'ACCEPTED') {
    return (
      <button onClick={() => onAccept(quote)} className={`${className} bg-[#202522] hover:bg-[#363e39] text-white`}>
        <Unlock className="w-3.5 h-3.5 inline -mt-0.5 me-1" />
        {isAr ? 'بيانات التواصل' : 'View Contact'}
      </button>
    );
  }
  return (
    <button onClick={() => onAccept(quote)} className={`${className} bg-[#596348] hover:bg-[#48503a] text-white`}>
      {isAr ? '✓ قبول وكشف التواصل' : '✓ Accept & Unlock'}
    </button>
  );
}

interface UnlockedContactModalProps {
  quote: SealedQuotation;
  contact: SupplierContact;
  onClose: () => void;
}

export default function UnlockedContactModal({ quote, contact, onClose }: UnlockedContactModalProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const rows = [
    { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'WhatsApp', value: contact.whatsapp, href: whatsappLink(contact, quote.rfq_id) },
    { icon: <Phone className="w-3.5 h-3.5" />, label: isAr ? 'الهاتف' : 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    { icon: <Mail className="w-3.5 h-3.5" />, label: isAr ? 'البريد' : 'Email', value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlocked-contact-title"
    >
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#b9aa95] pb-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-[#596348]">
              <Unlock className="w-3 h-3" />
              {isAr ? 'تم قبول العرض · تم كشف بيانات التواصل' : 'Quote accepted · contact unlocked'}
            </span>
            <h3 id="unlocked-contact-title" className="font-serif text-xl font-bold text-[#202522]">
              {quote.supplier_name}
            </h3>
            <p className="text-xs text-[#70695f]">{contact.contact_person}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="text-[#70695f] hover:text-[#202522] text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-[11px] text-[#565047] leading-relaxed">
          {isAr
            ? 'تمت مشاركة بياناتك مع المصدّر أيضاً. أكمل الصفقة مباشرة معه دون أي عمولة من المنصة.'
            : 'Your details have been shared with the exporter too. Close the deal directly with them — Market 365 takes no commission.'}
        </p>

        <div className="space-y-2 text-xs">
          {rows.map((row) => (
            <a
              key={row.label}
              href={row.href}
              target={row.label === 'WhatsApp' ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-[#eee8dc] border border-[#b9aa95] hover:border-[#202522] rounded transition-colors"
            >
              <span className="flex items-center gap-1.5 font-bold text-[#202522]">
                {row.icon}
                {row.label}
              </span>
              <span className="font-mono text-[#596348] font-bold truncate max-w-52" dir="ltr">
                {row.value}
              </span>
            </a>
          ))}
        </div>

        <p className="text-[10px] font-mono text-[#70695f]">
          {isAr ? 'مرات كشف التواصل اليوم' : 'Contact reveals today'}: {revealsUsedToday()}/{REVEAL_DAILY_LIMIT}
        </p>

        <div className="flex items-center gap-3">
          <a
            href={rows[0].href}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 bg-[#596348] hover:bg-[#48503a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isAr ? 'فتح محادثة واتساب' : 'Open WhatsApp Chat'}</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
