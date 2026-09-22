'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function AccessDenied() {
  const { currentUser, loginAs } = useAuth();
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#eee8dc]">
      <div className="max-w-md w-full bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-700/10 border border-rose-700/30 flex items-center justify-center mx-auto text-rose-800">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-800 font-bold">
            {language === 'ar'
              ? 'حاجز أمني 403 · صلاحية مقيدة'
              : 'SECURITY BARRIER 403 · RESTRICTED ACCESS'}
          </div>
          <h2 className="text-2xl font-serif text-[#202522]">
            {language === 'ar'
              ? 'تصريح الإدارة والرقابة مطلوب'
              : 'Administrator Clearance Required'}
          </h2>
          <p className="text-xs text-[#70695f] leading-relaxed">
            {language === 'ar' ? (
              <>
                هذه اللوحة مخصصة حصرياً للمسؤولين ومراجعي الحوكمة المعتمدين. دورك الحالي في النظام هو{' '}
                <span className="font-mono text-[#9b452f] font-bold">
                  {currentUser?.role || 'غير مسجل'}
                </span>
                .
              </>
            ) : (
              <>
                The requested console is strictly reserved for authorized platform administrators and governance auditors. Your current account role is{' '}
                <span className="font-mono text-[#9b452f] font-bold">
                  {currentUser?.role || 'UNAUTHENTICATED'}
                </span>
                .
              </>
            )}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          {/* Quick Demo Switcher to Admin */}
          <button
            onClick={() => loginAs('ADMIN')}
            className="w-full py-3 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {language === 'ar'
                ? 'التحويل لحساب المسؤول (د. هشام السيد)'
                : 'SWITCH TO ADMIN ACCOUNT (DR. HESHAM)'}
            </span>
          </button>

          <Link
            href="/admin/login"
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] bg-[#eee8dc] transition-colors flex items-center justify-center gap-2"
          >
            <span>
              {language === 'ar'
                ? 'تسجيل الدخول ببيانات المسؤول'
                : 'SIGN IN WITH ADMIN CREDENTIALS'}
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#70695f] hover:text-[#202522] transition-colors pt-2"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{language === 'ar' ? 'العودة للمنصة العامة' : 'Return to Public Marketplace'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
