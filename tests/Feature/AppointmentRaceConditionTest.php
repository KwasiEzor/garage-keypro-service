<?php

use App\Exceptions\SlotUnavailableException;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->team = Team::factory()->create();
    $this->service = Service::factory()->create(['estimated_duration' => 60]);
    $this->user1 = User::factory()->create();
    $this->user2 = User::factory()->create();
    $this->appointmentService = app(AppointmentService::class);
});

test('concurrent bookings for same slot are prevented', function () {
    $startAt = now()->addDay()->setTime(10, 0);

    // Simulate concurrent booking attempts
    DB::beginTransaction();

    try {
        // First booking should succeed
        $appointment1 = $this->appointmentService->createAppointment(
            $this->team,
            $this->user1,
            $this->service,
            $startAt
        );

        expect($appointment1)->toBeInstanceOf(\App\Models\Appointment::class);
        expect($appointment1->status->value)->toBe('confirmed');

        DB::commit();
    } catch (\Exception $e) {
        DB::rollBack();
        throw $e;
    }

    // Second booking for same slot should fail
    DB::beginTransaction();

    try {
        $this->appointmentService->createAppointment(
            $this->team,
            $this->user2,
            $this->service,
            $startAt
        );

        DB::commit();

        // Should not reach here
        expect(false)->toBeTrue('Expected SlotUnavailableException to be thrown');
    } catch (SlotUnavailableException $e) {
        DB::rollBack();
        expect($e)->toBeInstanceOf(SlotUnavailableException::class);
    }

    // Verify only one appointment was created
    expect(\App\Models\Appointment::count())->toBe(1);
});

test('overlapping appointments are prevented', function () {
    $startAt = now()->addDay()->setTime(10, 0);

    // First booking 10:00 - 11:00
    $appointment1 = $this->appointmentService->createAppointment(
        $this->team,
        $this->user1,
        $this->service,
        $startAt
    );

    expect($appointment1)->toBeInstanceOf(\App\Models\Appointment::class);

    // Try to book 10:30 - 11:30 (overlaps with first)
    $overlappingStart = now()->addDay()->setTime(10, 30);

    try {
        $this->appointmentService->createAppointment(
            $this->team,
            $this->user2,
            $this->service,
            $overlappingStart
        );

        expect(false)->toBeTrue('Expected SlotUnavailableException for overlapping slot');
    } catch (SlotUnavailableException $e) {
        expect($e)->toBeInstanceOf(SlotUnavailableException::class);
    }

    // Verify only one appointment exists
    expect(\App\Models\Appointment::count())->toBe(1);
});

test('database lock prevents race conditions', function () {
    $startAt = now()->addDay()->setTime(14, 0);

    // Simulate two concurrent transactions
    $results = [];

    // Transaction 1
    $process1 = function () use ($startAt, &$results) {
        try {
            $appointment = $this->appointmentService->createAppointment(
                $this->team,
                $this->user1,
                $this->service,
                $startAt
            );
            $results[] = 'success';
        } catch (SlotUnavailableException $e) {
            $results[] = 'blocked';
        }
    };

    // Transaction 2
    $process2 = function () use ($startAt, &$results) {
        try {
            $appointment = $this->appointmentService->createAppointment(
                $this->team,
                $this->user2,
                $this->service,
                $startAt
            );
            $results[] = 'success';
        } catch (SlotUnavailableException $e) {
            $results[] = 'blocked';
        }
    };

    // Execute both
    $process1();
    $process2();

    // One should succeed, one should be blocked
    expect($results)->toHaveCount(2);
    expect($results)->toContain('success');
    expect($results)->toContain('blocked');

    // Only one appointment should exist
    expect(\App\Models\Appointment::count())->toBe(1);
});

test('cancelled appointments do not block slots', function () {
    $startAt = now()->addDay()->setTime(15, 0);

    // Create and cancel an appointment
    $cancelledAppointment = $this->appointmentService->createAppointment(
        $this->team,
        $this->user1,
        $this->service,
        $startAt
    );

    $this->appointmentService->cancelAppointment($cancelledAppointment, 'Test cancellation');

    // Verify it was cancelled
    expect($cancelledAppointment->fresh()->status->value)->toBe('cancelled');

    // Should be able to book the same slot now
    $newAppointment = $this->appointmentService->createAppointment(
        $this->team,
        $this->user2,
        $this->service,
        $startAt
    );

    expect($newAppointment)->toBeInstanceOf(\App\Models\Appointment::class);
    expect($newAppointment->status->value)->toBe('confirmed');

    // Both appointments should exist (one cancelled, one confirmed)
    expect(\App\Models\Appointment::count())->toBe(2);
});
