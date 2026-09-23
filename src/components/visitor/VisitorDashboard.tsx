'use client';

import React from 'react';
import Hero from '@/components/home/Hero';
import MediaSpotlight from '@/components/home/MediaSpotlight';
import ProductsCatalogPage from '@/app/products/page';
import ExportersDirectoryPage from '@/app/exporters/page';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function VisitorDashboard() {
  return (
    <div className="flex flex-col bg-[#eee8dc]">
      {/* 1. Hero Section (Immediate Load) */}
      <Hero />

      {/* 2. Products Tab Merged */}
      <ScrollReveal id="products">
        <div className="py-12 border-t-8 border-[#202522]">
          <div className="text-center mb-4">
            <h2 className="font-serif text-4xl text-[#9b452f] tracking-widest uppercase">Explore Products</h2>
          </div>
          <ProductsCatalogPage />
        </div>
      </ScrollReveal>

      {/* 3. Exporters Directory Tab Merged */}
      <ScrollReveal id="directory">
        <div className="py-12 border-t-8 border-[#202522]">
          <div className="text-center mb-4">
            <h2 className="font-serif text-4xl text-[#9b452f] tracking-widest uppercase">Verified Exporters</h2>
          </div>
          <ExportersDirectoryPage />
        </div>
      </ScrollReveal>

      {/* 4. Media Spotlight Tab Merged */}
      <ScrollReveal id="media">
        <div className="py-12 border-t-8 border-[#202522]">
          <MediaSpotlight />
        </div>
      </ScrollReveal>
      
      {/* Final Call to Action */}
      <ScrollReveal>
        <section className="bg-[#202522] py-24 text-center px-4">
          <h2 className="font-serif text-4xl sm:text-5xl text-[#eee8dc] mb-6">Ready to join the market?</h2>
          <p className="text-[#b9aa95] max-w-2xl mx-auto mb-10">
            You've seen a glimpse of what OpenMarket365 has to offer. Create a free account to unlock full pricing, direct supplier contact, and live market boards.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/auth/register" className="px-8 py-4 bg-[#9b452f] text-white font-bold uppercase tracking-widest hover:bg-[#833824] transition-colors">
              Create Account
            </a>
            <a href="/auth/login" className="px-8 py-4 border-2 border-[#b9aa95] text-[#eee8dc] font-bold uppercase tracking-widest hover:bg-[#b9aa95] hover:text-[#202522] transition-colors">
              Sign In
            </a>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
