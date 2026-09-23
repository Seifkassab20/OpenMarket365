'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ImporterRfqItem, RfqStatus } from '@/lib/services/importerService';

const STATUS_STYLE: Record<RfqStatus, { className: string; en: string; ar: string }> = {
  PENDING_REVIEW: { className: 'bg-[#c38b40]/20 text-[#8a5a1c] border border-[#c38b40]', en: 'Pending admin review', ar: 'قيد المراجعة' },
  REJECTED: { className: 'bg-[#9b452f] text-white', en: 'Rejected', ar: 'مرفوض' },
  RECEIVING_QUOTES: { className: 'bg-[#596348] text-white', en: 'Receiving quotes', ar: 'استقبال العروض' },
  UNDER_EVALUATION: { className: 'bg-[#c38b40] text-[#202522]', en: 'Under evaluation', ar: 'قيد التقييم' },
  CONTRACT_AWARDED: { className: 'bg-[#202522] text-[#eee8dc]', en: 'Quote accepted', ar: 'تم قبول عرض' },
  EXPIRED: { className: 'bg-[#b9aa95] text-[#202522]', en: 'Expired', ar: 'منتهي' },
};

export default function RfqStatusBadge({ status }: { status: RfqStatus }) {
  const { language } = useLanguage();
  const style = STATUS_STYLE[status];
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${style.className}`}>
      {language === 'ar' ? style.ar : style.en}
    </span>
  );
}

/** Quotes only exist once admin screening has broadcast the RFQ. */
export const isBroadcast = (rfq: ImporterRfqItem) => rfq.status !== 'PENDING_REVIEW' && rfq.status !== 'REJECTED';

/** Shown instead of the quotes button while an RFQ is held in moderation (US-ADM-04). */
export function ModerationNote({ rfq }: { rfq: ImporterRfqItem }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  if (rfq.status === 'REJECTED') {
    return (
      <p className="text-[11px] text-[#9b452f] max-w-60 sm:text-right">
        <strong>{isAr ? 'سبب الرفض: ' : 'Reason: '}</strong>
        {rfq.rejection_reason ?? (isAr ? 'لم يستوفِ معايير المراجعة.' : 'Did not pass admin screening.')}
      </p>
    );
  }
  return (
    <p className="text-[11px] text-[#70695f] max-w-60 sm:text-right">
      {isAr
        ? 'سيُرسل الطلب للمصدرين المطابقين بعد موافقة فريق المراجعة.'
        : 'Will be broadcast to matching exporters once the admin team approves it.'}
    </p>
  );
}
