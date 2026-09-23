'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AlertCircle, ArrowUpRight } from 'lucide-react';
import AnimatedCounter from '@/components/admin/AnimatedCounter';

interface QuotaCardProps {
  labelEn: string;
  labelAr: string;
  current: number;
  max: number;
  unitEn?: string;
  unitAr?: string;
  icon?: React.ReactNode;
  unlimited?: boolean;
}

export default function QuotaCard({
  labelEn,
  labelAr,
  current,
  max,
  unitEn = 'slots',
  unitAr = 'عنصر',
  icon,
  unlimited = false,
}: QuotaCardProps) {
  const { language } = useLanguage();
  const percentage = unlimited ? 0 : Math.min(100, Math.round((current / (max || 1)) * 100));
  const isNearLimit = !unlimited && percentage >= 85;
  const isAtLimit = !unlimited && current >= max;

  return (
    <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#70695f]">
          {language === 'ar' ? labelAr : labelEn}
        </span>
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#eee8dc] text-[#9b452f] border border-[#b9aa95]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-serif font-bold text-[#202522]">
          <AnimatedCounter end={current} duration={1200} />
          <span className="text-xs font-sans font-normal text-[#70695f] ml-1.5">
            / {unlimited ? (language === 'ar' ? 'غير محدود' : 'Unlimited') : `${max} ${language === 'ar' ? unitAr : unitEn}`}
          </span>
        </div>
        {!unlimited && (
          <span className={`text-xs font-mono font-bold ${isAtLimit ? 'text-rose-700' : isNearLimit ? 'text-[#c38b40]' : 'text-[#596348]'}`}>
            <AnimatedCounter end={percentage} suffix="%" duration={1200} />
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-[#eee8dc] border border-[#b9aa95] overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isAtLimit ? 'bg-rose-700' : isNearLimit ? 'bg-[#c38b40]' : 'bg-[#596348]'
          }`}
          style={{ width: unlimited ? '10%' : `${percentage}%` }}
        />
      </div>

      {/* Quota limit warning */}
      {isAtLimit ? (
        <div className="pt-1 flex items-center justify-between text-xs text-rose-800">
          <span className="flex items-center gap-1 font-semibold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {language === 'ar' ? 'تم الوصول للحد الأقصى' : 'Quota Limit Reached'}
          </span>
          <Link
            href="/exporter/subscription"
            className="text-[11px] font-bold underline flex items-center gap-0.5 hover:text-rose-950"
          >
            <span>{language === 'ar' ? 'ترقية الباقة' : 'Upgrade Plan'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      ) : isNearLimit ? (
        <div className="pt-1 text-[11px] text-[#c38b40] font-medium">
          {language === 'ar'
            ? `متبقي ${max - current} عناصر فقط في باقتك الحالية`
            : `${max - current} slots remaining in current billing cycle`}
        </div>
      ) : (
        <div className="pt-1 text-[11px] text-[#70695f]">
          {language === 'ar' ? 'الاستخدام ضمن الحدود المسموح بها' : 'Usage within authorized limits'}
        </div>
      )}
    </div>
  );
}
