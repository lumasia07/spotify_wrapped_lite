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
            $table->string('country', 2)->nullable()->after('spotify_display_name');
            $table->string('product')->nullable()->after('country'); // premium, free, etc.
            $table->integer('followers_count')->nullable()->after('product');
            $table->boolean('explicit_content_filter')->nullable()->after('followers_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['country', 'product', 'followers_count', 'explicit_content_filter']);
        });
    }
};
