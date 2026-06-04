<?php

use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->team = Team::factory()->create();
    $this->service = Service::factory()->create([
        'is_active' => true,
        'estimated_duration' => 60,
    ]);
});

test('user can view appointment booking wizard', function () {
    $response = $this->get(route('appointments.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('appointments/index')
        ->has('services')
        ->has('teams')
    );
});

test('wizard returns available services and teams', function () {
    $response = $this->get(route('appointments.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('services', fn ($services) => count($services) > 0)
        ->where('teams', fn ($teams) => count($teams) > 0)
    );
});

test('authenticated user can book appointment through wizard', function () {
    Notification::fake();

    $tomorrow = now()->addDay()->setTime(10, 0);

    $this->actingAs($this->user)
        ->post(route('appointments.store'), [
            'team_id' => $this->team->id,
            'service_id' => $this->service->id,
            'date' => $tomorrow->format('Y-m-d'),
            'slot' => '10:00',
            'notes' => 'Test vehicle notes',
        ])
        ->assertRedirect(route('appointments.show', 1));

    $this->assertDatabaseHas('appointments', [
        'user_id' => $this->user->id,
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'status' => 'confirmed',
        'notes' => 'Test vehicle notes',
    ]);
});

test('booking requires authentication', function () {
    $tomorrow = now()->addDay()->setTime(10, 0);

    $this->post(route('appointments.store'), [
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'date' => $tomorrow->format('Y-m-d'),
        'slot' => '10:00',
    ])->assertRedirect(route('login'));
});

test('booking validates required fields', function () {
    $this->actingAs($this->user)
        ->post(route('appointments.store'), [])
        ->assertSessionHasErrors(['team_id', 'service_id', 'date', 'slot']);
});

test('user can fetch availability for a month', function () {
    $response = $this->get(route('appointments.availability', [
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'month' => now()->format('Y-m'),
    ]));

    $response->assertStatus(200);
    $response->assertJsonStructure(['availability']);
});

test('user can fetch time slots for a specific date', function () {
    $tomorrow = now()->addDay();

    $response = $this->get(route('appointments.slots', [
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'date' => $tomorrow->format('Y-m-d'),
    ]));

    $response->assertStatus(200);
    $response->assertJsonStructure(['slots']);
});

test('user can view their appointments with tabs', function () {
    // Create upcoming appointment
    Appointment::factory()->create([
        'user_id' => $this->user->id,
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'start_at' => now()->addDay(),
        'status' => 'confirmed',
    ]);

    // Create past appointment
    Appointment::factory()->create([
        'user_id' => $this->user->id,
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'start_at' => now()->subDay(),
        'status' => 'completed',
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('appointments.my'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('appointments/my-appointments')
        ->has('upcoming')
        ->has('past')
        ->has('cancelled')
    );
});

test('user can reschedule appointment', function () {
    $appointment = Appointment::factory()->create([
        'user_id' => $this->user->id,
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'start_at' => now()->addWeek(),
        'status' => 'confirmed',
    ]);

    $newDate = now()->addWeek()->addDay()->setTime(14, 0);

    $this->actingAs($this->user)
        ->post(route('appointments.reschedule.process', $appointment), [
            'team_id' => $this->team->id,
            'service_id' => $this->service->id,
            'date' => $newDate->format('Y-m-d'),
            'slot' => '14:00',
        ])
        ->assertRedirect(route('appointments.my'));

    // Old appointment should be cancelled
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'cancelled',
        'cancellation_reason' => 'Rescheduled to new time',
    ]);

    // New appointment should exist
    $this->assertDatabaseHas('appointments', [
        'user_id' => $this->user->id,
        'status' => 'confirmed',
    ]);
});

test('user cannot reschedule appointment within 2 hours', function () {
    $appointment = Appointment::factory()->create([
        'user_id' => $this->user->id,
        'team_id' => $this->team->id,
        'service_id' => $this->service->id,
        'start_at' => now()->addHour(), // Only 1 hour away
        'status' => 'confirmed',
    ]);

    $this->actingAs($this->user)
        ->get(route('appointments.reschedule', $appointment))
        ->assertStatus(403);
});

test('appointments use correct scopes', function () {
    // Upcoming
    $upcoming = Appointment::factory()->create([
        'user_id' => $this->user->id,
        'start_at' => now()->addDay(),
        'status' => 'confirmed',
    ]);

    // Past
    $past = Appointment::factory()->create([
        'user_id' => $this->user->id,
        'start_at' => now()->subDay(),
        'status' => 'completed',
    ]);

    // Cancelled
    $cancelled = Appointment::factory()->create([
        'user_id' => $this->user->id,
        'start_at' => now()->addDay(),
        'status' => 'cancelled',
    ]);

    expect(Appointment::upcoming()->count())->toBe(1);
    expect(Appointment::past()->count())->toBe(1);
    expect(Appointment::cancelled()->count())->toBe(1);
});
