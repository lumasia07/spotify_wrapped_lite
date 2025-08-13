<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add avatar_url column if it doesn't exist
            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url')->nullable();
            }
            
            // Make email nullable for OAuth users
            $table->string('email')->nullable()->change();
            
            // Make password nullable for OAuth users  
            $table->string('password')->nullable()->change();
        });
        
        // Copy data from spotify_image to avatar_url if both columns exist
        if (Schema::hasColumn('users', 'spotify_image') && Schema::hasColumn('users', 'avatar_url')) {
            DB::statement('UPDATE users SET avatar_url = spotify_image WHERE spotify_image IS NOT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert email and password to not nullable
            $table->string('email')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
            
            // Optionally drop avatar_url if we added it
            if (Schema::hasColumn('users', 'avatar_url')) {
                $table->dropColumn('avatar_url');
            }
        });
    }
};
