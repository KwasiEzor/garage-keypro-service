<?php

use App\Models\Service;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('privacy policy page is accessible', function (): void {
    Setting::updateOrCreate(['key' => 'privacy_policy_content'], ['value' => 'Test Privacy Policy Content']);

    $this->get(route('privacy-policy'))
        ->assertOk()
        ->assertSee('Test Privacy Policy Content');
});

test('terms of service page is accessible', function (): void {
    Setting::updateOrCreate(['key' => 'terms_of_service_content'], ['value' => 'Test Terms of Service Content']);

    $this->get(route('terms-of-service'))
        ->assertOk()
        ->assertSee('Test Terms of Service Content');
});

test('sitemap.xml is accessible and contains urls', function (): void {
    Service::factory()->count(3)->create();

    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');
    $this->assertStringContainsString('<urlset', $response->getContent());
    $this->assertStringContainsString(route('home'), $response->getContent());
});

test('robots.txt is accessible', function (): void {
    Setting::updateOrCreate(['key' => 'seo_robots'], ['value' => 'index, follow']);

    $response = $this->get('/robots.txt');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
    $this->assertStringContainsString('User-agent: *', $response->getContent());
    $this->assertStringContainsString('Sitemap:', $response->getContent());
});

test('seo tags are present in inertia shared data', function (): void {
    Setting::updateOrCreate(['key' => 'seo_title'], ['value' => 'Custom SEO Title']);

    $this->get(route('home'))
        ->assertInertia(fn ($page) => $page
            ->where('settings.seo_title', 'Custom SEO Title')
        );
});
