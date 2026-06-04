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
        Schema::table('appointments', function (Blueprint $table) {
            // Index for availability queries (team + date range + status)
            $table->index(['team_id', 'start_at', 'status'], 'idx_team_date_status');

            // Index for user's appointments queries
            $table->index(['user_id', 'start_at', 'status'], 'idx_user_date_status');

            // Index for status queries
            $table->index('status', 'idx_status');

            // Index for date range queries
            $table->index('start_at', 'idx_start_at');
            $table->index('end_at', 'idx_end_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('idx_team_date_status');
            $table->dropIndex('idx_user_date_status');
            $table->dropIndex('idx_status');
            $table->dropIndex('idx_start_at');
            $table->dropIndex('idx_end_at');
        });
    }
};
