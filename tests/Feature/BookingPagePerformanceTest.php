<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class BookingPagePerformanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_page_loads_successfully(): void
    {
        $this->actingAs(User::factory()->create());

        Team::factory()->create();
        Service::factory()->count(3)->create(['is_active' => true]);

        $response = $this->get('/appointments');

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('appointments/index')
            ->has('services')
            ->has('teams')
        );
    }

    public function test_booking_page_does_not_preload_gsap(): void
    {
        $this->actingAs(User::factory()->create());

        Team::factory()->create();
        Service::factory()->create(['is_active' => true]);

        $response = $this->get('/appointments');

        $content = $response->getContent();

        // GSAP should NOT be in the initial HTML since it's lazy loaded
        $this->assertStringNotContainsString('gsap-', $content);
    }

    public function test_booking_page_has_proper_meta_tags(): void
    {
        $this->actingAs(User::factory()->create());

        Team::factory()->create();
        Service::factory()->create(['is_active' => true]);

        $response = $this->get('/appointments');

        $content = $response->getContent();

        // Check for performance optimization hints
        $this->assertStringContainsString('preconnect', $content);
        $this->assertStringContainsString('dns-prefetch', $content);
    }
}
