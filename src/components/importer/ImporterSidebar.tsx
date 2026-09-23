'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Scale,
  Settings,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Globe,
  PlusCircle,
} from 'lucide-react';

interface ImporterSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  buyerName?: string;
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

export default function ImporterSidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  buyerName = 'EuroFresh Logistics GmbH',
}: ImporterSidebarProps) {
  const pathname = usePathname();
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const navSections: NavSection[] = [
    {
      titleEn: 'MAIN',
      titleAr: 'الرئيسية',
      items: [
        {
          labelEn: 'Procurement Desk',
          labelAr: 'لوحة المشتريات',
          href: '/importer',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      titleEn: 'SOURCING & RFQS',
      titleAr: 'المناقصات والطلبات',
      items: [
        {
          labelEn: 'Active Sourcing RFQs',
          labelAr: 'طلبات التوريد المفتوحة',
          href: '/importer/rfqs',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          badge: '4',
        },
        {
          labelEn: 'Post New RFQ Demand',
          labelAr: 'طرح طلب توريد جديد',
          href: '/importer/new-rfq',
          icon: <PlusCircle className="w-4 h-4" />,
        },
        {
          labelEn: 'Sealed Quotes Matrix',
          labelAr: 'مقارنة عروض الأسعار',
          href: '/importer/quotes',
          icon: <Scale className="w-4 h-4" />,
          badge: '14 Bids',
        },
      ],
    },
    {
      titleEn: 'ACCOUNT',
      titleAr: 'الحساب والتحليلات',
      items: [
        {
          labelEn: 'Buyer Profile & Ports',
          labelAr: 'ملف المشتري والموانئ',
          href: '/importer/settings',
          icon: <Settings className="w-4 h-4" />,
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
        {/* Brand & Importer Badge Header */}
        <div
          className={`flex h-16 items-center border-b border-[#363e39] ${
            isCollapsed ? 'justify-center' : 'px-4'
          }`}
        >
          <Link
            href="/importer"
            className="flex items-center gap-3 overflow-hidden text-decoration-none"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#596348] text-white font-bold text-sm shadow-md">
              ٣٦٥
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif text-sm font-semibold tracking-wide text-[#eee8dc] truncate">
                  {buyerName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#c38b40]">
                    {language === 'ar' ? 'بوابة المستورد الدولي' : 'IMPORTER DESK'}
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button, pinned to the sidebar edge so it never crowds the logo */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex absolute top-5 z-10 h-6 w-6 items-center justify-center rounded-full border border-[#363e39] bg-[#202522] text-[#b9aa95] hover:bg-[#2c332f] hover:text-[#eee8dc] shadow-md transition-colors ${
              isRtl ? '-left-3' : '-right-3'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed
                  ? isRtl
                    ? 'rotate-0'
                    : 'rotate-180'
                  : isRtl
                  ? 'rotate-180'
                  : 'rotate-0'
              }`}
            />
          </button>
        </div>

        {/* Navigation Sections */}
        <div
          className={`flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-[#363e39] ${
            isCollapsed ? 'space-y-1' : 'space-y-6'
          }`}
        >
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-[#70695f] uppercase">
                  {language === 'ar' ? section.titleAr : section.titleEn}
                </div>
              )}

              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/importer' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#9b452f] text-white font-bold shadow-sm'
                        : 'text-[#c9bda8] hover:bg-[#2c332f] hover:text-[#eee8dc]'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? (language === 'ar' ? item.labelAr : item.labelEn) : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>

                    {!isCollapsed && (
                      <span className="flex-1 truncate">
                        {language === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#363e39] text-[#c38b40]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <div
                        className={`absolute z-50 hidden rounded-md bg-[#202522] border border-[#363e39] px-2.5 py-1.5 text-xs text-[#eee8dc] whitespace-nowrap shadow-xl group-hover:block ${
                          isRtl ? 'right-full mr-2' : 'left-full ml-2'
                        }`}
                      >
                        {language === 'ar' ? item.labelAr : item.labelEn}
                        {item.badge && ` (${item.badge})`}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Quick Links */}
        <div className="p-3 border-t border-[#363e39] space-y-2">
          {!isCollapsed ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 px-2 py-1 text-[11px] text-[#70695f] hover:text-[#eee8dc] transition-colors"
              >
                {isRtl ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                <span>{language === 'ar' ? 'العودة للمنصة العامة' : 'Return to Marketplace'}</span>
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#70695f] hover:text-[#eee8dc] hover:bg-[#2c332f]"
                title="Return to Marketplace"
              >
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
