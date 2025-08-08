'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSpotifyLogos, LoaderConfig } from '../utils/loader';
import '../styles/loader.css';

interface SpotifyLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'pulse';
}

const SpotifyLoader: React.FC<SpotifyLoaderProps> = ({ 
  isLoading, 
  message = "Loading your Spotify experience...",
  className = "",
  variant = 'default'
}) => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const logos = getSpotifyLogos();

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % logos.length);
    }, LoaderConfig.logoAnimationDuration);

    return () => clearInterval(interval);
  }, [isLoading, logos.length]);

  if (!isLoading) return null;

  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 relative">
              <Image
                src={logos[currentLogoIndex]}
                alt="Spotify Logo"
                fill
                className="object-contain spotify-logo-animate"
              />
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 bg-green-500 rounded-full spotify-dot-bounce spotify-dot-${index + 1}`}
                />
              ))}
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 relative">
              <Image
                src={logos[currentLogoIndex]}
                alt="Spotify Logo"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-full spotify-dot-glow" />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center space-y-8">
            {/* Animated Spotify Logo */}
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              {logos.map((logo, index) => (
                <div
                  key={logo}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentLogoIndex
                      ? 'opacity-100 scale-110 spotify-fade-in'
                      : 'opacity-0 scale-90'
                  }`}
                >
                  <Image
                    src={logo}
                    alt="Spotify Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              ))}
            </div>

            {/* Loading Message */}
            <p className="text-white text-lg md:text-xl font-medium text-center px-4 max-w-md">
              {message}
            </p>

            {/* Animated Dots/Buttons */}
            <div className="flex space-x-3">
              {Array.from({ length: LoaderConfig.totalButtons }).map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 bg-green-500 rounded-full spotify-dot-bounce spotify-dot-glow spotify-dot-${index + 1}`}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      {renderVariant()}
    </div>
  );
};

export default SpotifyLoader;
