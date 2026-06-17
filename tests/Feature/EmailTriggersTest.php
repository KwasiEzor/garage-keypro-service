<?php

use App\Enums\AppointmentStatus;
use App\Enums\InvoiceStatus;
use App\Mail\AppointmentCancellation;
use App\Mail\AppointmentRescheduled;
use App\Mail\InvoiceMail;
use App\Mail\WelcomeEmail;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use App\Notifications\AppointmentConfirmation;
use App\Services\AppointmentService;
use App\Support\InvoiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
    config(['queue.default' => 'sync']);
});

test('new user registration sends welcome email', function () {
    Mail::fake();

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    Mail::assertQueued(WelcomeEmail::class, function ($mail) {
        return $mail->hasTo('test@example.com');
    });
});

test('booking an appointment sends confirmation notification', function () {
    Notification::fake();
    $user = User::factory()->create();
    $team = Team::factory()->create(['is_personal' => false]);
    $service = Service::factory()->create(['is_active' => true, 'estimated_duration' => 60]);

    app(AppointmentService::class)->setupDefaultAvailability($team);

    $date = now()->next('Monday');
    $slots = app(AppointmentService::class)->getAvailableSlots($team, $date, $service);
    $slot = $slots->first()['start_time'];

    $this->actingAs($user)->post(route('appointments.store'), [
        'team_id' => $team->id,
        'service_id' => $service->id,
        'date' => $date->format('Y-m-d'),
        'slot' => $slot,
    ])->assertRedirect();

    Notification::assertSentTo($user, AppointmentConfirmation::class);
});

test('cancelling an appointment sends cancellation email', function () {
    Mail::fake();
    $user = User::factory()->create();
    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => AppointmentStatus::Confirmed,
    ]);

    $this->actingAs($user)->delete(route('appointments.cancel', $appointment), [
        'reason' => 'Too busy',
    ])->assertRedirect();

    Mail::assertQueued(AppointmentCancellation::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email) && $mail->cancellationReason === 'Too busy';
    });
});

test('rescheduling an appointment sends rescheduled email', function () {
    Mail::fake();
    $user = User::factory()->create();
    $team = Team::factory()->create(['is_personal' => false]);
    $service = Service::factory()->create(['is_active' => true, 'estimated_duration' => 60]);

    app(AppointmentService::class)->setupDefaultAvailability($team);

    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'team_id' => $team->id,
        'service_id' => $service->id,
        'start_at' => now()->addDays(2),
        'status' => AppointmentStatus::Confirmed,
    ]);

    $date = now()->next('Tuesday');
    $slots = app(AppointmentService::class)->getAvailableSlots($team, $date, $service);
    $slot = $slots->first()['start_time'];

    $this->actingAs($user)->post(route('appointments.reschedule.process', $appointment), [
        'team_id' => $team->id,
        'service_id' => $service->id,
        'date' => $date->format('Y-m-d'),
        'slot' => $slot,
    ])->assertRedirect();

    Mail::assertQueued(AppointmentRescheduled::class);
});

test('marking invoice as sent triggers invoice email', function () {
    Mail::fake();
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'client_id' => $user->id,
        'status' => InvoiceStatus::Draft,
    ]);

    app(InvoiceService::class)->markAsSent($invoice);

    Mail::assertSent(InvoiceMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email) && $mail->type === 'sent';
    });
});

test('marking invoice as paid triggers payment receipt email', function () {
    Mail::fake();
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'client_id' => $user->id,
        'total_amount' => 100,
        'amount_paid' => 0,
        'status' => InvoiceStatus::Sent,
    ]);

    app(InvoiceService::class)->markAsPaid($invoice, 'Credit Card', 100);

    Mail::assertSent(InvoiceMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email) && $mail->type === 'paid';
    });
});
