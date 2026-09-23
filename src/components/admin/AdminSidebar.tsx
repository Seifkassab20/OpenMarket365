'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  pendingCounts?: {
    companies?: number;
    subscriptions?: number;
    certificates?: number;
    rfqs?: number;
    notifications?: number;
  };
}

interface NavItem {
  labelEn: string;
  labelAr: string;
  href: string;
  badge?: number;
  icon: React.ReactNode;
}

interface NavSection {
  titleEn: string;
  titleAr: string;
  items: NavItem[];
}

export default function AdminSidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  pendingCounts = {
    companies: 2,
    subscriptions: 3,
    certificates: 1,
    rfqs: 4,
    notifications: 5,
  },
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const navSections: NavSection[] = [
    {
      titleEn: 'DASHBOARD & INTELLIGENCE',
      titleAr: 'لوحة التحكم والذكاء',
      items: [
        {
          labelEn: 'Overview',
          labelAr: 'نظرة عامة',
          href: '/admin',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
        },
        {
          labelEn: 'Analytics Desk',
          labelAr: 'منصة التحليلات',
          href: '/admin/analytics',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
        {
          labelEn: 'AI & Telemetry',
          labelAr: 'الذكاء الاصطناعي والمؤشرات',
          href: '/admin/ai',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        },
      ],
    },
    {
      titleEn: 'MEMBERS & ROLES',
      titleAr: 'الأعضاء والأدوار',
      items: [
        {
          labelEn: 'User Roster',
          labelAr: 'حسابات المستخدمين',
          href: '/admin/users',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          labelEn: 'Roles & Permissions',
          labelAr: 'الأدوار والصلاحيات',
          href: '/admin/roles',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
        {
          labelEn: 'Exporter Facilities',
          labelAr: 'محطات وشركات التصدير',
          href: '/admin/companies',
          badge: pendingCounts.companies,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
      ],
    },
    {
      titleEn: 'TRADE & COMPLIANCE',
      titleAr: 'التجارة والامتثال',
      items: [
        {
          labelEn: 'Commodity Catalog',
          labelAr: 'دليل السلع والمنتجات',
          href: '/admin/products',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          labelEn: 'Bank Wires & Plans',
          labelAr: 'الحوالات البنكية والاشتراكات',
          href: '/admin/subscriptions',
          badge: pendingCounts.subscriptions,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
        },
        {
          labelEn: 'Compliance Vault',
          labelAr: 'خزينة شهادات الجودة',
          href: '/admin/certificates',
          badge: pendingCounts.certificates,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          labelEn: 'Tender RFQs',
          labelAr: 'مناقصات وطلبات التوريد',
          href: '/admin/rfqs',
          badge: pendingCounts.rfqs,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          labelEn: 'Distressed Cargo',
          labelAr: 'بضائع الموانئ العاجلة',
          href: '/admin/market-listings',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      titleEn: 'SECURITY & SYSTEM',
      titleAr: 'الأمان والنظام',
      items: [
        {
          labelEn: 'Anti-Scraping Defense',
          labelAr: 'مكافحة السحب والقرصنة',
          href: '/admin/security',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
        },
        {
          labelEn: 'TV Media & Video Wall',
          labelAr: 'برنامج نعم نستطيع والفيديو',
          href: '/admin/media',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          labelEn: 'Notifications',
          labelAr: 'الإشعارات والتنبيهات',
          href: '/admin/notifications',
          badge: pendingCounts.notifications,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ),
        },
        {
          labelEn: 'Audit Trail Logs',
          labelAr: 'سجل التدقيق والعمليات',
          href: '/admin/audit-logs',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          labelEn: 'Platform Settings',
          labelAr: 'إعدادات المنصة',
          href: '/admin/settings',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          labelEn: 'Admin Profile',
          labelAr: 'الملف الشخصي للمسؤول',
          href: '/admin/profile',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container: WebApp Ink Theme with RTL positioning */}
      <aside
        className={`fixed top-0 bottom-0 z-50 flex flex-col bg-[#202522] ${
          isRtl ? 'right-0 border-l border-r-0' : 'left-0 border-r border-l-0'
        } border-[#363e39] text-[#eee8dc] transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#363e39]">
          <Link
            href="/admin"
            className="flex items-center gap-3 overflow-hidden text-decoration-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#9b452f] text-white font-bold text-sm shadow-md">
              ٣٦٥
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-serif text-base font-semibold tracking-wide text-[#eee8dc]">
                  {language === 'ar' ? 'سوق ٣٦٥' : 'Market 365'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#c38b40]">
                  {language === 'ar' ? 'بوابة الإدارة المركزية' : 'Admin Gateway'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-[#b9aa95] hover:bg-[#2c332f] hover:text-[#eee8dc] transition-colors"
            title={
              isCollapsed
                ? language === 'ar'
                  ? 'توسيع القائمة'
                  : 'Expand Sidebar'
                : language === 'ar'
                ? 'طي القائمة'
                : 'Collapse Sidebar'
            }
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isRtl
                  ? isCollapsed
                    ? ''
                    : 'rotate-180'
                  : isCollapsed
                  ? 'rotate-180'
                  : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Stream */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#363e39]">
          {navSections.map((section) => (
            <div key={section.titleEn} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold tracking-wider text-[#b9aa95] uppercase">
                  {language === 'ar' ? section.titleAr : section.titleEn}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                const currentLabel = language === 'ar' ? item.labelAr : item.labelEn;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? currentLabel : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-[#eee8dc] text-[#9b452f] font-bold shadow-sm'
                        : 'text-[#b9aa95] hover:bg-[#2c332f] hover:text-[#eee8dc]'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#9b452f]'
                          : 'text-[#b9aa95] group-hover:text-[#eee8dc]'
                      }`}
                    >
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{currentLabel}</span>
                    )}

                    {!isCollapsed && Boolean(item.badge && item.badge > 0) && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#9b452f] px-1 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Area with Site Switcher */}
        <div className="border-t border-[#363e39] p-3">
          <Link
            href="/"
            className={`flex items-center gap-2 rounded-lg bg-[#2c332f] px-3 py-2 text-xs text-[#b9aa95] hover:text-[#eee8dc] hover:bg-[#363e39] border border-[#3d4641] transition-all ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <svg className="w-4 h-4 shrink-0 text-[#c38b40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {!isCollapsed && (
              <span>{language === 'ar' ? 'العودة للموقع الرئيسي' : 'Return to Portal'}</span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
