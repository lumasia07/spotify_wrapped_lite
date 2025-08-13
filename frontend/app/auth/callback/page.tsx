'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Music, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to Spotify...');
  const processedRef = useRef(false);

  const handleAuthCallback = useCallback(async () => {
    // Prevent multiple executions (React Strict Mode causes useEffect to run twice)
    if (processedRef.current) {
      return;
    }
    
    // Mark as processed immediately to prevent re-runs
    processedRef.current = true;
    
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        switch (error) {
          case 'access_denied':
            setMessage('Authentication was cancelled. You can try again anytime.');
            break;
          case 'invalid_state':
            setMessage('Security validation failed. Please try again.');
            break;
          case 'oauth_failed':
            setMessage('Connection failed. Please check your internet and try again.');
            break;
          default:
            setMessage('Something went wrong. Please try again.');
        }
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      // Handle direct token (legacy flow)
      if (token) {
        try {
          // Store the token
          localStorage.setItem('auth_token', token);
          
          // Get backend URL with fallback - be more flexible for different devices
          const getBackendUrl = () => {
            // If we have an explicit backend URL set, use it
            if (process.env.NEXT_PUBLIC_BACKEND_URL) {
              return process.env.NEXT_PUBLIC_BACKEND_URL;
            }
            
            // In production, use the production backend
            if (window.location.origin.includes('vercel.app')) {
              return 'https://spotify-wrapped-lite.onrender.com';
            }
            
            // For development, try to determine the backend URL
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
              return 'http://127.0.0.1:8000';
            } else {
              // For other local network access, assume backend is on port 8000
              return `http://${hostname}:8000`;
            }
          };
          
          const backendUrl = getBackendUrl();
          
          // Fetch user data
          const response = await fetch(`${backendUrl}/api/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            login(userData);
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard'), 1500);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          localStorage.removeItem('auth_token');
          setStatus('error');
          setMessage('Failed to complete authentication. Please try again.');
          setTimeout(() => router.push('/'), 3000);
        }
      } 
      // Handle code exchange (new flow)
      else if (code && state) {
        try {
          setMessage('Validating authentication...');
          
          // Validate state parameter - check both localStorage and sessionStorage
          const storedStateLocal = localStorage.getItem('spotify_auth_state');
          const storedStateSession = sessionStorage.getItem('spotify_auth_state');
          const storedState = storedStateLocal || storedStateSession;
          
          console.log('State validation:', { 
            received: state, 
            storedLocal: storedStateLocal, 
            storedSession: storedStateSession 
          });
          
          if (!storedState || storedState !== state) {
            console.error('State mismatch:', { received: state, stored: storedState });
            throw new Error('Invalid state parameter. Possible CSRF attack.');
          }
          
          // Clear stored state from both storages
          localStorage.removeItem('spotify_auth_state');
          sessionStorage.removeItem('spotify_auth_state');
          
          setMessage('Exchanging authorization code...');
          
          // Get backend URL with fallback - be more flexible for different devices
          const getBackendUrl = () => {
            // If we have an explicit backend URL set, use it
            if (process.env.NEXT_PUBLIC_BACKEND_URL) {
              return process.env.NEXT_PUBLIC_BACKEND_URL;
            }
            
            // In production, use the production backend
            if (window.location.origin.includes('vercel.app')) {
              return 'https://spotify-wrapped-lite.onrender.com';
            }
            
            // For development, try to determine the backend URL
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
              return 'http://127.0.0.1:8000';
            } else {
              // For other local network access, assume backend is on port 8000
              return `http://${hostname}:8000`;
            }
          };
          
          const backendUrl = getBackendUrl();
          
          // Exchange code for token
          const response = await fetch(`${backendUrl}/api/auth/spotify/exchange`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ code, state }),
          });

          if (response.ok) {
            const data = await response.json();
            
            // Store the token
            localStorage.setItem('auth_token', data.token);
            
            // Login with user data
            login(data.user);
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            setTimeout(() => router.push('/dashboard'), 1500);
          } else {
            const errorData = await response.json();
            console.error('Backend exchange error:', errorData);
            throw new Error(errorData.message || 'Failed to exchange authorization code');
          }
        } catch (error) {
          console.error('Auth code exchange error:', error);
          setStatus('error');
          setMessage('Failed to complete authentication. Please try again.');
          setTimeout(() => router.push('/'), 3000);
        }
      } else {
        setStatus('error');
        setMessage('No authentication token or code received. Please try again.');
        setTimeout(() => router.push('/'), 3000);
      }
  }, [searchParams, login, router]);

  useEffect(() => {
    handleAuthCallback();
  }, [handleAuthCallback]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-green-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Music className="w-16 h-16 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-800 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>

        {/* Status Message */}
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'loading' && 'Connecting to Spotify'}
          {status === 'success' && 'Welcome!'}
          {status === 'error' && 'Connection Failed'}
        </h2>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
          {message}
        </p>

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}

        {/* Error action button */}
        {status === 'error' && (
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black font-semibold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            Try Again
          </button>
        )}

        {/* Success redirect info */}
        {status === 'success' && (
          <div className="text-sm text-gray-400">
            Redirecting to dashboard...
          </div>
        )}
      </div>
    </div>
  );
};

// Loading fallback component
const AuthCallbackLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-800 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
          Loading...
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
          Preparing authentication...
        </p>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const AuthCallback = () => {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
};

export default AuthCallback;
