<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSpotifyToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        // Check if user has a valid Spotify token
        if (!$user->spotify_access_token) {
            return response()->json([
                'error' => 'No Spotify token',
                'message' => 'Please reconnect your Spotify account'
            ], 401);
        }
        
        // Check if token is expired
        if ($user->isSpotifyTokenExpired()) {
            return response()->json([
                'error' => 'Spotify token expired',
                'message' => 'Please refresh your Spotify token',
                'requires_refresh' => true
            ], 401);
        }
        
        return $next($request);
    }
}
