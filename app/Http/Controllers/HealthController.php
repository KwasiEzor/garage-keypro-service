<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

class HealthController extends Controller
{
    /**
     * Health check endpoint for monitoring.
     */
    public function __invoke(): JsonResponse
    {
        $critical = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'storage' => $this->checkStorage(),
        ];

        $warnings = [
            'queue' => $this->checkQueue(),
            'disk' => $this->checkDisk(),
        ];

        $healthy = ! in_array(false, $critical, true);

        return response()->json([
            'status' => $healthy ? 'healthy' : 'unhealthy',
            'checks' => $critical,
            'warnings' => $warnings,
            'timestamp' => now()->toIso8601String(),
        ], $healthy ? 200 : 503);
    }

    /**
     * Check database connectivity.
     */
    private function checkDatabase(): bool
    {
        try {
            DB::connection()->getPdo();

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check cache connectivity.
     */
    private function checkCache(): bool
    {
        try {
            Cache::put('health_check', true, 10);

            return Cache::get('health_check') === true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check storage is writable.
     */
    private function checkStorage(): bool
    {
        return is_writable(storage_path('logs'));
    }

    /**
     * Check queue is reachable by pushing and immediately forgetting a size probe.
     */
    private function checkQueue(): bool
    {
        try {
            Queue::size();

            return true;
        } catch (\Exception) {
            return false;
        }
    }

    /**
     * Fail if less than 10% disk space remains on the storage volume.
     */
    private function checkDisk(): bool
    {
        $free = disk_free_space(storage_path());
        $total = disk_total_space(storage_path());

        if ($free === false || $total === false || $total === 0.0) {
            return false;
        }

        return ($free / $total) >= 0.10;
    }
}
