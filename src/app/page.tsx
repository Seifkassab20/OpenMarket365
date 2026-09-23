'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import FeaturedExporters from '@/components/home/FeaturedExporters';
import LiveOpportunities from '@/components/home/LiveOpportunities';
import MediaSpotlight from '@/components/home/MediaSpotlight';
import BrandIntroPages from '@/components/home/BrandIntroPages';
import VisitorDashboard from '@/components/visitor/VisitorDashboard';
import { useAuth } from '@/lib/context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [showIntro, setShowIntro] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const dismissed = sessionStorage.getItem('om365_brand_intro_dismissed');
      // If user hasn't seen the intro yet and is in visitor role, show full-page intro
      if (!dismissed && (!currentUser || currentUser.role === 'VISITOR')) {
        setShowIntro(true);
      }
    } catch (e) {
      // fallback
    }

    // Listen for custom trigger to replay intro as full page
    const handleReplay = () => {
      setShowIntro(true);
    };
    window.addEventListener('om365_open_intro', handleReplay);
    return () => window.removeEventListener('om365_open_intro', handleReplay);
  }, [currentUser]);

  // Show full-page editorial presentation if visitor hasn't dismissed yet
  if (isClient && showIntro) {
    return (
      <BrandIntroPages 
        onContinueAsVisitor={() => setShowIntro(false)} 
      />
    );
  }

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
