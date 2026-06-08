<?php

use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;

use function Pest\Laravel\actingAs;

test('complete appointment booking flow - from service selection to confirmation', function () {
    // Setup: Create authenticated user
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    // Get available service and team
    $service = Service::where('is_active', true)->first();
    $team = Team::where('is_personal', false)->first();

    if (! $service || ! $team) {
        $this->markTestSkipped('No active service or non-personal team available for testing');
    }

    dump('=== APPOINTMENT BOOKING FLOW TEST ===');
    dump('Service: '.$service->name);
    dump('Team: '.$team->name);
    dump('User: '.$user->email);

    // Step 1: Visit appointments page
    dump("\n--- Step 1: Loading appointments page ---");
    $response = actingAs($user)->get('/appointments');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('appointments/index'));
    dump('✓ Page loaded successfully');

    // Step 2: Get availability for current month
    dump("\n--- Step 2: Fetching availability ---");
    $month = now()->format('Y-m');
    $availResponse = actingAs($user)->get(
        "/appointments/availability?team_id={$team->id}&service_id={$service->id}&month={$month}"
    );

    $availResponse->assertOk();
    $availResponse->assertJsonStructure(['availability']);
    $availability = $availResponse->json('availability');

    dump("Available dates count: ".count($availability));
    dump('First 5 dates: '.implode(', ', array_slice(array_keys($availability), 0, 5)));

    if (empty($availability)) {
        dump('⚠ No availability found - business hours may not be configured');
        $this->markTestSkipped('No availability for testing');
    }

    dump('✓ Availability fetched successfully');

    // Step 3: Select first available date
    dump("\n--- Step 3: Selecting date ---");
    $selectedDate = array_key_first($availability);
    $dateInfo = $availability[$selectedDate];

    dump("Selected date: {$selectedDate}");
    dump("Available slots: {$dateInfo['slots']}");
    dump("First slot time: {$dateInfo['first']}");
    dump('✓ Date selected');

    // Step 4: Get available time slots for selected date
    dump("\n--- Step 4: Fetching time slots ---");
    $slotsResponse = actingAs($user)->get(
        "/appointments/slots?team_id={$team->id}&service_id={$service->id}&date={$selectedDate}"
    );

    $slotsResponse->assertOk();
    $slotsResponse->assertJsonStructure(['slots']);
    $slots = $slotsResponse->json('slots');

    dump('Time slots count: '.count($slots));

    if (empty($slots)) {
        dump('⚠ No time slots available');
        $this->markTestSkipped('No slots available for testing');
    }

    // Find first available slot
    $availableSlot = collect($slots)->firstWhere('is_available', true);

    if (! $availableSlot) {
        dump('⚠ No available time slots');
        $this->markTestSkipped('No available slots for testing');
    }

    dump("Selected slot: {$availableSlot['start_time']} - {$availableSlot['end_time']}");
    dump('✓ Time slot selected');

    // Step 5: Submit appointment booking
    dump("\n--- Step 5: Submitting booking ---");
    $bookingData = [
        'team_id' => $team->id,
        'service_id' => $service->id,
        'start_at' => $selectedDate.' '.$availableSlot['start_time'],
        'notes' => 'Test booking from automated test',
    ];

    dump('Booking data:', $bookingData);

    $bookingResponse = actingAs($user)->post('/appointments', $bookingData);

    // Should redirect to success page or dashboard
    $bookingResponse->assertRedirect();
    dump('✓ Booking submitted successfully');
    dump('Redirect to: '.$bookingResponse->headers->get('Location'));

    // Verify appointment was created in database
    dump("\n--- Step 6: Verifying database ---");
    $this->assertDatabaseHas('appointments', [
        'user_id' => $user->id,
        'team_id' => $team->id,
        'service_id' => $service->id,
    ]);
    dump('✓ Appointment exists in database');

    // Get created appointment
    $appointment = \App\Models\Appointment::where('user_id', $user->id)
        ->where('service_id', $service->id)
        ->latest()
        ->first();

    if ($appointment) {
        dump("\n=== BOOKING CONFIRMATION ===");
        dump("Appointment ID: {$appointment->id}");
        dump("Status: {$appointment->status}");
        dump("Start time: {$appointment->start_at}");
        dump("Service: {$service->name}");
        dump("Team: {$team->name}");
    }

    dump("\n✅ COMPLETE APPOINTMENT FLOW TEST PASSED");

    expect($availability)->toBeArray()->not->toBeEmpty();
    expect($slots)->toBeArray()->not->toBeEmpty();
    expect($appointment)->not->toBeNull();
})->group('appointment-flow');

test('availability endpoint handles invalid parameters', function () {
    $user = User::factory()->create();

    // Missing required parameters
    actingAs($user)
        ->get('/appointments/availability')
        ->assertStatus(302); // Redirects with validation errors

    // Invalid service ID
    actingAs($user)
        ->get('/appointments/availability?team_id=1&service_id=99999&month=2026-06')
        ->assertStatus(302);

    dump('✓ Invalid parameters handled correctly');
})->group('appointment-flow');

test('slots endpoint validates date is not in the past', function () {
    $user = User::factory()->create();
    $service = Service::where('is_active', true)->first();
    $team = Team::where('is_personal', false)->first();

    if (! $service || ! $team) {
        $this->markTestSkipped('No service or team available');
    }

    // Try to book a past date
    $pastDate = now()->subDays(7)->format('Y-m-d');

    actingAs($user)
        ->get("/appointments/slots?team_id={$team->id}&service_id={$service->id}&date={$pastDate}")
        ->assertStatus(302); // Validation error redirect

    dump('✓ Past dates rejected correctly');
})->group('appointment-flow');
