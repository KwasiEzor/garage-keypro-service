<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Exceptions\SlotUnavailableException;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Team;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Zap\Facades\Zap;

class AppointmentService
{
    /**
     * Get available booking slots for a team on a specific date.
     */
    public function getAvailableSlots(Team $team, CarbonInterface $date, Service $service, int $bufferMinutes = 15): Collection
    {
        return collect($team->getBookableSlots(
            $date->format('Y-m-d'),
            $service->estimated_duration,
            $bufferMinutes
        ));
    }

    /**
     * Create an appointment with race condition protection.
     *
     * @throws SlotUnavailableException
     */
    public function createAppointment(Team $team, User $client, Service $service, CarbonInterface $startAt, ?string $notes = null): Appointment
    {
        return DB::transaction(function () use ($team, $client, $service, $startAt, $notes) {
            $endAt = $startAt->copy()->addMinutes($service->estimated_duration);

            // CRITICAL: Lock check - prevent double-booking
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

            // Create appointment record
            $appointment = Appointment::create([
                'team_id' => $team->id,
                'user_id' => $client->id,
                'service_id' => $service->id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'notes' => $notes,
                'status' => AppointmentStatus::Confirmed,
            ]);

            // Sync with Zap (for UI calendar integration)
            Zap::for($team)
                ->named($service->name.' - '.$client->name)
                ->appointment()
                ->on($startAt->format('Y-m-d'))
                ->addPeriod($startAt->format('H:i'), $endAt->format('H:i'))
                ->withMetadata([
                    'appointment_id' => $appointment->id,
                    'client_id' => $client->id,
                    'service_id' => $service->id,
                    'notes' => $notes,
                ])
                ->save();

            return $appointment;
        });
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
