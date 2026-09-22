'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ArrowRight, ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ExporterDashboardRedirect() {
  const router = useRouter();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    // Automatically redirect to the dedicated SRS v4.0 Exporter Portal
    router.replace('/exporter');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#eee8dc]">
      <div className="max-w-md w-full bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-8 text-center space-y-6 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#9b452f]/10 border border-[#9b452f]/30 flex items-center justify-center mx-auto text-[#9b452f]">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f] block">
            {isAr ? 'بوابة المصدرين المعتمدين' : 'SUPPLIER PORTAL SRS V4.0'}
          </span>
          <h2 className="text-xl font-serif font-bold text-[#202522]">
            {isAr ? 'جارِ التحويل إلى لوحة المصدر المخصصة...' : 'Redirecting to Exporter Portal...'}
          </h2>
          <p className="text-xs text-[#70695f] leading-relaxed">
            {isAr
              ? 'تم تحديث بوابة المصدرين بالكامل لتدعم إدارة المعرض الرقمي، خزينة الشهادات، والعطاءات المشفرة.'
              : 'The dedicated supplier portal has been loaded with full showroom management, certification vault, and sealed RFQ leads.'}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/exporter"
            className="w-full py-3 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{isAr ? 'الدخول إلى بوابة المصدرين الآن' : 'LAUNCH EXPORTER PORTAL'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
