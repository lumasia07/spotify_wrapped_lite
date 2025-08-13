'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Music, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Animated Spotify Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-2xl opacity-50">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto animate-pulse"></div>
            </div>
            <div className="relative">
              <Music className="w-16 h-16 text-green-400 mx-auto animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Verifying Access
          </h2>
          
          <p className="text-gray-400 mb-6">
            Checking your Spotify connection...
          </p>
          
          {/* Loading Animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-0"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authenticated
  if (!isAuthenticated || !user) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Unauthorized Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-30">
                  <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                </div>
                <Shield className="w-16 h-16 text-red-400 relative" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Access Restricted
            </h1>

            <p className="text-gray-300 mb-6">
              You need to connect your Spotify account to access this page.
            </p>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-full transition-colors duration-200"
            >
              Connect with Spotify
            </button>

            <p className="text-xs text-gray-500 mt-4">
              🔒 Your music data is private and secure
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
