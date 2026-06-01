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

it('can search gallery items by title', function (): void {
    GalleryItem::factory()->create(['title' => 'BMW Key Programming', 'is_active' => true]);
    GalleryItem::factory()->create(['title' => 'Audi Diagnostics', 'is_active' => true]);

    $this->get(route('gallery.index', ['search' => 'BMW']))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page): AssertableInertia => $page
            ->component('gallery/index')
            ->has('items.data', 1)
            ->where('items.data.0.title', 'BMW Key Programming')
            ->where('search', 'BMW')
        );
});

it('can search gallery items by description', function (): void {
    GalleryItem::factory()->create(['title' => 'Item 1', 'description' => 'Advanced diagnostics', 'is_active' => true]);
    GalleryItem::factory()->create(['title' => 'Item 2', 'description' => 'Simple fix', 'is_active' => true]);

    $this->get(route('gallery.index', ['search' => 'Advanced']))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page): AssertableInertia => $page
            ->component('gallery/index')
            ->has('items.data', 1)
            ->where('items.data.0.description', 'Advanced diagnostics')
            ->where('search', 'Advanced')
        );
});
