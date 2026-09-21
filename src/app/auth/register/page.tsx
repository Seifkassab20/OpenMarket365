'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase/client';
import { Building2, UserCheck, ShieldCheck, Mail, Lock, Phone, Globe2, ArrowRight, ArrowLeft } from 'lucide-react';
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
      <div className="max-w-lg w-full glass-panel-gold rounded-3xl p-8 border border-brand-goldBorder shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-amber via-brand-gold to-brand-goldDark flex items-center justify-center mx-auto mb-4 font-bold text-brand-dark text-xl shadow-gold">
            365
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {language === 'ar' ? 'إنشاء حساب تجاري رسمي' : 'Create Trade Account'}
          </h2>
          <p className="text-xs text-brand-dim mt-1">
            {language === 'ar' ? 'انضم إلى شبكة التصدير المصرية المعتمدة' : 'Join Egypt’s National Verified B2B Export Gateway'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">
              {language === 'ar' ? 'نوع النشاط التجاري' : 'Account Role'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-brand-border text-xs">
              <button
                type="button"
                onClick={() => setRole('EXPORTER')}
                className={`py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'EXPORTER' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-brand-muted hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'مصدّر مصري (محطة / مصنع)' : 'Egyptian Exporter'}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('REPORTER')}
                className={`py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'REPORTER' ? 'bg-brand-emerald text-white shadow-sm' : 'text-brand-muted hover:text-white'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'مشتري دولي (مستورد)' : 'Global Importer'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Eng. Mohamed Ali"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'اسم الشركة / المنشأة' : 'Company Name'}
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nile Agro Export Ltd"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'البريد الإلكتروني التجاري' : 'Business Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="export@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'هاتف العمل' : 'Business Phone'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'رقم الواتساب التجاري' : 'WhatsApp Number'}
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark hover:brightness-110 active:scale-98 transition-all shadow-gold flex items-center justify-center gap-2 mt-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? (language === 'ar' ? 'جاري التسجيل...' : 'Creating Account...') : (language === 'ar' ? 'تأكيد التسجيل' : 'Register Account')}</span>
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-brand-border/60 text-xs text-brand-muted">
          <span>{language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'} </span>
          <Link href="/auth/login" className="text-brand-gold font-bold hover:underline">
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}
