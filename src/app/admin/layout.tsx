'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/admin/ToastNotification';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AccessDenied from '@/components/admin/AccessDenied';
import { DashboardSkeleton } from '@/components/admin/LoadingSkeleton';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { isChecking, isAdmin, adminUser } = useAdminAuth(!isLoginPage);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  // If on login page, render clean auth canvas with webapp colors
  if (isLoginPage) {
    return (
      <ToastProvider>
        <div
          dir={direction}
          className={`min-h-screen bg-[#eee8dc] text-[#202522] selection:bg-[#9b452f] selection:text-white ${
            language === 'ar' ? 'font-arabic' : 'font-sans'
          }`}
        >
          {children}
        </div>
      </ToastProvider>
    );
  }

  // Loading state
  if (isChecking) {
    return (
      <div
        dir={direction}
        className={`min-h-screen bg-[#eee8dc] p-8 text-[#202522] ${
          language === 'ar' ? 'font-arabic' : 'font-sans'
        }`}
      >
        <DashboardSkeleton />
      </div>
    );
  }

  // Not authorized state
  if (!isAdmin) {
    return (
      <div
        dir={direction}
        className={`min-h-screen bg-[#eee8dc] flex items-center justify-center p-6 text-[#202522] ${
          language === 'ar' ? 'font-arabic' : 'font-sans'
        }`}
      >
        <AccessDenied />
      </div>
    );
  }

  // Authorized Admin View matching webapp colors
  return (
    <ToastProvider>
      <div
        dir={direction}
        className={`min-h-screen bg-[#eee8dc] text-[#202522] selection:bg-[#9b452f] selection:text-white antialiased ${
          language === 'ar' ? 'font-arabic' : 'font-sans'
        }`}
      >
        {/* Persistent Sidebar */}
        <AdminSidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content Area */}
        <div
          className={`flex min-h-screen flex-col transition-all duration-300 ${
            isRtl
              ? isCollapsed
                ? 'lg:pr-20 lg:pl-0'
                : 'lg:pr-64 lg:pl-0'
              : isCollapsed
              ? 'lg:pl-20 lg:pr-0'
              : 'lg:pl-64 lg:pr-0'
          }`}
        >
          {/* Persistent Topbar */}
          <AdminTopbar
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            adminUser={adminUser}
          />

          {/* Dynamic Route Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-[#eee8dc]">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
