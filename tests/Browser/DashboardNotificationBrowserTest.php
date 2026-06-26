<?php

use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use App\Notifications\AppointmentConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows toast when notification arrives via WebSocket', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);
    $team = Team::factory()->create();
    $user->teams()->attach($team, ['role' => 'member']);
    $user->update(['current_team_id' => $team->id]);

    $page = visit('/login')
        ->assertNoJavaScriptErrors()
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->click('button[type="submit"]')
        ->assertNoJavaScriptErrors();

    $page->navigate("/{$team->slug}/dashboard")
        ->assertNoJavaScriptErrors();

    $service = Service::factory()->create();
    $appointment = Appointment::factory()
        ->for($user, 'user')
        ->for($team)
        ->for($service)
        ->create();

    $user->notify(new AppointmentConfirmation($appointment));

    $page->wait(2000)
        ->assertSee('Appointment confirmed')
        ->assertNoJavaScriptErrors();
});

it('shows unread badge count when multiple notifications arrive', function () {
    $user = User::factory()->create([
        'email' => 'badge@example.com',
        'password' => bcrypt('password'),
    ]);
    $team = Team::factory()->create();
    $user->teams()->attach($team, ['role' => 'member']);
    $user->update(['current_team_id' => $team->id]);

    $service = Service::factory()->create();

    $appointment1 = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();
    $appointment2 = Appointment::factory()->for($user, 'user')->for($team)->for($service)->create();

    $user->notify(new AppointmentConfirmation($appointment1));
    $user->notify(new AppointmentConfirmation($appointment2));

    $page = visit('/login')
        ->fill('email', 'badge@example.com')
        ->fill('password', 'password')
        ->click('button[type="submit"]');

    $page->navigate("/{$team->slug}/dashboard")
        ->assertNoJavaScriptErrors()
        ->assertSee('2');
});

it('dashboard loads without JavaScript errors', function () {
    $user = User::factory()->create([
        'email' => 'smoke@example.com',
        'password' => bcrypt('password'),
    ]);
    $team = Team::factory()->create();
    $user->teams()->attach($team, ['role' => 'member']);
    $user->update(['current_team_id' => $team->id]);

    visit('/login')
        ->fill('email', 'smoke@example.com')
        ->fill('password', 'password')
        ->click('button[type="submit"]');

    $page = visit("/{$team->slug}/dashboard");

    $page->assertNoJavaScriptErrors()
        ->assertNoConsoleLogs();
});
