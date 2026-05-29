<?php

use App\Models\GalleryItem;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can view the gallery page', function () {
    GalleryItem::factory()->count(5)->create(['is_active' => true]);

    $this->get(route('gallery.index'))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('gallery/index')
            ->has('items.data', 5)
            ->has('categories')
            ->where('currentCategory', 'All')
        );
});

it('can filter gallery items by category', function () {
    GalleryItem::factory()->create(['category' => 'Diagnostics', 'is_active' => true]);
    GalleryItem::factory()->create(['category' => 'Performance', 'is_active' => true]);

    $this->get(route('gallery.index', ['category' => 'Diagnostics']))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('gallery/index')
            ->has('items.data', 1)
            ->where('currentCategory', 'Diagnostics')
        );
});

it('does not show inactive gallery items', function () {
    GalleryItem::factory()->create(['is_active' => false]);

    $this->get(route('gallery.index'))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('gallery/index')
            ->has('items.data', 0)
        );
});
