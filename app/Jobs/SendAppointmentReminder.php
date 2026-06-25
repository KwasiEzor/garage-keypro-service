<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Notifications\AppointmentReminder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendAppointmentReminder implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Appointment::where('status', AppointmentStatus::Confirmed)
            ->where('start_at', '>', now())
            ->where('start_at', '<=', now()->addHours(24))
            ->whereNull('reminded_at')
            ->with('user')
            ->chunkById(50, function ($appointments): void {
                foreach ($appointments as $appointment) {
                    $appointment->user->notify(new AppointmentReminder($appointment));
                    $appointment->reminded_at = now();
                    $appointment->saveQuietly();
                }
            });
    }
}
