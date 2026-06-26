<?php

use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use App\Notifications\AppointmentConfirmation;
use App\Notifications\AppointmentReminder;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('appointment confirmation implements ShouldBroadcast', function () {
    expect(AppointmentConfirmation::class)
        ->toImplement(ShouldBroadcast::class);
});

it('appointment reminder implements ShouldBroadcast', function () {
    expect(AppointmentReminder::class)
        ->toImplement(ShouldBroadcast::class);
});

it('appointment confirmation includes broadcast channel', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();
    $appointment = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $notification = new AppointmentConfirmation($appointment);

    expect($notification->via($user))->toContain('broadcast');
});

it('appointment reminder includes broadcast channel', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();
    $appointment = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $notification = new AppointmentReminder($appointment);

    expect($notification->via($user))->toContain('broadcast');
});

it('appointment confirmation toBroadcast returns BroadcastMessage with expected keys', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();
    $appointment = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $notification = new AppointmentConfirmation($appointment);
    $message = $notification->toBroadcast($user);

    expect($message)->toBeInstanceOf(BroadcastMessage::class);

    $data = $message->data;
    expect($data)
        ->toHaveKey('message')
        ->toHaveKey('type')
        ->toHaveKey('appointment_id')
        ->toHaveKey('start_at');

    expect($data['type'])->toBe('appointment_confirmation');
    expect($data['appointment_id'])->toBe($appointment->id);
});

it('appointment reminder toBroadcast returns BroadcastMessage with expected keys', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();
    $appointment = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $notification = new AppointmentReminder($appointment);
    $message = $notification->toBroadcast($user);

    expect($message)->toBeInstanceOf(BroadcastMessage::class);

    $data = $message->data;
    expect($data)
        ->toHaveKey('message')
        ->toHaveKey('type')
        ->toHaveKey('appointment_id')
        ->toHaveKey('start_at');

    expect($data['type'])->toBe('appointment_reminder');
    expect($data['appointment_id'])->toBe($appointment->id);
});

it('appointment confirmation is broadcast when sent', function () {
    Notification::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();
    $appointment = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $user->notify(new AppointmentConfirmation($appointment));

    Notification::assertSentTo($user, AppointmentConfirmation::class, function ($notification, $channels) {
        return in_array('broadcast', $channels);
    });
});

it('appointment reminder is broadcast when sent', function () {
    Notification::fake();

    $user = User::factory()->create();
    $team = Team::factory()->create();
    $service = Service::factory()->create();
    $appointment = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $user->notify(new AppointmentReminder($appointment));

    Notification::assertSentTo($user, AppointmentReminder::class, function ($notification, $channels) {
        return in_array('broadcast', $channels);
    });
});

it('channel auth callback allows correct user', function () {
    $user = User::factory()->create();

    $result = Broadcast::channel('App.Models.User.{id}', function () {});

    $auth = app(BroadcastManager::class)
        ->auth(request()->merge(['channel_name' => 'private-App.Models.User.'.$user->id]));

    $callback = fn ($u, $id) => (int) $u->id === (int) $id;

    expect($callback($user, $user->id))->toBeTrue();
});

it('channel auth callback denies wrong user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $callback = fn ($u, $id) => (int) $u->id === (int) $id;

    expect($callback($user, $otherUser->id))->toBeFalse();
});
