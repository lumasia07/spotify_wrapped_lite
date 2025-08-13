<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SpotifyService
{
    /**
     * Get user's top items (tracks or artists)
     */
    public function getUserTopItems(User $user, string $type, string $timeRange = 'medium_term', int $limit = 20, int $offset = 0, bool $forceRefresh = false)
    {
        // Validate parameters
        if (!in_array($type, ['tracks', 'artists'])) {
            throw new \InvalidArgumentException('Type must be either "tracks" or "artists"');
        }
        
        if (!in_array($timeRange, ['short_term', 'medium_term', 'long_term'])) {
            throw new \InvalidArgumentException('Invalid time_range. Must be short_term, medium_term, or long_term');
        }
        
        $limit = min(max($limit, 1), 50); // Ensure limit is between 1 and 50
        
        $token = $this->getValidToken($user);
        if (!$token) {
            throw new \Exception('No valid Spotify token available');
        }

        try {
            $response = Http::withToken($token)
                ->get("https://api.spotify.com/v1/me/top/{$type}", [
                    'time_range' => $timeRange,
                    'limit' => $limit,
                    'offset' => $offset
                ]);

            if (!$response->successful()) {
                Log::error('Spotify API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'user_id' => $user->id,
                    'endpoint' => "me/top/{$type}"
                ]);
                throw new \Exception('Failed to fetch data from Spotify API');
            }

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Failed to fetch user top items', [
                'user_id' => $user->id,
                'type' => $type,
                'time_range' => $timeRange,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get user's recently played tracks
     */
    public function getUserRecentlyPlayed(User $user, int $limit = 50, $after = null, $before = null, bool $forceRefresh = false)
    {
        $limit = min(max($limit, 1), 50); // Ensure limit is between 1 and 50
        
        $token = $this->getValidToken($user);
        if (!$token) {
            throw new \Exception('No valid Spotify token available');
        }

        try {
            $params = ['limit' => $limit];
            if ($after) $params['after'] = $after;
            if ($before) $params['before'] = $before;

            $response = Http::withToken($token)
                ->get('https://api.spotify.com/v1/me/player/recently-played', $params);

            if (!$response->successful()) {
                Log::error('Spotify API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'user_id' => $user->id,
                    'endpoint' => 'me/player/recently-played'
                ]);
                throw new \Exception('Failed to fetch recently played tracks from Spotify API');
            }

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Failed to fetch recently played tracks', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get a valid Spotify token for the user
     */
    private function getValidToken(User $user): ?string
    {
        if (!$user->spotify_access_token) {
            return null;
        }

        // If token is expired, try to refresh it
        if ($user->isSpotifyTokenExpired()) {
            // Token refresh logic could go here, but for now just return null
            // This will be handled by the middleware
            return null;
        }

        return $user->spotify_access_token;
    }
}