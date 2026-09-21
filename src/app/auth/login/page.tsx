'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth, UserRoleType } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { 
  LogIn, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Globe,
  Ship,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  Eye,
  Sparkles,
  KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const { language, direction, t } = useLanguage();
  const { loginAs, currentUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRoleType>('EXPORTER');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  // 1-Click Role Direct Logins
  const handleQuickLogin = (role: UserRoleType, redirectPath: string) => {
    loginAs(role);
    router.push(redirectPath);
  };

  // Custom Credentials Login
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo credentials or unseeded accounts
        loginAs(selectedRoleForLogin, email);
        if (selectedRoleForLogin === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (selectedRoleForLogin === 'EXPORTER') {
          router.push('/dashboard/exporter');
        } else if (selectedRoleForLogin === 'IMPORTER') {
          router.push('/rfqs');
        } else {
          router.push('/products');
        }
      } else {
        loginAs(selectedRoleForLogin, email);
        if (selectedRoleForLogin === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (selectedRoleForLogin === 'EXPORTER') {
          router.push('/dashboard/exporter');
        } else {
          router.push('/products');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const prefillCredentials = (role: UserRoleType, demoEmail: string) => {
    setSelectedRoleForLogin(role);
    setEmail(demoEmail);
    setPassword('DemoPass2026!');
    setActiveTab('credentials');
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-goldBorder text-brand-gold text-xs font-bold shadow-gold">
          <KeyRound className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بوابة الدخول الموحدة' : 'Unified Platform Access'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {language === 'ar' ? 'تسجيل الدخول إلى OpenMarket365' : 'Sign In to OpenMarket365'}
        </h1>
        <p className="text-xs sm:text-sm text-brand-dim">
          {language === 'ar' 
            ? 'سجل دخولك كزائر بدون حساب، أو كمصدر مصري، أو مستورد دولي، أو مسؤول رقابي.'
            : 'Access the platform as a Visitor (no login needed), Egyptian Exporter, Global Importer, or Platform Admin.'
          }
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-white/5 border border-brand-border mt-4">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quick'
                ? 'bg-brand-gold text-brand-dark shadow-gold'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            {language === 'ar' ? 'دخول سريع بالحسابات (4 أدوار)' : 'One-Click Role Access (4 Personas)'}
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'credentials'
                ? 'bg-brand-gold text-brand-dark shadow-gold'
                : 'text-brand-muted hover:text-white'
            }`}
          >
            {language === 'ar' ? 'بيانات مخصصة (البريد وكلمة السر)' : 'Custom Credentials'}
          </button>
        </div>
      </div>

      {activeTab === 'quick' ? (
        /* 4-Role Persona Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Persona 1: Visitor (Without a Login) */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-blue-500/30 hover:border-blue-400 transition-all duration-300 group shadow-card">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 inline-block mb-1.5">
                  NO LOGIN NEEDED
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  {language === 'ar' ? 'زائر عام (بدون تسجيل)' : 'Visitor / Guest'}
                </h3>
                <p className="text-xs text-brand-dim mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'تصفح دليل المنتجات الزراعية والمصانع المعتمدة، ابحث عن أكواد HS، وشاهد حلقات برنامج هنقدر.'
                    : 'Browse public export catalog, inspect certified packing stations, search HS codes, and watch TV episodes.'
                  }
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 space-y-1.5 text-[11px] text-brand-muted">
                <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Public Directory Browsing</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Port Distressed Lots</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-dim">
                  <span>• Contacts Masked (Anti-Scraping)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-border/60">
              <button
                onClick={() => handleQuickLogin('VISITOR', '/products')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-lg"
              >
                <span>{language === 'ar' ? 'الدخول كزائر مباشرة' : 'Continue as Visitor'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona 2: Egyptian Exporter */}
          <div className="glass-panel-gold rounded-3xl p-6 flex flex-col justify-between border border-brand-goldBorder hover:border-brand-gold transition-all duration-300 group shadow-card">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-goldBorder flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-goldBorder inline-block mb-1.5">
                  ROLE: EXPORTER
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                  {language === 'ar' ? 'مصدر مصري معتمد' : 'Egyptian Exporter'}
                </h3>
                <p className="text-[11px] font-medium text-brand-gold mt-1">
                  Nile Agro Export Industries
                </p>
                <p className="text-xs text-brand-dim mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'إدارة منتجات المعرض، متابعة حصص التخزين وفيديو 4K، والرد على مناقصات المشترين بعروض أسعار مغلقة.'
                    : 'Manage showroom catalog, monitor storage & 4K tour quotas, respond to buyer RFQs with sealed bids.'
                  }
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 space-y-1.5 text-[11px] text-brand-muted">
                <div className="flex items-center gap-1.5 text-brand-gold font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exporter Control Workspace</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-gold font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aweta Specs & Cold Storage</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-gold font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sealed Bidding Engine</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-border/60">
              <button
                onClick={() => handleQuickLogin('EXPORTER', '/dashboard/exporter')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-gold"
              >
                <span>{language === 'ar' ? 'الدخول كمصدر مصري' : 'Login as Exporter'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona 3: Global Importer / Buyer */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-brand-emeraldLight/40 hover:border-brand-emeraldLight transition-all duration-300 group shadow-card">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emeraldLight/30 flex items-center justify-center text-brand-emeraldLight group-hover:scale-110 transition-transform">
                <Ship className="w-6 h-6" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-emeraldDark text-brand-emeraldLight border border-brand-emeraldLight/30 inline-block mb-1.5">
                  ROLE: IMPORTER
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-emeraldLight transition-colors">
                  {language === 'ar' ? 'مستورد ومشتري دولي' : 'Global Importer'}
                </h3>
                <p className="text-[11px] font-medium text-brand-emeraldLight mt-1">
                  EuroFresh Logistics (Rotterdam)
                </p>
                <p className="text-xs text-brand-dim mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'طرح طلبات التوريد RFQ، فك حظر أرقام الواتساب والهاتف للمصانع، وتلقي عروض الأسعار المباشرة.'
                    : 'Post international RFQs, unlock direct WhatsApp & phone numbers for all packhouses, and view FOB/CIF quotes.'
                  }
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 space-y-1.5 text-[11px] text-brand-muted">
                <div className="flex items-center gap-1.5 text-brand-emeraldLight font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Direct WhatsApp Unlocked</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-emeraldLight font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Post Buyer RFQ Demands</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-emeraldLight font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Receive Sealed Bids</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-border/60">
              <button
                onClick={() => handleQuickLogin('IMPORTER', '/rfqs')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white transition-all flex items-center justify-center gap-1.5 shadow-emerald"
              >
                <span>{language === 'ar' ? 'الدخول كمستورد دولي' : 'Login as Importer'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona 4: Platform Admin */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-purple-500/40 hover:border-purple-400 transition-all duration-300 group shadow-card">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 inline-block mb-1.5">
                  ROLE: ADMIN
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {language === 'ar' ? 'مسؤول الرقابة والإدارة' : 'Platform Admin'}
                </h3>
                <p className="text-[11px] font-medium text-purple-400 mt-1">
                  Governance & Audit Authority
                </p>
                <p className="text-xs text-brand-dim mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'مراجعة وتدقيق السجلات التجارية، فحص شهادات الأيزو والجلوبال جاب، واعتماد التحويلات البنكية وكود فوري.'
                    : 'Verify Commercial Registration (CR) files, audit Certificate Vault, and approve offline Wire / Fawry payments.'
                  }
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 space-y-1.5 text-[11px] text-brand-muted">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CR Verification Queue</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Certificate Vault Audit</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payment Ledger Approvals</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-border/60">
              <button
                onClick={() => handleQuickLogin('ADMIN', '/dashboard/admin')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-lg"
              >
                <span>{language === 'ar' ? 'الدخول كمسؤول رقابي' : 'Login as Admin'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Custom Credentials Form */
        <div className="max-w-md mx-auto glass-panel-gold rounded-3xl p-8 border border-brand-goldBorder shadow-2xl">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-white">
              {language === 'ar' ? 'تسجيل الدخول المخصص' : 'Custom Account Login'}
            </h3>
            <p className="text-xs text-brand-dim mt-1">
              {language === 'ar' ? 'حدد الدور وادخل البريد التجاري وكلمة المرور' : 'Select role and authenticate via Supabase Auth'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Quick Prefill Selector */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold text-brand-dim mb-1.5 uppercase">
              {language === 'ar' ? 'اختر الحساب للتعبئة السريعة:' : 'Quick Select Account Persona:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => prefillCredentials('EXPORTER', 'export@nileagro-eg.com')}
                className={`p-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                  selectedRoleForLogin === 'EXPORTER'
                    ? 'bg-brand-gold text-brand-dark border-brand-gold'
                    : 'bg-white/5 border-brand-border text-brand-muted hover:text-white'
                }`}
              >
                Exporter
              </button>
              <button
                type="button"
                onClick={() => prefillCredentials('IMPORTER', 'procurement@eurofresh-logistics.de')}
                className={`p-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                  selectedRoleForLogin === 'IMPORTER'
                    ? 'bg-brand-emeraldLight text-brand-dark border-brand-emeraldLight'
                    : 'bg-white/5 border-brand-border text-brand-muted hover:text-white'
                }`}
              >
                Importer
              </button>
              <button
                type="button"
                onClick={() => prefillCredentials('ADMIN', 'compliance@openmarket365.gov.eg')}
                className={`p-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                  selectedRoleForLogin === 'ADMIN'
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white/5 border-brand-border text-brand-muted hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                {language === 'ar' ? 'البريد الإلكتروني التجاري' : 'Business Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-dim absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-brand-muted">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <a href="#" className="text-[11px] text-brand-gold hover:underline">
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-dim absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark hover:brightness-110 active:scale-98 transition-all shadow-gold flex items-center justify-center gap-2 mt-6"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') : t('navSignIn')}</span>
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-brand-border/60 text-xs text-brand-muted">
            <span>{language === 'ar' ? 'أو تصفح بدون تسجيل:' : 'Or explore with no login:'} </span>
            <button
              type="button"
              onClick={() => handleQuickLogin('VISITOR', '/products')}
              className="text-brand-gold font-bold hover:underline ml-1"
            >
              {language === 'ar' ? 'دخول كزائر عام' : 'Continue as Visitor'}
            </button>
          </div>
        </div>
      )}

      {/* Registration Footer */}
      <div className="text-center pt-6 text-xs text-brand-dim">
        <span>{language === 'ar' ? 'ليس لديك حساب بعد؟' : "Don't have an export or buyer account yet?"} </span>
        <Link href="/auth/register" className="text-brand-gold font-bold hover:underline">
          {language === 'ar' ? 'سجل كمصدر مصري أو مشتري دولي الآن' : 'Create an Exporter or Buyer Account'}
        </Link>
      </div>
    </div>
  );
}
