'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth, UserRoleType } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  Ship, 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const { language, direction, t } = useLanguage();
  const { loginAs } = useAuth();
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
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-6 border-b border-[#b9aa95]">
        <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] flex items-center justify-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          <span>09 / ACCESS GATEWAY • 4 PERSONAS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#202522] tracking-tight">
          {language === 'ar' ? 'بوابة الدخول الموحدة.' : 'Sign in to Market 365.'}
        </h1>
        <p className="text-sm text-[#70695f] leading-relaxed">
          {language === 'ar' 
            ? 'سجل دخولك كزائر بدون حساب، أو كمصدر مصري، أو مستورد دولي، أو مسؤول رقابي.'
            : 'Access the gateway as a Visitor (no login needed), Egyptian Exporter, Global Importer, or Platform Admin.'
          }
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-[#e4dac9] border border-[#b9aa95] mt-4">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'quick'
                ? 'bg-[#202522] text-[#eee8dc] border-[#202522]'
                : 'text-[#565047] border-transparent hover:text-[#202522]'
            }`}
          >
            {language === 'ar' ? 'دخول سريع بالحسابات (4 أدوار)' : 'One-Click Persona Access'}
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'credentials'
                ? 'bg-[#202522] text-[#eee8dc] border-[#202522]'
                : 'text-[#565047] border-transparent hover:text-[#202522]'
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
          <div className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] p-6 flex flex-col justify-between transition-all group shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#202522]">
                <Eye className="w-5 h-5" />
              </div>

              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#202522] text-[#eee8dc] inline-block mb-1.5">
                  NO LOGIN NEEDED
                </span>
                <h3 className="text-xl font-serif text-[#202522]">
                  {language === 'ar' ? 'زائر عام (بدون تسجيل)' : 'Visitor / Guest'}
                </h3>
                <p className="text-xs text-[#565047] mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'تصفح دليل المنتجات الزراعية والمصانع المعتمدة، ابحث عن أكواد HS، وشاهد حلقات برنامج هنقدر.'
                    : 'Browse public export catalog, inspect certified packing stations, search HS codes, and watch TV episodes.'
                  }
                </p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] space-y-1.5 text-[11px] text-[#565047]">
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Public Directory Browsing</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Port Distressed Lots</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#70695f]">
                  <span>• Contacts Masked (Anti-Scraping)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#b9aa95]">
              <button
                onClick={() => handleQuickLogin('VISITOR', '/products')}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{language === 'ar' ? 'الدخول كزائر مباشرة' : 'Continue as Visitor'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona 2: Egyptian Exporter */}
          <div className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#9b452f] p-6 flex flex-col justify-between transition-all group shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#9b452f]">
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#9b452f] text-white inline-block mb-1.5">
                  ROLE: EXPORTER
                </span>
                <h3 className="text-xl font-serif text-[#202522]">
                  {language === 'ar' ? 'مصدر مصري معتمد' : 'Egyptian Exporter'}
                </h3>
                <p className="text-[11px] font-mono text-[#9b452f] mt-0.5">
                  Nile Agro Export Industries
                </p>
                <p className="text-xs text-[#565047] mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'إدارة منتجات المعرض، متابعة حصص التخزين وفيديو 4K، والرد على مناقصات المشترين بعروض أسعار مغلقة.'
                    : 'Manage showroom catalog, monitor storage & 4K tour quotas, respond to buyer RFQs with sealed bids.'
                  }
                </p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] space-y-1.5 text-[11px] text-[#565047]">
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Exporter Control Workspace</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Aweta Specs & Cold Storage</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Sealed Bidding Engine</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#b9aa95]">
              <button
                onClick={() => handleQuickLogin('EXPORTER', '/dashboard/exporter')}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{language === 'ar' ? 'الدخول كمصدر مصري' : 'Login as Exporter'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona 3: Global Importer / Buyer */}
          <div className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#596348] p-6 flex flex-col justify-between transition-all group shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#596348]">
                <Ship className="w-5 h-5" />
              </div>

              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white inline-block mb-1.5">
                  ROLE: IMPORTER
                </span>
                <h3 className="text-xl font-serif text-[#202522]">
                  {language === 'ar' ? 'مستورد ومشتري دولي' : 'Global Importer'}
                </h3>
                <p className="text-[11px] font-mono text-[#596348] mt-0.5">
                  EuroFresh Logistics (Rotterdam)
                </p>
                <p className="text-xs text-[#565047] mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'طرح طلبات التوريد RFQ، فك حظر أرقام الواتساب والهاتف للمصانع، وتلقي عروض الأسعار المباشرة.'
                    : 'Post international RFQs, unlock direct WhatsApp & phone numbers for all packhouses, and view FOB/CIF quotes.'
                  }
                </p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] space-y-1.5 text-[11px] text-[#565047]">
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Direct WhatsApp Unlocked</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Post Buyer RFQ Demands</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Receive Sealed Bids</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#b9aa95]">
              <button
                onClick={() => handleQuickLogin('IMPORTER', '/rfqs')}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#596348] hover:bg-[#48503a] text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{language === 'ar' ? 'الدخول كمستورد دولي' : 'Login as Importer'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Persona 4: Platform Admin */}
          <div className="bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] p-6 flex flex-col justify-between transition-all group shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center text-[#202522]">
                <ShieldAlert className="w-5 h-5" />
              </div>

              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#202522] text-[#eee8dc] inline-block mb-1.5">
                  ROLE: ADMIN
                </span>
                <h3 className="text-xl font-serif text-[#202522]">
                  {language === 'ar' ? 'مسؤول الرقابة والإدارة' : 'Platform Admin'}
                </h3>
                <p className="text-[11px] font-mono text-[#70695f] mt-0.5">
                  Governance & Audit Authority
                </p>
                <p className="text-xs text-[#565047] mt-2 leading-relaxed">
                  {language === 'ar'
                    ? 'مراجعة وتدقيق السجلات التجارية، فحص شهادات الأيزو والجلوبال جاب، واعتماد التحويلات البنكية وكود فوري.'
                    : 'Verify Commercial Registration (CR) files, audit Certificate Vault, and approve offline Wire / Fawry payments.'
                  }
                </p>
              </div>

              <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] space-y-1.5 text-[11px] text-[#565047]">
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>CR Verification Queue</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Certificate Vault Audit</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#202522] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#596348]" />
                  <span>Payment Ledger Approvals</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#b9aa95]">
              <button
                onClick={() => handleQuickLogin('ADMIN', '/dashboard/admin')}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{language === 'ar' ? 'الدخول كمسؤول رقابي' : 'Login as Admin'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Custom Credentials Form */
        <div className="max-w-md mx-auto bg-[#e4dac9] border border-[#b9aa95] p-8 shadow-sm">
          <div className="mb-6 text-center pb-4 border-b border-[#b9aa95]">
            <h3 className="text-2xl font-serif text-[#202522]">
              {language === 'ar' ? 'تسجيل الدخول المخصص' : 'Custom Account Login'}
            </h3>
            <p className="text-xs text-[#70695f] mt-1">
              {language === 'ar' ? 'حدد الدور وادخل البريد التجاري وكلمة المرور' : 'Select role and authenticate via Supabase Auth'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-[#9b452f]/10 border border-[#9b452f] text-[#9b452f] text-xs">
              {errorMsg}
            </div>
          )}

          {/* Quick Prefill Selector */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#70695f] mb-1.5">
              {language === 'ar' ? 'اختر الحساب للتعبئة السريعة:' : 'Quick Select Account Persona:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => prefillCredentials('EXPORTER', 'export@nileagro-eg.com')}
                className={`p-2 text-xs font-bold border text-center transition-all ${
                  selectedRoleForLogin === 'EXPORTER'
                    ? 'bg-[#9b452f] text-white border-[#9b452f]'
                    : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#202522]'
                }`}
              >
                Exporter
              </button>
              <button
                type="button"
                onClick={() => prefillCredentials('IMPORTER', 'procurement@eurofresh-logistics.de')}
                className={`p-2 text-xs font-bold border text-center transition-all ${
                  selectedRoleForLogin === 'IMPORTER'
                    ? 'bg-[#596348] text-white border-[#596348]'
                    : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#202522]'
                }`}
              >
                Importer
              </button>
              <button
                type="button"
                onClick={() => prefillCredentials('ADMIN', 'compliance@openmarket365.gov.eg')}
                className={`p-2 text-xs font-bold border text-center transition-all ${
                  selectedRoleForLogin === 'ADMIN'
                    ? 'bg-[#202522] text-[#eee8dc] border-[#202522]'
                    : 'bg-[#eee8dc] border-[#b9aa95] text-[#565047] hover:border-[#202522]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'البريد الإلكتروني التجاري' : 'Business Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#70695f] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522]">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <a href="#" className="text-[10px] text-[#9b452f] hover:underline font-bold uppercase tracking-wider">
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot?'}
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#70695f] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:border-[#202522] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') : t('navSignIn')}</span>
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-[#b9aa95] text-xs text-[#565047]">
            <span>{language === 'ar' ? 'أو تصفح بدون تسجيل:' : 'Or explore with no login:'} </span>
            <button
              type="button"
              onClick={() => handleQuickLogin('VISITOR', '/products')}
              className="text-[#9b452f] font-bold hover:underline ml-1"
            >
              {language === 'ar' ? 'دخول كزائر عام' : 'Continue as Visitor'}
            </button>
          </div>
        </div>
      )}

      {/* Registration Footer */}
      <div className="text-center pt-6 text-xs text-[#70695f] border-t border-[#b9aa95]">
        <span>{language === 'ar' ? 'ليس لديك حساب بعد؟' : "Don't have an export or buyer account yet?"} </span>
        <Link href="/auth/register" className="text-[#9b452f] font-bold hover:underline uppercase tracking-wider">
          {language === 'ar' ? 'سجل كمصدر مصري أو مشتري دولي الآن' : 'Create an Account'}
        </Link>
      </div>
    </div>
  );
}

