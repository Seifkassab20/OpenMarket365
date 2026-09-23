'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { importerService, ImporterNotification } from '@/lib/services/importerService';
import {
  Globe,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  CheckCircle2,
  Ship,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ImporterHeaderProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  buyerName?: string;
  hubLocation?: string;
}

export default function ImporterHeader({
  isMobileOpen,
  setIsMobileOpen,
  buyerName = 'EuroFresh Logistics GmbH (Germany)',
  hubLocation = 'Rotterdam / Hamburg Gateway',
}: ImporterHeaderProps) {
  const router = useRouter();
  const { language, direction, toggleLanguage } = useLanguage();
  const { currentUser, loginAs, logout } = useAuth();
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

  // FR-NOT-001: quote arrivals and RFQ moderation outcomes.
  const [notifications, setNotifications] = useState<ImporterNotification[]>([]);
  useEffect(() => {
    importerService.getNotifications().then(setNotifications).catch(() => setNotifications([]));
  }, []);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#b9aa95] bg-[#eee8dc]/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Buyer Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#202522] hover:bg-[#e4dac9] lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-[#202522] leading-tight">
              {buyerName}
            </span>
            <span className="text-[10px] text-[#70695f] font-mono">
              Hub: {hubLocation} • EU Sourcing Desk
            </span>
          </div>

        </div>
      </div>

      {/* Right Controls: Quick Search, Language Switch, Notifications, Persona Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Post RFQ quick CTA button */}
        <Link
          href="/importer/new-rfq"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
        >
          <span>{language === 'ar' ? '+ طلب توريد' : '+ Post RFQ'}</span>
        </Link>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex h-9 items-center gap-1 rounded-lg border border-[#b9aa95] bg-[#e4dac9] px-2.5 text-xs font-bold text-[#202522] hover:bg-[#dfd4c1] transition-colors"
          title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
        >
          <Globe className="w-3.5 h-3.5 text-[#596348]" />
          <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#b9aa95] bg-[#e4dac9] text-[#202522] hover:bg-[#dfd4c1] transition-colors"
            title="Sourcing Notifications"
            aria-label={language === 'ar' ? `التنبيهات (${unreadCount} جديدة)` : `Notifications (${unreadCount} new)`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#9b452f]" />}
          </button>

          {notifOpen && (
            <div
              className={`absolute top-11 z-50 w-80 sm:w-96 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-3 shadow-xl ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#b9aa95]/60 pb-2 mb-2">
                <span className="text-xs font-serif font-bold text-[#202522]">
                  {language === 'ar' ? 'تنبيهات المشتريات والعروض' : 'Notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono text-[#9b452f] font-bold">
                    {unreadCount} {language === 'ar' ? 'جديد' : 'NEW'}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="p-2.5 text-[11px] text-[#70695f]">
                    {language === 'ar' ? 'لا توجد تنبيهات.' : 'No notifications yet.'}
                  </p>
                )}
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    onClick={() => setNotifOpen(false)}
                    className={`block p-2.5 rounded-lg border text-xs transition-colors hover:border-[#202522] ${
                      notif.unread
                        ? 'bg-[#eee8dc] border-[#9b452f]/40 text-[#202522]'
                        : 'bg-[#e4dac9]/60 border-transparent text-[#70695f]'
                    }`}
                  >
                    <div className="font-bold mb-0.5 truncate">
                      {language === 'ar' ? notif.titleAr : notif.titleEn}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#565047]">
                      {language === 'ar' ? notif.descAr : notif.descEn}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-[#b9aa95]/60 text-center">
                <Link
                  href="/importer/quotes"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-bold text-[#9b452f] hover:underline"
                >
                  {language === 'ar' ? 'عرض كل العروض المستلمة' : 'View all sealed quotations →'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Persona Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#b9aa95] bg-[#e4dac9] px-2.5 text-xs text-[#202522] hover:bg-[#dfd4c1] transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#596348] text-white font-bold text-[10px]">
              MW
            </div>
            <span className="hidden sm:inline font-semibold">Markus Weber</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#70695f]" />
          </button>

          {profileOpen && (
            <div
              className={`absolute top-11 z-50 w-64 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-3 shadow-xl ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              <div className="border-b border-[#b9aa95]/60 pb-2 mb-2">
                <div className="text-xs font-bold text-[#202522]">Markus Weber</div>
                <div className="text-[10px] text-[#70695f] font-mono truncate">
                  procurement@eurofresh-logistics.de
                </div>
                <div className="mt-1 inline-flex items-center gap-1 rounded bg-[#596348] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  ROLE: GLOBAL IMPORTER
                </div>
              </div>

              {/* Persona Switchers */}
              <div className="py-1 space-y-1">
                <div className="text-[9px] font-mono text-[#70695f] uppercase tracking-wider px-1">
                  {language === 'ar' ? 'التبديل لحساب آخر' : 'Switch Operational Desk'}
                </div>

                <button
                  onClick={() => {
                    loginAs('EXPORTER');
                    setProfileOpen(false);
                    router.push('/exporter');
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-[#202522] hover:bg-[#dfd4c1] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#9b452f]" />
                    <span>Nile Agro (Exporter)</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#9b452f]">Desk</span>
                </button>

                <button
                  onClick={() => {
                    loginAs('ADMIN');
                    setProfileOpen(false);
                    router.push('/admin');
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-[#202522] hover:bg-[#dfd4c1] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#202522]" />
                    <span>Gov Desk (Admin)</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#202522]">Desk</span>
                </button>
              </div>

              <div className="border-t border-[#b9aa95]/60 pt-2 mt-2 space-y-1">
                <Link
                  href="/importer/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-[#202522] hover:bg-[#dfd4c1]"
                >
                  <User className="w-3.5 h-3.5 text-[#596348]" />
                  <span>{language === 'ar' ? 'إعدادات الحساب' : 'Buyer Profile Settings'}</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-[#9b452f] hover:bg-[#dfd4c1] transition-colors"
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
