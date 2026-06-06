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
            // Composite index for filtered queries by team, status, and date
            // Used by: upcoming(), past(), cancelled() scopes and dashboard filters
            $table->index(['team_id', 'status', 'start_at'], 'idx_appointments_filter');
        });

        Schema::table('invoices', function (Blueprint $table) {
            // Composite index for invoice listing filtered by team and status
            // Used by: invoice dashboard, team invoice queries
            $table->index(['team_id', 'status', 'created_at'], 'idx_invoices_filter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('idx_appointments_filter');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropIndex('idx_invoices_filter');
        });
    }
};
