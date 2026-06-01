<?php

use App\Models\GalleryItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('can view the gallery page', function (): void {
    GalleryItem::factory()->count(5)->create(['is_active' => true]);

    $this->get(route('gallery.index'))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page): AssertableInertia => $page
            ->component('gallery/index')
            ->has('items.data', 5)
            ->has('categories')
            ->where('currentCategory', 'All')
        );
});

it('can filter gallery items by category', function (): void {
    GalleryItem::factory()->create(['category' => 'Diagnostics', 'is_active' => true]);
    GalleryItem::factory()->create(['category' => 'Performance', 'is_active' => true]);

    $this->get(route('gallery.index', ['category' => 'Diagnostics']))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page): AssertableInertia => $page
            ->component('gallery/index')
            ->has('items.data', 1)
            ->where('currentCategory', 'Diagnostics')
        );
});

it('does not show inactive gallery items', function (): void {
    GalleryItem::factory()->create(['is_active' => false]);

    $this->get(route('gallery.index'))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page): AssertableInertia => $page
            ->component('gallery/index')
            ->has('items.data', 0)
        );
});
