<?php

declare(strict_types=1);

use App\Models\User;
use App\Notifications\VerifyEmailNotification as VerifyEmail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

test('newly registered users must verify email', function () {
    $user = User::factory()->create(['email_verified_at' => null]);

    expect($user->hasVerifiedEmail())->toBeFalse();
});

test('users can verify their email', function () {
    $user = User::factory()->create(['email_verified_at' => null]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertRedirect();
});

test('email verification notification is sent on registration', function () {
    Notification::fake();

    $user = User::factory()->create(['email_verified_at' => null]);

    event(new Registered($user));

    Notification::assertSentTo($user, VerifyEmail::class);
});

test('unverified users cannot access appointments', function () {
    $user = User::factory()->create(['email_verified_at' => null]);

    $response = $this->actingAs($user)->get('/appointments');

    $response->assertRedirect('/email/verify');
});

test('verified users can access appointments', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/appointments');

    $response->assertOk();
});

test('users can resend verification email', function () {
    Notification::fake();

    $user = User::factory()->create(['email_verified_at' => null]);

    $response = $this->actingAs($user)->post('/email/verification-notification');

    Notification::assertSentTo($user, VerifyEmail::class);
    $response->assertSessionHas('status', 'verification-link-sent');
});

test('verify email view is rendered', function () {
    $user = User::factory()->create(['email_verified_at' => null]);

    $response = $this->actingAs($user)->get('/email/verify');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('auth/verify-email'));
});
