'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  LayoutDashboard,
  Building2,
  Package,
  FileCheck2,
  Tv,
  FileSpreadsheet,
  Send,
  BarChart3,
  CreditCard,
  Gauge,
  User,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface ExporterSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  companyName?: string;
  isVerified?: boolean;
}

interface NavItem {
  labelEn: string;
  labelAr: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavSection {
  titleEn: string;
  titleAr: string;
  items: NavItem[];
}

export default function ExporterSidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  companyName = 'Nile Agro Export',
  isVerified = true,
}: ExporterSidebarProps) {
  const pathname = usePathname();
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const navSections: NavSection[] = [
    {
      titleEn: 'MAIN',
      titleAr: 'الرئيسية',
      items: [
        {
          labelEn: 'Overview',
          labelAr: 'نظرة عامة',
          href: '/exporter',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      titleEn: 'MY SHOWROOM',
      titleAr: 'معرضي الرقمي',
      items: [
        {
          labelEn: 'Company Profile',
          labelAr: 'ملف الشركة والمعرض',
          href: '/exporter/showroom',
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          labelEn: 'Products Catalog',
          labelAr: 'كتالوج المنتجات',
          href: '/exporter/products',
          icon: <Package className="w-4 h-4" />,
        },
        {
          labelEn: 'Certificates Vault',
          labelAr: 'خزينة شهادات الجودة',
          href: '/exporter/certificates',
          icon: <FileCheck2 className="w-4 h-4" />,
          badge: '4',
        },
        {
          labelEn: 'Media Showcase',
          labelAr: 'المعرض المرئي (فيديو 4K)',
          href: '/exporter/media',
          icon: <Tv className="w-4 h-4" />,
        },
      ],
    },
    {
      titleEn: 'PROCUREMENT',
      titleAr: 'التوريدات والمناقصات',
      items: [
        {
          labelEn: 'RFQ Leads',
          labelAr: 'طلبات التوريد المطابقة',
          href: '/exporter/rfqs',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          badge: '3 New',
        },
        {
          labelEn: 'My Commercial Quotes',
          labelAr: 'عروض الأسعار المقدمة',
          href: '/exporter/quotes',
          icon: <Send className="w-4 h-4" />,
        },
      ],
    },
    {
      titleEn: 'ANALYTICS',
      titleAr: 'التحليلات والأداء',
      items: [
        {
          labelEn: 'Showroom Analytics',
          labelAr: 'إحصائيات المشاهدات والطلبات',
          href: '/exporter/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    {
      titleEn: 'SUBSCRIPTION',
      titleAr: 'الاشتراك والباقة',
      items: [
        {
          labelEn: 'My Plan & Quotas',
          labelAr: 'باقتي وحصص الاستخدام',
          href: '/exporter/subscription',
          icon: <CreditCard className="w-4 h-4" />,
        },
      ],
    },
    {
      titleEn: 'SETTINGS',
      titleAr: 'الإعدادات والأمان',
      items: [
        {
          labelEn: 'Account & Security',
          labelAr: 'الحساب وإعدادات الأمان',
          href: '/exporter/settings',
          icon: <User className="w-4 h-4" />,
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

      {/* Sidebar container with Ink Theme and RTL position */}
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
        {/* Brand & Exporter Badge Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#363e39]">
          <Link
            href="/exporter"
            className="flex items-center gap-3 overflow-hidden text-decoration-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#9b452f] text-white font-bold text-sm shadow-md">
              ٣٦٥
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif text-sm font-semibold tracking-wide text-[#eee8dc] truncate">
                  {companyName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#c38b40]">
                    {language === 'ar' ? 'بوابة المصدر' : 'EXPORTER DESK'}
                  </span>
                  {isVerified && (
                    <span className="flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.2 bg-[#596348] text-white rounded-xs">
                      ✓ CR
                    </span>
                  )}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-[#b9aa95] hover:bg-[#2c332f] hover:text-[#eee8dc] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-200 ${
                isRtl
                  ? isCollapsed
                    ? ''
                    : 'rotate-180'
                  : isCollapsed
                  ? 'rotate-180'
                  : ''
              }`}
            />
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
                  item.href === '/exporter'
                    ? pathname === '/exporter'
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

                    {!isCollapsed && item.badge && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#9b452f] px-1.5 text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Area with Portal & Public Showroom Links */}
        <div className="border-t border-[#363e39] p-3 space-y-1.5">
          <Link
            href="/exporters/nile-agro-export"
            target="_blank"
            className={`flex items-center gap-2 rounded-lg bg-[#2c332f] px-3 py-2 text-xs text-[#c38b40] hover:text-white hover:bg-[#363e39] border border-[#3d4641] transition-all ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Preview Public Showroom"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && (
              <span className="font-semibold text-[11px]">
                {language === 'ar' ? 'معاينة المعرض العام' : 'Public Showroom'}
              </span>
            )}
          </Link>

          <Link
            href="/"
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-[#b9aa95] hover:text-[#eee8dc] hover:bg-[#2c332f] transition-all ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            {!isCollapsed && (
              <span className="text-[11px]">
                {language === 'ar' ? 'العودة للمنصة الرئيسية' : 'Return to Portal'}
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
