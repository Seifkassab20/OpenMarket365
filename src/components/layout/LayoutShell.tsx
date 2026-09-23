'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isExporter = pathname?.startsWith('/exporter');
  const isImporter = pathname === '/importer' || pathname?.startsWith('/importer/');

  if (isAdmin || isExporter || isImporter) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
