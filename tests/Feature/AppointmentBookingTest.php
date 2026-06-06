<?php

use App\Exceptions\SlotUnavailableException;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Validation\ValidationException;

test('allows booking after cancelled appointment', function () {
    $team = Team::factory()->create();
    $service = Service::factory()->create(['estimated_duration' => 60]);
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $startAt = now()->addDay()->setTime(9, 0);

    // User 1 books
    $appointment1 = app(AppointmentService::class)->createAppointment(
        $team, $user1, $service, $startAt
    );

    app(AppointmentService::class)->cancelAppointment($appointment1, 'Changed mind');

    // User 2 tries same slot - should succeed
    $appointment2 = app(AppointmentService::class)->createAppointment(
        $team, $user2, $service, $startAt
    );

    expect($appointment2->id)->not->toBe($appointment1->id);
});

test('prevents double-booking same slot', function () {
    $team = Team::factory()->create();
    $service = Service::factory()->create(['estimated_duration' => 60]);
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $startAt = now()->addDay()->setTime(10, 0);

    // User 1 books
    $appointment1 = app(AppointmentService::class)->createAppointment(
        $team, $user1, $service, $startAt
    );
    expect($appointment1)->toBeInstanceOf(Appointment::class);

    // User 2 tries same slot - should fail
    expect(fn () => app(AppointmentService::class)->createAppointment(
        $team, $user2, $service, $startAt
    ))->toThrow(SlotUnavailableException::class);
});

test('rejects invalid timezone to prevent DoS attacks', function () {
    $team = Team::factory()->create(['timezone' => 'Invalid/Timezone']);
    $service = Service::factory()->create(['estimated_duration' => 60]);
    $user = User::factory()->create();

    $startAt = now()->addDay()->setTime(9, 0);

    // Should throw ValidationException for invalid timezone
    expect(fn () => app(AppointmentService::class)->createAppointment(
        $team, $user, $service, $startAt
    ))->toThrow(ValidationException::class, 'Invalid timezone specified for team');
});

test('handles appointment booking across different timezones', function (string $timezone) {
    $team = Team::factory()->create(['timezone' => $timezone]);
    $service = Service::factory()->create(['estimated_duration' => 60]);
    $user = User::factory()->create();

    // Book appointment at 10 AM in team's timezone
    $startAt = now($timezone)->addDay()->setTime(10, 0);

    $appointment = app(AppointmentService::class)->createAppointment(
        $team, $user, $service, $startAt
    );

    expect($appointment)->toBeInstanceOf(Appointment::class);
    expect($appointment->team_id)->toBe($team->id);

    // Verify appointment is stored in UTC
    expect($appointment->start_at->timezone->getName())->toBe('UTC');
})->with([
    'UTC' => ['UTC'],
    'Europe/Paris' => ['Europe/Paris'],
    'Asia/Tokyo' => ['Asia/Tokyo'],
    'America/New_York' => ['America/New_York'],
    'Australia/Sydney' => ['Australia/Sydney'],
]);

test('prevents double-booking across timezone boundaries', function () {
    // Team in Tokyo timezone
    $team = Team::factory()->create(['timezone' => 'Asia/Tokyo']);
    $service = Service::factory()->create(['estimated_duration' => 60]);
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    // Book at 10 AM Tokyo time
    $tokyoTime = now('Asia/Tokyo')->addDay()->setTime(10, 0);

    app(AppointmentService::class)->createAppointment(
        $team, $user1, $service, $tokyoTime
    );

    // Try to book same slot (10 AM Tokyo = different UTC time)
    expect(fn () => app(AppointmentService::class)->createAppointment(
        $team, $user2, $service, $tokyoTime
    ))->toThrow(SlotUnavailableException::class);
});
