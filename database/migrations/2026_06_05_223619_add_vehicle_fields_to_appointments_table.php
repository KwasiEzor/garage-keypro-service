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
        Schema::table('appointments', function (Blueprint $table): void {
            $table->string('vehicle_make')->nullable()->after('notes');
            $table->string('vehicle_model')->nullable()->after('vehicle_make');
            $table->string('vehicle_year', 4)->nullable()->after('vehicle_model');
            $table->string('vehicle_vin', 17)->nullable()->after('vehicle_year');
            $table->string('vehicle_license_plate')->nullable()->after('vehicle_vin');
            $table->string('vehicle_color')->nullable()->after('vehicle_license_plate');
            $table->text('vehicle_notes')->nullable()->after('vehicle_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->dropColumn([
                'vehicle_make',
                'vehicle_model',
                'vehicle_year',
                'vehicle_vin',
                'vehicle_license_plate',
                'vehicle_color',
                'vehicle_notes',
            ]);
        });
    }
};
