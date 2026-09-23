'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Lock, LogIn, UserPlus, ArrowLeft } from 'lucide-react';

interface VisitorGateProps {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon?: React.ReactNode;
}

export default function VisitorGate({
  titleEn,
  titleAr,
  descriptionEn,
  descriptionAr,
  icon = <Lock className="w-8 h-8" />,
}: VisitorGateProps) {
  const { language, direction } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div
      dir={direction}
      className={`min-h-[70vh] flex items-center justify-center p-6 bg-[#eee8dc] ${
        isArabic ? 'font-arabic' : 'font-sans'
      }`}
    >
      <div className="max-w-md w-full bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#9b452f]/10 border border-[#9b452f]/30 flex items-center justify-center mx-auto text-[#9b452f]">
          {icon}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#9b452f] block">
            {isArabic ? 'بوابة حماية للمسجلين فقط' : 'REGISTERED USERS ONLY GATE'}
          </span>
          <h2 className="text-2xl font-serif text-[#202522]">
            {isArabic ? titleAr : titleEn}
          </h2>
          <p className="text-xs text-[#70695f] leading-relaxed">
            {isArabic ? descriptionAr : descriptionEn}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/auth/register"
            className="w-full py-3 rounded-xl text-xs font-mono font-bold bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#c38b40]" />
            <span>
              {isArabic ? 'إنشاء حساب مجاني (سريع)' : 'Create Free Account'}
            </span>
          </Link>

          <Link
            href="/auth/login"
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] bg-[#eee8dc] transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#596348]" />
            <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#70695f] hover:text-[#202522] transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isArabic ? 'العودة للصفحة الرئيسية' : 'Return to Homepage'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
