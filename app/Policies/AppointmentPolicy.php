<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Users can view their own appointments
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->user_id ||
               $user->belongsToTeam($appointment->team);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can book appointments
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        return $user->belongsToTeam($appointment->team);
    }

    /**
     * Determine whether the user can cancel the appointment.
     */
    public function cancel(User $user, Appointment $appointment): bool
    {
        // Owner can cancel if:
        // - They own the appointment
        // - Status is cancelable (pending or confirmed)
        // - Appointment starts more than 2 hours from now
        return $user->id === $appointment->user_id
            && $appointment->status->canBeCancelled()
            && $appointment->start_at->isFuture()
            && $appointment->start_at->isAfter(now()->addHours(2));
    }

    /**
     * Determine whether the user can reschedule the appointment.
     */
    public function reschedule(User $user, Appointment $appointment): bool
    {
        // Same rules as cancel - owner can reschedule with 2h notice
        return $user->id === $appointment->user_id
            && $appointment->status->canBeCancelled()
            && $appointment->start_at->isFuture()
            && $appointment->start_at->isAfter(now()->addHours(2));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->belongsToTeam($appointment->team);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Appointment $appointment): bool
    {
        return $user->belongsToTeam($appointment->team);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Appointment $appointment): bool
    {
        return false; // Never allow permanent deletion
    }
}
