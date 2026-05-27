<?php

use App\Models\Brand;
use App\Models\Faq;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('home page loads with featured content', function () {
    Service::factory()->featured()->count(6)->create();
    Brand::factory()->featured()->count(12)->create();
    Testimonial::factory()->featured()->count(3)->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('featuredServices', 6)
            ->has('featuredBrands', 12)
            ->has('testimonials', 3)
        );
});

test('services index page displays all active services', function () {
    Service::factory()->count(8)->create();

    $this->get(route('services.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/index')
            ->has('services', 8)
        );
});

test('service show page displays service details', function () {
    $service = Service::factory()->create();

    $this->get(route('services.show', $service))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/show')
            ->where('service.id', $service->id)
            ->has('relatedServices')
        );
});

test('brands index page displays all active brands', function () {
    Brand::factory()->count(10)->create();

    $this->get(route('brands.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('brands/index')
            ->has('brands', 10)
        );
});

test('faq page displays faqs grouped by category', function () {
    Faq::factory()->create(['category' => 'general']);
    Faq::factory()->create(['category' => 'pricing']);
    Faq::factory()->create(['category' => 'technical']);

    $this->get(route('faq'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('faq')
            ->has('faqs')
        );
});
