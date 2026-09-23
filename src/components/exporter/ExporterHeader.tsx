'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Globe,
  Bell,
  User,
  ShieldCheck,
  CreditCard,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ExporterHeaderProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  companyName?: string;
  planName?: string;
  isVerified?: boolean;
}

export default function ExporterHeader({
  isMobileOpen,
  setIsMobileOpen,
  companyName = 'Nile Agro Export Industries',
  planName = 'PREMIUM TIER',
  isVerified = true,
}: ExporterHeaderProps) {
  const router = useRouter();
  const { language, direction, toggleLanguage } = useLanguage();
  const { currentUser, logout } = useAuth();
  const isRtl = direction === 'rtl';

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    router.push('/auth/login');
  };

  const sampleNotifications = [
    {
      id: 'notif-1',
      titleEn: 'New Matching Buyer RFQ Lead',
      titleAr: 'طلب توريد جديد مطابق لمنتجاتك',
      descEn: 'EuroFresh Logistics requested 120 MT Valencia Oranges for Hamburg Port.',
      descAr: 'طلبت شركة يوروفريش 120 طن متري برتقال فالنسيا لميناء هامبورغ.',
      time: '15m ago',
      type: 'rfq',
    },
    {
      id: 'notif-2',
      titleEn: 'Certificate Compliance Active',
      titleAr: 'شهادة الجودة معتمدة',
      descEn: 'GlobalG.A.P. v6.0 verified by National Admin Desk.',
      descAr: 'تم اعتماد شهادة جلوبال جاب بواسطة مكتب الحوكمة الوطني.',
      time: '2h ago',
      type: 'cert',
    },
    {
      id: 'notif-3',
      titleEn: 'Quota Usage Reminder',
      titleAr: 'تنبيه حصة المنتجات',
      descEn: 'You have utilized 72 of 150 product slots (48%).',
      descAr: 'استخدمت 72 من أصل 150 منتج متاح بباقة بريميوم.',
      time: '1d ago',
      type: 'quota',
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#b9aa95] bg-[#eee8dc]/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Company / Verification Status */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#202522] hover:bg-[#e4dac9] lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company Identity Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-[#202522] leading-tight">
              {companyName}
            </span>
            <span className="text-[10px] text-[#70695f] font-mono">
              CR: 104928 • Ismailia Agro Zone
            </span>
          </div>

          {/* Verification Badge */}
          {isVerified && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#596348]/15 border border-[#596348]/30 text-[#2d7a58] text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2d7a58]" />
              <span className="hidden md:inline">
                {language === 'ar' ? 'سجل تجاري موثق' : 'CR VERIFIED'}
              </span>
            </span>
          )}

          {/* Tier Badge */}
          <Link
            href="/exporter/subscription"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9b452f]/10 border border-[#9b452f]/30 text-[#9b452f] hover:bg-[#9b452f] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider"
          >
            <CreditCard className="w-3 h-3" />
            <span>{planName}</span>
          </Link>
        </div>
      </div>

      {/* Right: Language, Notifications & Exporter Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex h-9 items-center gap-1.5 px-2.5 sm:px-3 rounded-lg border border-[#b9aa95] bg-[#e4dac9] text-xs font-bold text-[#202522] hover:bg-[#d8cebe] transition-colors shadow-sm"
          title={language === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
        >
          <Globe className="w-3.5 h-3.5 text-[#9b452f]" />
          <span>{language === 'en' ? 'عربي' : 'EN'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#b9aa95] bg-[#e4dac9] text-[#202522] hover:bg-[#d8cebe] transition-colors"
            title={language === 'ar' ? 'التنبيهات' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9b452f] text-[9px] font-bold text-white shadow-sm animate-pulse">
              3
            </span>
          </button>

          {notifOpen && (
            <div
              className={`absolute ${
                isRtl ? 'left-0' : 'right-0'
              } mt-2 w-80 rounded-xl border border-[#b9aa95] bg-[#eee8dc] p-3 shadow-2xl z-50 animate-in fade-in`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#b9aa95]">
                <span className="text-xs font-semibold text-[#202522]">
                  {language === 'ar' ? 'تنبيهات المصدر' : 'Supplier Notifications'}
                </span>
                <span className="text-[10px] text-[#9b452f] font-bold">3 Unread</span>
              </div>

              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-[#e4dac9] border border-[#b9aa95] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#9b452f]">
                        {language === 'ar' ? n.titleAr : n.titleEn}
                      </span>
                      <span className="text-[#70695f]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#202522]">
                      {language === 'ar' ? n.descAr : n.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#b9aa95] bg-[#e4dac9] p-1.5 pr-2.5 hover:bg-[#d8cebe] transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#c38b40] text-xs font-bold text-white uppercase">
              {currentUser.name ? currentUser.name.charAt(0) : 'T'}
            </div>
            <div className={`hidden sm:flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-xs font-semibold text-[#202522] leading-tight">
                {currentUser.name || 'Eng. Tarek Mansour'}
              </span>
              <span className="text-[9px] text-[#9b452f] font-mono leading-tight font-bold">
                EXPORT DIRECTOR
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#70695f] transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div
              className={`absolute ${
                isRtl ? 'left-0' : 'right-0'
              } mt-2 w-60 rounded-xl border border-[#b9aa95] bg-[#eee8dc] p-1.5 shadow-2xl z-50`}
            >
              <div className="px-3 py-2 border-b border-[#b9aa95]">
                <div className="text-xs font-semibold text-[#202522]">
                  {currentUser.name || 'Eng. Tarek Mansour'}
                </div>
                <div className="text-[11px] text-[#70695f] truncate font-mono">
                  {currentUser.email || 'export@nileagro-eg.com'}
                </div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/exporter/showroom"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#202522] hover:bg-[#e4dac9] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#70695f]" />
                  <span>{language === 'ar' ? 'ملف الشركة والمعرض' : 'Company Showroom'}</span>
                </Link>

                <Link
                  href="/exporter/subscription"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#202522] hover:bg-[#e4dac9] transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#70695f]" />
                  <span>{language === 'ar' ? 'باقة الاشتراك والحصص' : 'Subscription & Quotas'}</span>
                </Link>

                <Link
                  href="/exporters/nile-agro-export"
                  target="_blank"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#c38b40] font-semibold hover:bg-[#e4dac9] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'معاينة المعرض العام' : 'Public Showroom'}</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-[#b9aa95]">
                <button
                  onClick={handleSignOut}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-700 hover:bg-rose-500/10 transition-colors ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
