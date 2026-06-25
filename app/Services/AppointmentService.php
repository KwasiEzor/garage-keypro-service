<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Exceptions\SlotUnavailableException;
use App\Jobs\SyncAppointmentToCalendar;
use App\Mail\AppointmentCancellation;
use App\Mail\AppointmentRescheduled;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\TeamSettings;
use App\Models\User;
use App\Notifications\AppointmentConfirmation;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Zap\Facades\Zap;
use Zap\Models\Schedule;

class AppointmentService
{
    /**
     * Get available booking slots for a team on a specific date.
     */
    public function getAvailableSlots(Team $team, CarbonInterface $date, Service $service, int $bufferMinutes = 15): Collection
    {
        $slots = $team->getBookableSlots(
            $date->format('Y-m-d'),
            $service->estimated_duration,
            $bufferMinutes
        );

        return is_array($slots) ? collect($slots) : $slots;
    }

    /**
     * Create an appointment with race condition protection.
     * Queues confirmation email and calendar sync after the transaction commits.
     *
     * @throws SlotUnavailableException
     */
    public function createAppointment(Team $team, User $client, Service $service, CarbonInterface $startAt, ?string $notes = null): Appointment
    {
        return DB::transaction(function () use ($team, $client, $service, $startAt, $notes) {
            $timezone = $team->timezone ?? 'Europe/Paris';
            if (! in_array($timezone, \DateTimeZone::listIdentifiers(), true)) {
                throw ValidationException::withMessages([
                    'timezone' => 'Invalid timezone specified for team',
                ]);
            }

            $teamTz = new \DateTimeZone($timezone);
            $startAt = Carbon::parse($startAt, $teamTz)->utc();
            $endAt = $startAt->copy()->addMinutes($service->estimated_duration);

            $settings = $team->settings ?? new TeamSettings(['team_id' => $team->id]);

            if ($startAt->lt(now()->addHours($settings->min_advance_booking_hours))) {
                throw ValidationException::withMessages([
                    'slot' => 'Must book at least '.$settings->min_advance_booking_hours.' hours in advance',
                ]);
            }

            // CRITICAL: Lock check — prevent double-booking under concurrent requests
            $conflict = Appointment::where('team_id', $team->id)
                ->where(function ($query) use ($startAt, $endAt) {
                    $query->whereBetween('start_at', [$startAt, $endAt->subSecond()])
                        ->orWhereBetween('end_at', [$startAt->addSecond(), $endAt])
                        ->orWhere(function ($q) use ($startAt, $endAt) {
                            $q->where('start_at', '<=', $startAt)
                                ->where('end_at', '>=', $endAt);
                        });
                })
                ->whereNotIn('status', [AppointmentStatus::Cancelled->value, AppointmentStatus::NoShow->value])
                ->lockForUpdate()
                ->exists();

            if ($conflict) {
                throw SlotUnavailableException::forTime($startAt);
            }

            $appointment = Appointment::create([
                'team_id' => $team->id,
                'user_id' => $client->id,
                'service_id' => $service->id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'notes' => $notes,
                'status' => AppointmentStatus::Confirmed,
            ]);

            DB::afterCommit(function () use ($appointment, $client) {
                $client->notify(new AppointmentConfirmation($appointment));
                dispatch(new SyncAppointmentToCalendar($appointment));
            });

            return $appointment;
        });
    }

    /**
     * Cancel an appointment, clean up Zap schedules, and queue a cancellation email.
     */
    public function cancelAppointment(Appointment $appointment, string $reason): void
    {
        $user = $appointment->user;

        DB::transaction(function () use ($appointment, $reason) {
            $appointment->update([
                'status' => AppointmentStatus::Cancelled,
                'cancellation_reason' => $reason,
            ]);

            Schedule::where('metadata->appointment_id', $appointment->id)->delete();
        });

        DB::afterCommit(function () use ($appointment, $user, $reason) {
            Mail::to($user)->queue(new AppointmentCancellation($appointment, $reason));
        });
    }

    /**
     * Reschedule an appointment: cancel the old slot and book a new one atomically.
     * Queues a rescheduled email after both operations commit.
     *
     * @throws SlotUnavailableException
     */
    public function rescheduleAppointment(Appointment $appointment, Team $team, User $client, Service $service, CarbonInterface $newStartAt, ?string $notes = null): Appointment
    {
        $oldStartAt = CarbonImmutable::parse($appointment->start_at);

        $newAppointment = DB::transaction(function () use ($appointment, $team, $client, $service, $newStartAt, $notes) {
            // Lock to prevent concurrent reschedule on the same appointment
            Appointment::where('id', $appointment->id)->lockForUpdate()->firstOrFail();

            $this->cancelAppointment($appointment, 'Rescheduled to new time');

            return $this->createAppointment($team, $client, $service, $newStartAt, $notes);
        });

        DB::afterCommit(function () use ($newAppointment, $client, $oldStartAt) {
            Mail::to($client)->queue(new AppointmentRescheduled($newAppointment, $oldStartAt));
        });

        return $newAppointment;
    }

    /**
     * Setup default working hours for a team.
     */
    public function setupDefaultAvailability(Team $team): void
    {
        Zap::for($team)
            ->named('Standard Working Hours')
            ->availability()
            ->from(now()->format('Y-m-d'))
            ->to(now()->addYears(2)->endOfYear()->format('Y-m-d'))
            ->addPeriod('09:00', '12:00')
            ->addPeriod('13:00', '18:00')
            ->weekly(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
            ->save();

        Zap::for($team)
            ->named('Saturday Hours')
            ->availability()
            ->from(now()->format('Y-m-d'))
            ->to(now()->addYears(2)->endOfYear()->format('Y-m-d'))
            ->addPeriod('09:00', '13:00')
            ->weekly(['saturday'])
            ->save();
    }
}
