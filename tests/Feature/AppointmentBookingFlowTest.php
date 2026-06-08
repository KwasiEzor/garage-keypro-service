<?php

use App\Models\Service;
use App\Models\Team;
use App\Models\User;

use function Pest\Laravel\actingAs;

test('availability endpoint returns data for active services', function () {
    // Get first active service and non-personal team
    $service = Service::where('is_active', true)->first();
    $team = Team::where('is_personal', false)->first();

    if (! $service || ! $team) {
        $this->markTestSkipped('No service or non-personal team available');
    }

    // Test availability endpoint
    $month = now()->format('Y-m');
    $response = $this->get("/appointments/availability?team_id={$team->id}&service_id={$service->id}&month={$month}");

    $response->assertOk();
    $response->assertJsonStructure(['availability']);

    $availability = $response->json('availability');

    dump([
        'service' => $service->name,
        'team' => $team->name,
        'month' => $month,
        'available_dates' => count($availability),
        'sample_dates' => array_slice(array_keys($availability), 0, 5),
    ]);

    expect($availability)->toBeArray();
})->group('booking');

test('slots endpoint returns data for valid date', function () {
    $service = Service::where('is_active', true)->first();
    $team = Team::where('is_personal', false)->first();

    if (! $service || ! $team) {
        $this->markTestSkipped('No service or non-personal team available');
    }

    // Get availability first
    $month = now()->format('Y-m');
    $availResponse = $this->get("/appointments/availability?team_id={$team->id}&service_id={$service->id}&month={$month}");
    $availability = $availResponse->json('availability');

    if (empty($availability)) {
        dump('No availability found - this is expected if business hours not configured');
        $this->markTestSkipped('No availability for testing slots');
    }

    // Get first available date
    $firstDate = array_key_first($availability);

    // Test slots endpoint
    $response = $this->get("/appointments/slots?team_id={$team->id}&service_id={$service->id}&date={$firstDate}");

    $response->assertOk();
    $response->assertJsonStructure(['slots']);

    $slots = $response->json('slots');

    dump([
        'date' => $firstDate,
        'available_slots' => count($slots),
        'first_3_slots' => array_slice($slots, 0, 3),
    ]);

    expect($slots)->toBeArray();
})->group('booking');

test('appointments page loads with services and teams', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/appointments');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('appointments/index'));

    dump('Appointments page loaded successfully');
})->group('booking');
