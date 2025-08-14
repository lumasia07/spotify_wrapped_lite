'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';

interface SpotifyLoginButtonProps {
  className?: string;
}

const SpotifyLoginButton = ({ className = '' }: SpotifyLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotifyLogin = async () => {
    setIsLoading(true);
    
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      const currentOrigin = window.location.origin;
      
      // Determine the required origin based on environment
      const requiredOrigin = isProduction 
        ? 'https://spotify-wrapped-lite.vercel.app' 
        : 'http://127.0.0.1:3000';
      
      // Only redirect to correct domain in development
      if (!isProduction && currentOrigin !== requiredOrigin) {
        // Redirect to the correct domain first (development only)
        window.location.href = requiredOrigin + window.location.pathname;
        return;
      }
      
      // Generate state parameter and store it in both localStorage and sessionStorage
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('spotify_auth_state', state);
      sessionStorage.setItem('spotify_auth_state', state);
      
      // Get Spotify client ID from environment
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Spotify client ID not configured');
      }
      
      // Determine redirect URI based on environment
      const redirectUri = isProduction
        ? 'https://spotify-wrapped-lite.vercel.app/auth/callback'
        : 'http://127.0.0.1:3000/auth/callback';
      
      const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private user-library-read user-read-playback-state user-read-currently-playing';
      
      // Build Spotify authorization URL
      const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes,
        state: state,
        show_dialog: 'true'
      });
      
      // Redirect to Spotify OAuth
      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    } catch (error) {
      console.error('Failed to initiate Spotify login:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSpotifyLogin}
      disabled={isLoading}
      className={`
        group relative w-full flex items-center justify-center gap-3 
        bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 
        disabled:from-green-600 disabled:to-green-600 disabled:opacity-50
        text-black font-semibold py-4 px-6 rounded-2xl
        transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25
        disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        focus:outline-none focus:ring-4 focus:ring-green-500/30
        ${className}
      `}
      aria-label={isLoading ? 'Connecting to Spotify...' : 'Connect with Spotify'}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            <span className="text-lg font-semibold">Connecting...</span>
          </div>
        ) : (
          <>
            <Music className="w-6 h-6" />
            <span className="text-lg font-semibold">Connect with Spotify</span>
          </>
        )}
      </div>
    </button>
  );
};

export default SpotifyLoginButton;
