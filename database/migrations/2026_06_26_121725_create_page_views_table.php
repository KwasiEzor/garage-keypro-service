<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table): void {
            $table->id();
            $table->string('url');
            $table->string('path');
            $table->string('method', 10)->default('GET');
            $table->string('ip', 45)->nullable();
            $table->string('session_id', 100)->nullable()->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('device_type', 20)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->string('country', 100)->nullable();
            $table->text('referrer')->nullable();
            $table->string('referrer_domain', 255)->nullable();
            $table->string('utm_source', 100)->nullable();
            $table->string('utm_medium', 100)->nullable();
            $table->string('utm_campaign', 100)->nullable();
            $table->integer('response_time_ms')->nullable();
            $table->timestamp('visited_at')->useCurrent();

            $table->index(['visited_at', 'device_type']);
            $table->index(['path', 'visited_at']);
            $table->index(['ip', 'visited_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
