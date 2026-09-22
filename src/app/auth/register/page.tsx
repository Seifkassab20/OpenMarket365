'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase/client';
import { Building2, Globe2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/lib/types/database.types';

export default function RegisterPage() {
  const { language, direction, t } = useLanguage();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>('EXPORTER');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('EGY');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ArrowIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
            user_role: role,
            country_code: countryCode,
            business_phone: phone,
            whatsapp_number: whatsapp,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard/exporter');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-[#e4dac9] border border-[#b9aa95] p-8 shadow-sm relative">
        <div className="text-center mb-8 pb-4 border-b border-[#b9aa95]">
          <div className="w-10 h-10 bg-[#9b452f] text-white flex items-center justify-center mx-auto mb-3 font-arabic font-bold text-sm">
            ٣٦٥
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b452f] block mb-1">
            ONBOARDING REGISTRY
          </span>
          <h2 className="text-3xl font-serif text-[#202522]">
            {language === 'ar' ? 'إنشاء حساب تجاري رسمي' : 'Create Trade Account.'}
          </h2>
          <p className="text-xs text-[#70695f] mt-1">
            {language === 'ar' ? 'انضم إلى شبكة التصدير المصرية المعتمدة' : 'Join Egypt’s National Verified B2B Export Gateway'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#9b452f]/10 border border-[#9b452f] text-[#9b452f] text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1.5">
              {language === 'ar' ? 'نوع النشاط التجاري' : 'Account Role'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#eee8dc] border border-[#b9aa95] text-xs">
              <button
                type="button"
                onClick={() => setRole('EXPORTER')}
                className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                  role === 'EXPORTER' ? 'bg-[#9b452f] text-white border-[#9b452f]' : 'text-[#70695f] border-transparent hover:text-[#202522]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مصدّر مصري' : 'Exporter'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('REPORTER')}
                className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                  role === 'REPORTER' ? 'bg-[#596348] text-white border-[#596348]' : 'text-[#70695f] border-transparent hover:text-[#202522]'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مشتري دولي' : 'Importer'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Eng. Mohamed Ali"
                className="w-full px-3.5 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'اسم الشركة / المنشأة' : 'Company Name'}
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nile Agro Export Ltd"
                className="w-full px-3.5 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'البريد الإلكتروني التجاري' : 'Business Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="export@company.com"
                className="w-full px-3.5 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'هاتف العمل' : 'Business Phone'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full px-3.5 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'رقم الواتساب التجاري' : 'WhatsApp Number'}
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full px-3.5 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? (language === 'ar' ? 'جاري التسجيل...' : 'Creating Account...') : (language === 'ar' ? 'تأكيد التسجيل' : 'Register Account')}</span>
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-[#b9aa95] text-xs text-[#565047]">
          <span>{language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'} </span>
          <Link href="/auth/login" className="text-[#9b452f] font-bold hover:underline uppercase tracking-wider">
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}

