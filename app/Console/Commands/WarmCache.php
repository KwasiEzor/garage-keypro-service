<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

#[Signature('cache:warm')]
#[Description('Warm up application cache with frequently accessed data')]
class WarmCache extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Warming cache...');

        $this->warmServices();
        $this->warmBrands();
        $this->warmSettings();

        $this->info('Cache warmed successfully!');

        return self::SUCCESS;
    }

    /**
     * Warm services cache.
     */
    private function warmServices(): void
    {
        Cache::remember('services.all', 3600, function () {
            $this->line('  Caching services...');

            return Service::orderBy('name')->get();
        });
    }

    /**
     * Warm brands cache.
     */
    private function warmBrands(): void
    {
        Cache::remember('brands.all', 3600, function () {
            $this->line('  Caching brands...');

            return Brand::orderBy('name')->get();
        });
    }

    /**
     * Warm settings cache.
     */
    private function warmSettings(): void
    {
        Cache::remember('settings.all', 3600, function () {
            $this->line('  Caching settings...');

            return Setting::all()->pluck('value', 'key');
        });
    }
}
