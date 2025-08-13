<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SpotifyAuthController;

Route::get('/', function () {
    return view('welcome');
});

// Spotify OAuth routes
Route::get('/auth/spotify', [SpotifyAuthController::class, 'redirectToSpotify']);
Route::get('/auth/spotify/callback', [SpotifyAuthController::class, 'handleSpotifyCallback']);
Route::post('/auth/spotify/exchange', [SpotifyAuthController::class, 'exchangeCodeForToken']);

// Debug route (remove in production)
if (config('app.debug')) {
    Route::get('/debug/environment', function () {
        return response()->json([
            'app_env' => config('app.env'),
            'frontend_url' => config('app.frontend_url'),
            'frontend_url_prod' => config('app.frontend_url_prod'),
            'spotify_redirect_uri' => config('services.spotify.redirect_uri'),
            'spotify_redirect_uri_prod' => config('services.spotify.redirect_uri_prod'),
            'current_frontend_url' => app()->environment('production') 
                ? config('app.frontend_url_prod', 'https://spotify-wrapped-lite.vercel.app')
                : config('app.frontend_url', 'http://localhost:3000'),
            'current_redirect_uri' => app()->environment('production')
                ? config('services.spotify.redirect_uri_prod', 'https://spotify-wrapped-lite.vercel.app/auth/spotify/callback')
                : config('services.spotify.redirect_uri', 'http://localhost:8000/auth/spotify/callback'),
        ]);
    });
}
