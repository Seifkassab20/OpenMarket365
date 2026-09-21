'use client';

import Hero from '@/components/home/Hero';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import FeaturedExporters from '@/components/home/FeaturedExporters';
import LiveOpportunities from '@/components/home/LiveOpportunities';
import MediaSpotlight from '@/components/home/MediaSpotlight';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryExplorer />
      <FeaturedExporters />
      <LiveOpportunities />
      <MediaSpotlight />
    </div>
  );
}
