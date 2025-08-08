'use client';

import { useState } from 'react';

export interface LoaderProps {
  isLoading: boolean;
  message?: string;
}

export const useLoader = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};

export const getSpotifyLogos = () => [
  '/Spotify_Primary_Logo_RGB_Green.png',
  '/Spotify_Primary_Logo_RGB_White.png',
  '/Primary_Logo_White_RGB.svg',
];

export const LoaderConfig = {
  logoAnimationDuration: 1500, // milliseconds
  buttonBounceDelay: 200, // milliseconds between each button bounce
  totalButtons: 3,
};

// Utility function to simulate loading with promise
export const simulateLoading = async (duration: number = 2000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

// Higher-order component for adding loading state to async operations
export const withLoading = <T extends unknown[], R>(
  asyncFn: (...args: T) => Promise<R>,
  loader: ReturnType<typeof useLoader>
) => {
  return async (...args: T): Promise<R> => {
    loader.startLoading();
    try {
      const result = await asyncFn(...args);
      return result;
    } finally {
      loader.stopLoading();
    }
  };
};