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
            $table->string('spotify_email')->nullable();
            $table->string('spotify_display_name')->nullable();
            $table->text('spotify_image')->nullable();
            $table->string('spotify_country')->nullable();
            $table->integer('spotify_followers')->nullable();
            $table->text('spotify_access_token')->nullable();
            $table->text('spotify_refresh_token')->nullable();
            $table->timestamp('spotify_token_expires_at')->nullable();
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
                'spotify_email',
                'spotify_display_name',
                'spotify_image',
                'spotify_country',
                'spotify_followers',
                'spotify_access_token',
                'spotify_refresh_token',
                'spotify_token_expires_at',
            ]);
        });
    }
};
