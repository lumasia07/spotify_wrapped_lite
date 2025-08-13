<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SpotifyAuthController;
use App\Http\Controllers\Api\SpotifyDataController;

// Public auth routes
Route::post('/auth/spotify/exchange', [SpotifyAuthController::class, 'exchangeCodeForToken']);

// Auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [SpotifyAuthController::class, 'getUser']);
    Route::post('/auth/refresh', [SpotifyAuthController::class, 'refreshToken']);
    Route::post('/auth/logout', [SpotifyAuthController::class, 'logout']);
    
    // Spotify Data routes - require valid Spotify token
    Route::middleware('spotify.token')->group(function () {
        Route::get('/spotify/profile', [SpotifyDataController::class, 'getProfile']);
        Route::get('/spotify/top-tracks', [SpotifyDataController::class, 'getTopTracks']);
        Route::get('/spotify/top-artists', [SpotifyDataController::class, 'getTopArtists']);
        Route::get('/spotify/recently-played', [SpotifyDataController::class, 'getRecentlyPlayed']);
        Route::get('/spotify/playlists', [SpotifyDataController::class, 'getPlaylists']);
        Route::get('/spotify/wrapped', [SpotifyDataController::class, 'getWrappedData']);
        Route::delete('/spotify/cache', [SpotifyDataController::class, 'clearCache']);
        Route::get('/spotify/cache/stats', [SpotifyDataController::class, 'getCacheStats']);
    });
});