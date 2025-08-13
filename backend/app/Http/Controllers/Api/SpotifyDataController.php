<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpotifyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SpotifyDataController extends Controller
{
    private $spotifyService;

    public function __construct(SpotifyService $spotifyService)
    {
        $this->spotifyService = $spotifyService;
    }

    /**
     * Get user's top tracks
     */
    public function getTopTracks(Request $request)
    {
        $user = Auth::user();
        
        // Validate and get parameters
        $timeRange = $request->get('time_range', 'medium_term');
        $limit = (int) $request->get('limit', 20);
        $offset = (int) $request->get('offset', 0);

        // Validate time_range
        if (!in_array($timeRange, ['short_term', 'medium_term', 'long_term'])) {
            return response()->json([
                'error' => 'Invalid time_range',
                'message' => 'time_range must be one of: short_term, medium_term, long_term'
            ], 400);
        }

        // Validate limit
        if ($limit < 1 || $limit > 50) {
            return response()->json([
                'error' => 'Invalid limit',
                'message' => 'limit must be between 1 and 50'
            ], 400);
        }

        try {
            $data = $this->spotifyService->getUserTopItems($user, 'tracks', $timeRange, $limit, $offset);

            return response()->json([
                'success' => true,
                'data' => $data,
                'meta' => [
                    'time_range' => $timeRange,
                    'limit' => $limit,
                    'offset' => $offset
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch top tracks', [
                'user_id' => $user->id,
                'time_range' => $timeRange,
                'limit' => $limit,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch top tracks',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's top artists
     */
    public function getTopArtists(Request $request)
    {
        $user = Auth::user();
        
        // Validate and get parameters
        $timeRange = $request->get('time_range', 'medium_term');
        $limit = (int) $request->get('limit', 20);
        $offset = (int) $request->get('offset', 0);

        // Validate time_range
        if (!in_array($timeRange, ['short_term', 'medium_term', 'long_term'])) {
            return response()->json([
                'error' => 'Invalid time_range',
                'message' => 'time_range must be one of: short_term, medium_term, long_term'
            ], 400);
        }

        // Validate limit
        if ($limit < 1 || $limit > 50) {
            return response()->json([
                'error' => 'Invalid limit',
                'message' => 'limit must be between 1 and 50'
            ], 400);
        }

        try {
            $data = $this->spotifyService->getUserTopItems($user, 'artists', $timeRange, $limit, $offset);

            return response()->json([
                'success' => true,
                'data' => $data,
                'meta' => [
                    'time_range' => $timeRange,
                    'limit' => $limit,
                    'offset' => $offset
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch top artists', [
                'user_id' => $user->id,
                'time_range' => $timeRange,
                'limit' => $limit,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch top artists',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's recently played tracks
     */
    public function getRecentlyPlayed(Request $request)
    {
        $user = Auth::user();
        $limit = (int) $request->get('limit', 50);
        $after = $request->get('after');
        $before = $request->get('before');

        // Validate limit
        if ($limit < 1 || $limit > 50) {
            return response()->json([
                'error' => 'Invalid limit',
                'message' => 'limit must be between 1 and 50'
            ], 400);
        }

        try {
            $data = $this->spotifyService->getUserRecentlyPlayed($user, $limit, $after, $before);

            return response()->json([
                'success' => true,
                'data' => $data,
                'meta' => [
                    'limit' => $limit,
                    'after' => $after,
                    'before' => $before
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch recently played tracks', [
                'user_id' => $user->id,
                'limit' => $limit,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch recently played tracks',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's Spotify profile
     */
    public function getProfile(Request $request)
    {
        $user = Auth::user();

        try {
            $token = $user->spotify_access_token;
            
            $response = \Illuminate\Support\Facades\Http::withToken($token)
                ->get('https://api.spotify.com/v1/me');

            if (!$response->successful()) {
                throw new \Exception('Failed to fetch profile from Spotify API');
            }

            return response()->json([
                'success' => true,
                'data' => $response->json()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch Spotify profile', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch profile',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Placeholder methods for other endpoints
     */
    public function getPlaylists(Request $request)
    {
        return response()->json([
            'error' => 'Not implemented yet',
            'message' => 'Playlists endpoint is coming soon'
        ], 501);
    }

    public function getWrappedData(Request $request)
    {
        return response()->json([
            'error' => 'Not implemented yet',
            'message' => 'Wrapped data endpoint is coming soon'
        ], 501);
    }

    public function clearCache(Request $request)
    {
        return response()->json([
            'error' => 'Not implemented yet',
            'message' => 'Cache clearing is coming soon'
        ], 501);
    }

    public function getCacheStats(Request $request)
    {
        return response()->json([
            'error' => 'Not implemented yet',
            'message' => 'Cache stats endpoint is coming soon'
        ], 501);
    }
}
