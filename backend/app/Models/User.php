<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'spotify_id',
        'spotify_display_name',
        'avatar_url',
        'spotify_access_token',
        'spotify_refresh_token',
        'spotify_token_expires_at',
        'country',
        'product',
        'followers_count',
        'explicit_content_filter',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'spotify_access_token',
        'spotify_refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'spotify_token_expires_at' => 'datetime',
            'password' => 'hashed',
            'explicit_content_filter' => 'boolean',
        ];
    }

    /**
     * Check if Spotify token is expired
     */
    public function isSpotifyTokenExpired(): bool
    {
        if (!$this->spotify_token_expires_at) {
            return true;
        }
        
        return $this->spotify_token_expires_at->isPast();
    }

    /**
     * Get valid Spotify access token
     */
    public function getValidSpotifyToken(): ?string
    {
        if (!$this->spotify_access_token || $this->isSpotifyTokenExpired()) {
            return null;
        }
        
        return $this->spotify_access_token;
    }
}