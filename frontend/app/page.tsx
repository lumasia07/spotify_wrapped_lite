'use client';

import { useEffect, useState } from 'react';
import { SpotifyLoader, useLoader } from './loader';
import { 
  HeroSection, 
  FeaturesSection, 
  StorySection, 
  StatsSection, 
  FooterSection 
} from './homepage_components';

export default function Home() {
  const loader = useLoader(true);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    const loadComponents = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setComponentsLoaded(true);
      loader.stopLoading();
    };

    loadComponents();
  }, [loader]);

  return (
    <>
      {/* Spotify Loader */}
      <SpotifyLoader 
        isLoading={loader.isLoading}
        message="Curating your perfect playlist..."
        variant="default"
      />

      {/* Main Content */}
      {componentsLoaded && (
        <div className="min-h-screen">
          <HeroSection />
          <FeaturesSection />
          <StorySection />
          <StatsSection />
          <FooterSection />
        </div>
      )}
    </>
  );
}
