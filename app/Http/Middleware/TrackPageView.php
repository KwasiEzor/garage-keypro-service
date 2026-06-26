<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\PageView;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    private const SKIP_PREFIXES = [
        '/_boost', '/filament', '/admin', '/_debugbar',
        '/telescope', '/horizon', '/pulse', '/livewire',
    ];

    private const SKIP_EXTENSIONS = [
        'css', 'js', 'ico', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'woff',
        'woff2', 'ttf', 'eot', 'map', 'webp', 'avif',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $start = hrtime(true);
        $response = $next($request);

        if ($this->shouldTrack($request, $response)) {
            $this->record($request, $response, (int) ((hrtime(true) - $start) / 1_000_000));
        }

        return $response;
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        $path = $request->path();

        foreach (self::SKIP_PREFIXES as $prefix) {
            if (str_starts_with('/'.$path, $prefix)) {
                return false;
            }
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if ($extension && in_array($extension, self::SKIP_EXTENSIONS, true)) {
            return false;
        }

        return $response->getStatusCode() < 500;
    }

    private function record(Request $request, Response $response, int $responseTimeMs): void
    {
        $userAgent = $request->userAgent() ?? '';
        $referrer = $request->headers->get('referer');

        try {
            PageView::create([
                'url' => $request->fullUrl(),
                'path' => '/'.$request->path(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'session_id' => $request->hasSession() ? $request->session()->getId() : null,
                'user_id' => $request->user()?->id,
                'device_type' => $this->detectDevice($userAgent),
                'browser' => $this->detectBrowser($userAgent),
                'os' => $this->detectOs($userAgent),
                'referrer' => $referrer,
                'referrer_domain' => $referrer ? parse_url($referrer, PHP_URL_HOST) : null,
                'utm_source' => $request->query('utm_source'),
                'utm_medium' => $request->query('utm_medium'),
                'utm_campaign' => $request->query('utm_campaign'),
                'response_time_ms' => $responseTimeMs,
                'visited_at' => now(),
            ]);
        } catch (\Throwable) {
            // Never let tracking break the app
        }
    }

    private function detectDevice(string $ua): string
    {
        $ua = strtolower($ua);

        if (preg_match('/bot|crawl|spider|slurp|yahoo|googlebot|bingbot|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers\.google\.com\/\+\/web\/snippet/i', $ua)) {
            return 'bot';
        }

        if (preg_match('/tablet|ipad|playbook|silk|(android(?!.*mobile))/i', $ua)) {
            return 'tablet';
        }

        if (preg_match('/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i', $ua)) {
            return 'mobile';
        }

        return 'desktop';
    }

    private function detectBrowser(string $ua): string
    {
        return match (true) {
            str_contains($ua, 'Edg/') || str_contains($ua, 'Edge/') => 'Edge',
            str_contains($ua, 'OPR/') || str_contains($ua, 'Opera/') => 'Opera',
            str_contains($ua, 'Chrome/') => 'Chrome',
            str_contains($ua, 'Firefox/') => 'Firefox',
            str_contains($ua, 'Safari/') && ! str_contains($ua, 'Chrome') => 'Safari',
            str_contains($ua, 'MSIE') || str_contains($ua, 'Trident/') => 'Internet Explorer',
            default => 'Other',
        };
    }

    private function detectOs(string $ua): string
    {
        return match (true) {
            str_contains($ua, 'Windows') => 'Windows',
            str_contains($ua, 'Mac OS') || str_contains($ua, 'Macintosh') => 'macOS',
            str_contains($ua, 'iPhone') || str_contains($ua, 'iPad') || str_contains($ua, 'iPod') => 'iOS',
            str_contains($ua, 'Android') => 'Android',
            str_contains($ua, 'Linux') => 'Linux',
            default => 'Other',
        };
    }
}
