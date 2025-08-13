<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('spotify_id')->nullable()->unique();
            $table->string('spotify_display_name')->nullable();
            $table->string('avatar_url')->nullable();
            $table->text('spotify_access_token')->nullable();
            $table->text('spotify_refresh_token')->nullable();
            $table->timestamp('spotify_token_expires_at')->nullable();
            $table->string('country')->nullable();
            $table->string('product')->nullable();
            $table->integer('followers_count')->nullable();
            $table->boolean('explicit_content_filter')->nullable();
            
            // Make email nullable since Spotify users might not have email
            $table->string('email')->nullable()->change();
            
            // Make password nullable since we're using OAuth
            $table->string('password')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'spotify_id',
                'spotify_display_name',
                'avatar_url',
                'spotify_access_token',
                'spotify_refresh_token',
                'spotify_token_expires_at',
                'country',
                'product',
                'followers_count',
                'explicit_content_filter'
            ]);
            
            // Revert email and password to not nullable
            $table->string('email')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });
    }
};
