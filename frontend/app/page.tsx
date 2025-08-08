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
  const loader = useLoader(true); // Start with loading true
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time for components - extended for better UX
    const loadComponents = async () => {
      // Extended loading time (4-5 seconds) for more immersive experience
      await new Promise(resolve => setTimeout(resolve, 4500));
      
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
        message="Loading your Spotify experience..."
        variant="default"
      />

      {/* Main Content - Only show when loaded */}
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
