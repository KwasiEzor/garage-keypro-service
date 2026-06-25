<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Setting;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Generate the XML sitemap for the website.
     */
    public function index(): Response
    {
        $xml = Cache::remember('sitemap.xml', 3600, function () {
            $urls = [
                ['url' => route('home'), 'lastmod' => now()->toAtomString(), 'priority' => '1.0'],
                ['url' => route('services.index'), 'lastmod' => now()->toAtomString(), 'priority' => '0.8'],
                ['url' => route('brands.index'), 'lastmod' => now()->toAtomString(), 'priority' => '0.8'],
                ['url' => route('gallery.index'), 'lastmod' => now()->toAtomString(), 'priority' => '0.7'],
                ['url' => route('faq'), 'lastmod' => now()->toAtomString(), 'priority' => '0.6'],
                ['url' => route('privacy-policy'), 'lastmod' => now()->toAtomString(), 'priority' => '0.3'],
                ['url' => route('terms-of-service'), 'lastmod' => now()->toAtomString(), 'priority' => '0.3'],
            ];

            foreach (Service::active()->get() as $service) {
                $urls[] = [
                    'url' => route('services.show', $service),
                    'lastmod' => $service->updated_at->toAtomString(),
                    'priority' => '0.9',
                ];
            }

            $xml = '<?xml version="1.0" encoding="UTF-8"?>'.PHP_EOL;
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'.PHP_EOL;

            foreach ($urls as $url) {
                $xml .= '    <url>'.PHP_EOL;
                $xml .= '        <loc>'.htmlspecialchars($url['url']).'</loc>'.PHP_EOL;
                $xml .= '        <lastmod>'.$url['lastmod'].'</lastmod>'.PHP_EOL;
                $xml .= '        <changefreq>weekly</changefreq>'.PHP_EOL;
                $xml .= '        <priority>'.$url['priority'].'</priority>'.PHP_EOL;
                $xml .= '    </url>'.PHP_EOL;
            }

            $xml .= '</urlset>';

            return $xml;
        });

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }

    /**
     * Generate the robots.txt file based on SEO settings.
     */
    public function robots(): Response
    {
        $robots = Setting::get('seo_robots', 'index, follow');
        $disallow = str_contains($robots, 'noindex') ? '/' : '';

        $content = "User-agent: *\n";
        if ($disallow !== '' && $disallow !== '0') {
            $content .= sprintf('Disallow: %s%s', $disallow, PHP_EOL);
        } else {
            $content .= "Disallow: /admin\n";
            $content .= "Disallow: /login\n";
            $content .= "Disallow: /register\n";
        }

        $content .= "\nSitemap: ".route('sitemap');

        return response($content, 200)->header('Content-Type', 'text/plain');
    }
}
