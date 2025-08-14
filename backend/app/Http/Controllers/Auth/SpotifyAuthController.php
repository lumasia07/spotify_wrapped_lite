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
        
        Log::info('Code exchange request received', [
            'code_length' => strlen($code),
            'code_preview' => substr($code, 0, 10) . '...',
            'state' => $state,
            'user_agent' => $request->header('User-Agent', 'Unknown'),
            'ip' => $request->ip(),
            'environment' => config('app.env')
        ]);
        
        // Note: State validation is handled by the frontend since it generated the state
        // This approach is suitable for API-only authentication flows
        
        try {
            Log::info('Starting token exchange process');
            
            // Exchange code for access token
            $tokenResponse = $this->getSpotifyAccessToken($code);
            
            if (!$tokenResponse) {
                Log::error('Token exchange failed - no response from Spotify');
                throw new \Exception('Failed to get access token');
            }
            
            Log::info('Token exchange successful, fetching user profile');
            
            // Get user profile from Spotify
            $spotifyUser = $this->getSpotifyUserProfile($tokenResponse['access_token']);
            
            if (!$spotifyUser) {
                Log::error('User profile fetch failed after successful token exchange');
                throw new \Exception('Failed to get user profile');
            }
            
            Log::info('User profile fetched successfully, creating/updating user');
            
            // Create or update user
            $user = $this->createOrUpdateUser($spotifyUser, $tokenResponse);
            
            // Log in the user
            Auth::login($user);
            
            // Create API token for frontend
            $token = $user->createToken('spotify-wrapped-lite')->plainTextToken;
            
            Log::info('Authentication completed successfully', [
                'user_id' => $user->id,
                'spotify_id' => $user->spotify_id
            ]);
            
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
            Log::error('Spotify code exchange error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'code_preview' => substr($code, 0, 10) . '...',
                'user_agent' => $request->header('User-Agent', 'Unknown')
            ]);
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
        // Debug logging for production troubleshooting
        $clientId = config('services.spotify.client_id');
        $clientSecret = config('services.spotify.client_secret');
        $redirectUri = $this->getRedirectUri();
        
        Log::info('Spotify token exchange debug', [
            'environment' => config('app.env'),
            'client_id' => $clientId ? 'SET (' . substr($clientId, 0, 8) . '...)' : 'MISSING',
            'client_secret_set' => !empty($clientSecret),
            'client_secret_is_placeholder' => $clientSecret === 'your_production_spotify_client_secret',
            'client_secret_length' => $clientSecret ? strlen($clientSecret) : 0,
            'redirect_uri' => $redirectUri,
            'code_length' => strlen($code),
            'code_preview' => substr($code, 0, 10) . '...'
        ]);
        
        $response = Http::asForm()
            ->timeout(30) // 30 second timeout
            ->retry(2, 1000) // Retry 2 times with 1 second delay
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => $redirectUri,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
            ]);
        
        Log::info('Spotify API response', [
            'status' => $response->status(),
            'successful' => $response->successful(),
            'body_preview' => substr($response->body(), 0, 200),
            'headers' => $response->headers()
        ]);
        
        if (!$response->successful()) {
            Log::error('Spotify token exchange failed', [
                'status' => $response->status(),
                'full_response' => $response->body(),
                'client_id_preview' => $clientId ? substr($clientId, 0, 8) . '...' : 'MISSING',
                'client_secret_check' => $clientSecret === 'your_production_spotify_client_secret' ? 'PLACEHOLDER_VALUE' : 'REAL_VALUE',
                'redirect_uri' => $redirectUri
            ]);
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
        Log::info('Fetching Spotify user profile', [
            'access_token_length' => strlen($accessToken),
            'access_token_preview' => substr($accessToken, 0, 20) . '...',
            'user_agent' => request()->header('User-Agent', 'Unknown')
        ]);
        
        $response = Http::withToken($accessToken)
            ->timeout(30) // 30 second timeout
            ->retry(2, 1000) // Retry 2 times with 1 second delay
            ->withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])
            ->get('https://api.spotify.com/v1/me');
        
        Log::info('Spotify user profile response', [
            'status' => $response->status(),
            'successful' => $response->successful(),
            'response_headers' => $response->headers(),
            'response_body_preview' => substr($response->body(), 0, 500)
        ]);
        
        if (!$response->successful()) {
            Log::error('Spotify user profile fetch failed', [
                'status' => $response->status(),
                'response_body' => $response->body(),
                'response_headers' => $response->headers(),
                'access_token_preview' => substr($accessToken, 0, 20) . '...'
            ]);
            return null;
        }
        
        $profileData = $response->json();
        Log::info('Spotify user profile data', [
            'user_id' => $profileData['id'] ?? 'MISSING',
            'display_name' => $profileData['display_name'] ?? 'MISSING',
            'email' => $profileData['email'] ?? 'MISSING',
            'country' => $profileData['country'] ?? 'MISSING',
            'product' => $profileData['product'] ?? 'MISSING'
        ]);
        
        return $profileData;
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
