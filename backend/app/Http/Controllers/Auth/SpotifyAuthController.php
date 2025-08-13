<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SpotifyAuthController extends Controller
{
    /**
     * Redirect to Spotify OAuth
     */
    public function redirectToSpotify()
    {
        $clientId = config('services.spotify.client_id');
        $redirectUri = $this->getRedirectUri();
        $scopes = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private user-library-read user-read-playback-state user-read-currently-playing';
        
        $state = Str::random(40);
        session(['spotify_state' => $state]);
        
        $query = http_build_query([
            'client_id' => $clientId,
            'response_type' => 'code',
            'redirect_uri' => $redirectUri,
            'scope' => $scopes,
            'state' => $state,
            'show_dialog' => 'true'
        ]);
        
        return redirect('https://accounts.spotify.com/authorize?' . $query);
    }

    /**
     * Handle Spotify OAuth callback
     */
    public function handleSpotifyCallback(Request $request)
    {
        $code = $request->get('code');
        $state = $request->get('state');
        $error = $request->get('error');
        
        // Check for errors
        if ($error) {
            Log::error('Spotify OAuth error: ' . $error);
            return redirect($this->getFrontendUrl() . '?error=access_denied');
        }
        
        // Verify state parameter
        if (!$state || $state !== session('spotify_state')) {
            Log::error('Invalid state parameter in Spotify callback');
            return redirect($this->getFrontendUrl() . '?error=invalid_state');
        }
        
        try {
            // Exchange code for access token
            $tokenResponse = $this->getSpotifyAccessToken($code);
            
            if (!$tokenResponse) {
                throw new \Exception('Failed to get access token');
            }
            
            // Get user profile from Spotify
            $spotifyUser = $this->getSpotifyUserProfile($tokenResponse['access_token']);
            
            if (!$spotifyUser) {
                throw new \Exception('Failed to get user profile');
            }
            
            // Create or update user
            $user = $this->createOrUpdateUser($spotifyUser, $tokenResponse);
            
            // Log in the user
            Auth::login($user);
            
            // Create API token for frontend
            $token = $user->createToken('spotify-wrapped-lite')->plainTextToken;
            
            // Redirect to frontend with success - handle environment-based URLs
            $frontendUrl = $this->getFrontendUrl();
            return redirect($frontendUrl . '/auth/callback?token=' . urlencode($token));
            
        } catch (\Exception $e) {
            Log::error('Spotify OAuth callback error: ' . $e->getMessage());
            return redirect($this->getFrontendUrl() . '?error=oauth_failed');
        }
    }

    /**
     * Exchange authorization code for tokens (called by frontend)
     */
    public function exchangeCodeForToken(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'state' => 'required|string'
        ]);

        $code = $request->get('code');
        $state = $request->get('state');
        
        // Note: State validation is handled by the frontend since it generated the state
        // This approach is suitable for API-only authentication flows
        
        try {
            // Exchange code for access token
            $tokenResponse = $this->getSpotifyAccessToken($code);
            
            if (!$tokenResponse) {
                throw new \Exception('Failed to get access token');
            }
            
            // Get user profile from Spotify
            $spotifyUser = $this->getSpotifyUserProfile($tokenResponse['access_token']);
            
            if (!$spotifyUser) {
                throw new \Exception('Failed to get user profile');
            }
            
            // Create or update user
            $user = $this->createOrUpdateUser($spotifyUser, $tokenResponse);
            
            // Log in the user
            Auth::login($user);
            
            // Create API token for frontend
            $token = $user->createToken('spotify-wrapped-lite')->plainTextToken;
            
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'spotify_id' => $user->spotify_id,
                    'avatar_url' => $user->avatar_url,
                    'spotify_display_name' => $user->spotify_display_name,
                    'country' => $user->country,
                    'product' => $user->product,
                    'followers_count' => $user->followers_count,
                    'explicit_content_filter' => $user->explicit_content_filter,
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Spotify code exchange error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Authentication failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh Spotify access token
     */
    public function refreshToken(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !$user->spotify_refresh_token) {
            return response()->json(['error' => 'No refresh token available'], 401);
        }
        
        try {
            $tokenResponse = $this->refreshSpotifyAccessToken($user->spotify_refresh_token);
            
            if (!$tokenResponse) {
                throw new \Exception('Failed to refresh token');
            }
            
            // Update user tokens
            $user->update([
                'spotify_access_token' => $tokenResponse['access_token'],
                'spotify_token_expires_at' => now()->addSeconds($tokenResponse['expires_in']),
            ]);
            
            return response()->json([
                'success' => true,
                'access_token' => $tokenResponse['access_token'],
                'expires_in' => $tokenResponse['expires_in']
            ]);
            
        } catch (\Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            return response()->json(['error' => 'Token refresh failed'], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = Auth::user();
        
        if ($user) {
            // Revoke all tokens
            $user->tokens()->delete();
            
            // Clear Spotify tokens
            $user->update([
                'spotify_access_token' => null,
                'spotify_refresh_token' => null,
                'spotify_token_expires_at' => null,
            ]);
        }
        
        Auth::logout();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get current authenticated user
     */
    public function getUser(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'spotify_id' => $user->spotify_id,
            'avatar_url' => $user->avatar_url,
            'spotify_display_name' => $user->spotify_display_name,
            'country' => $user->country,
            'product' => $user->product,
            'followers_count' => $user->followers_count,
            'explicit_content_filter' => $user->explicit_content_filter,
        ]);
    }

    /**
     * Exchange authorization code for access token
     */
    private function getSpotifyAccessToken($code)
    {
        $response = Http::asForm()->post('https://accounts.spotify.com/api/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->getRedirectUri(),
            'client_id' => config('services.spotify.client_id'),
            'client_secret' => config('services.spotify.client_secret'),
        ]);
        
        if (!$response->successful()) {
            Log::error('Spotify token exchange failed: ' . $response->body());
            return null;
        }
        
        return $response->json();
    }

    /**
     * Refresh Spotify access token
     */
    private function refreshSpotifyAccessToken($refreshToken)
    {
        $response = Http::asForm()->post('https://accounts.spotify.com/api/token', [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => config('services.spotify.client_id'),
            'client_secret' => config('services.spotify.client_secret'),
        ]);
        
        if (!$response->successful()) {
            Log::error('Spotify token refresh failed: ' . $response->body());
            return null;
        }
        
        return $response->json();
    }

    /**
     * Get user profile from Spotify API
     */
    private function getSpotifyUserProfile($accessToken)
    {
        $response = Http::withToken($accessToken)
            ->get('https://api.spotify.com/v1/me');
        
        if (!$response->successful()) {
            Log::error('Spotify user profile fetch failed: ' . $response->body());
            return null;
        }
        
        return $response->json();
    }

    /**
     * Create or update user from Spotify profile
     */
    private function createOrUpdateUser($spotifyUser, $tokenResponse)
    {
        $user = User::firstOrCreate(
            ['spotify_id' => $spotifyUser['id']],
            [
                'name' => $spotifyUser['display_name'] ?? $spotifyUser['id'],
                'email' => $spotifyUser['email'] ?? null,
                'spotify_display_name' => $spotifyUser['display_name'],
                'avatar_url' => isset($spotifyUser['images'][0]['url']) ? $spotifyUser['images'][0]['url'] : null,
                'country' => $spotifyUser['country'] ?? null,
                'product' => $spotifyUser['product'] ?? null,
                'followers_count' => isset($spotifyUser['followers']['total']) ? $spotifyUser['followers']['total'] : null,
                'explicit_content_filter' => isset($spotifyUser['explicit_content']['filter_enabled']) ? $spotifyUser['explicit_content']['filter_enabled'] : null,
            ]
        );
        
        // Update user profile data and tokens
        $user->update([
            'name' => $spotifyUser['display_name'] ?? $spotifyUser['id'],
            'email' => $spotifyUser['email'] ?? $user->email,
            'spotify_display_name' => $spotifyUser['display_name'],
            'avatar_url' => isset($spotifyUser['images'][0]['url']) ? $spotifyUser['images'][0]['url'] : $user->avatar_url,
            'country' => $spotifyUser['country'] ?? $user->country,
            'product' => $spotifyUser['product'] ?? $user->product,
            'followers_count' => isset($spotifyUser['followers']['total']) ? $spotifyUser['followers']['total'] : $user->followers_count,
            'explicit_content_filter' => isset($spotifyUser['explicit_content']['filter_enabled']) ? $spotifyUser['explicit_content']['filter_enabled'] : $user->explicit_content_filter,
            'spotify_access_token' => $tokenResponse['access_token'],
            'spotify_refresh_token' => $tokenResponse['refresh_token'] ?? $user->spotify_refresh_token,
            'spotify_token_expires_at' => now()->addSeconds($tokenResponse['expires_in']),
        ]);
        
        return $user;
    }

    /**
     * Get frontend URL based on environment
     */
    private function getFrontendUrl(): string
    {
        // Check if we're in production environment
        if (config('app.env') === 'production') {
            return config('app.frontend_url_prod', 'https://spotify-wrapped-lite.vercel.app');
        }
        
        // For local development
        return config('app.frontend_url', 'http://localhost:3000');
    }

    /**
     * Get redirect URI based on environment
     */
    private function getRedirectUri(): string
    {
        // Check if we're in production environment
        if (config('app.env') === 'production') {
            return config('services.spotify.redirect_uri_prod', 'https://spotify-wrapped-lite.vercel.app/auth/callback');
        }
        
        // For local development - matches your registered Spotify URI
        return config('services.spotify.redirect_uri', 'http://127.0.0.1:3000/auth/callback');
    }
}
