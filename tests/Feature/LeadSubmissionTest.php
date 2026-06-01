<?php

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;

uses(RefreshDatabase::class);

test('user can submit lead form with valid data', function (): void {
    $service = Service::factory()->create();

    $this->post(route('leads.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'service_id' => $service->id,
    ])->assertRedirect();

    assertDatabaseHas('leads', [
        'email' => 'john@example.com',
        'status' => 'new',
        'source' => 'website',
    ]);
});

test('lead submission requires valid email', function (): void {
    $this->post(route('leads.store'), [
        'name' => 'John Doe',
        'email' => 'invalid',
    ])->assertSessionHasErrors('email');
});

test('lead submission requires name', function (): void {
    $this->post(route('leads.store'), [
        'email' => 'john@example.com',
    ])->assertSessionHasErrors('name');
});

test('lead can include vehicle information', function (): void {
    $this->post(route('leads.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'vehicle_make' => 'Toyota',
        'vehicle_model' => 'Camry',
        'vehicle_year' => '2020',
        'message' => 'Need key programming',
    ])->assertRedirect();

    assertDatabaseHas('leads', [
        'email' => 'john@example.com',
        'vehicle_make' => 'Toyota',
        'vehicle_model' => 'Camry',
        'vehicle_year' => '2020',
    ]);
});
