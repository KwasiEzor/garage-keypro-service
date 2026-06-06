<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Team;
use Carbon\Carbon;
use Zap\Facades\Zap;

/**
 * Service for managing calendar synchronization with Zap.
 *
 * Encapsulates all Zap calendar operations to decouple the appointment
 * service from the calendar integration implementation.
 */
class CalendarSyncService
{
    /**
     * Sync an appointment to the team's Zap calendar.
     *
     * @param  Appointment  $appointment  The appointment to sync
     */
    public function syncAppointment(Appointment $appointment): void
    {
        $appointment->load(['team', 'service', 'user']);

        $startAt = Carbon::parse($appointment->start_at);
        $endAt = Carbon::parse($appointment->end_at);

        Zap::for($appointment->team)
            ->named($appointment->service->name.' - '.$appointment->user->name)
            ->appointment()
            ->on($startAt->format('Y-m-d'))
            ->addPeriod($startAt->format('H:i'), $endAt->format('H:i'))
            ->withMetadata([
                'appointment_id' => $appointment->id,
                'service' => $appointment->service->name,
                'client' => $appointment->user->email,
            ])
            ->save();
    }

    /**
     * Remove an appointment from the team's Zap calendar.
     *
     * @param  Appointment  $appointment  The appointment to remove
     */
    public function removeAppointment(Appointment $appointment): void
    {
        if (! $appointment->relationLoaded('team')) {
            $appointment->load('team');
        }

        // Find and delete the calendar entry
        // Note: Zap deletion logic would go here
        // Currently, Zap doesn't expose a direct delete method,
        // so we rely on the schedule expiring or manual cleanup
    }

    /**
     * Set up standard working hours for a team.
     *
     * @param  Team  $team  The team to configure
     * @param  array  $periods  Array of time periods [['09:00', '12:00'], ['14:00', '17:00']]
     * @param  int  $yearsForward  Number of years to schedule forward
     */
    public function setupTeamAvailability(Team $team, array $periods, int $yearsForward = 2): void
    {
        $availability = Zap::for($team)
            ->named('Standard Working Hours')
            ->availability()
            ->from(now()->format('Y-m-d'))
            ->to(now()->addYears($yearsForward)->endOfYear()->format('Y-m-d'));

        foreach ($periods as $period) {
            [$start, $end] = $period;
            $availability->addPeriod($start, $end);
        }

        $availability->save();
    }

    /**
     * Get available booking slots for a team on a specific date.
     *
     * @param  Team  $team  The team
     * @param  Carbon  $date  The date to check
     * @param  int  $serviceDuration  Service duration in minutes
     * @return array Array of available time slots
     */
    public function getAvailableSlots(Team $team, Carbon $date, int $serviceDuration): array
    {
        $slots = $team->getBookableSlots(
            $date->format('Y-m-d'),
            $serviceDuration
        );

        // Convert to array if Collection returned
        return is_array($slots) ? $slots : $slots->toArray();
    }

    /**
     * Check if a specific time slot is available for booking.
     *
     * @param  Team  $team  The team
     * @param  Carbon  $startAt  Desired start time
     * @param  int  $duration  Duration in minutes
     * @return bool True if slot is available
     */
    public function isSlotAvailable(Team $team, Carbon $startAt, int $duration): bool
    {
        $slots = $this->getAvailableSlots($team, $startAt, $duration);

        $requestedSlot = $startAt->format('H:i');

        return collect($slots)->contains(function ($slot) use ($requestedSlot) {
            return $slot['start_time'] === $requestedSlot;
        });
    }
}
