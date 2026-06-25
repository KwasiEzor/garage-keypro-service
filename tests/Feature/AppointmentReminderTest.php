<?php

use App\Enums\AppointmentStatus;
use App\Jobs\SendAppointmentReminder;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use App\Notifications\AppointmentReminder;
use Illuminate\Support\Facades\Notification;

test('reminder is sent to appointments within 24 hours', function (): void {
    Notification::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();

    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'team_id' => $team->id,
        'service_id' => $service->id,
        'status' => AppointmentStatus::Confirmed,
        'start_at' => now()->addHours(12),
        'end_at' => now()->addHours(13),
        'reminded_at' => null,
    ]);

    (new SendAppointmentReminder)->handle();

    Notification::assertSentTo($user, AppointmentReminder::class);
    expect($appointment->fresh()->reminded_at)->not->toBeNull();
});

test('reminder is not sent twice to the same appointment', function (): void {
    Notification::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();

    Appointment::factory()->create([
        'user_id' => $user->id,
        'team_id' => $team->id,
        'service_id' => $service->id,
        'status' => AppointmentStatus::Confirmed,
        'start_at' => now()->addHours(12),
        'end_at' => now()->addHours(13),
        'reminded_at' => now()->subHour(),
    ]);

    (new SendAppointmentReminder)->handle();

    Notification::assertNothingSent();
});

test('reminder is not sent to cancelled appointments', function (): void {
    Notification::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();

    Appointment::factory()->create([
        'user_id' => $user->id,
        'team_id' => $team->id,
        'service_id' => $service->id,
        'status' => AppointmentStatus::Cancelled,
        'start_at' => now()->addHours(12),
        'end_at' => now()->addHours(13),
        'reminded_at' => null,
    ]);

    (new SendAppointmentReminder)->handle();

    Notification::assertNothingSent();
});

test('reminder is not sent to appointments beyond 24 hours', function (): void {
    Notification::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();

    Appointment::factory()->create([
        'user_id' => $user->id,
        'team_id' => $team->id,
        'service_id' => $service->id,
        'status' => AppointmentStatus::Confirmed,
        'start_at' => now()->addHours(36),
        'end_at' => now()->addHours(37),
        'reminded_at' => null,
    ]);

    (new SendAppointmentReminder)->handle();

    Notification::assertNothingSent();
});
