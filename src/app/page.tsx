'use client';

import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import FeaturedExporters from '@/components/home/FeaturedExporters';
import LiveOpportunities from '@/components/home/LiveOpportunities';
import MediaSpotlight from '@/components/home/MediaSpotlight';
import VisitorDashboard from '@/components/visitor/VisitorDashboard';
import { useAuth } from '@/lib/context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();

  // If visitor is unregistered/guest, show visitor dashboard
  if (!currentUser || currentUser.role === 'VISITOR') {
    return <VisitorDashboard />;
  }

  // For logged in users, show the full marketplace homepage
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
