<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Notifications\AppointmentReminder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class SendAppointmentReminder implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $appointments = Appointment::where('status', AppointmentStatus::Confirmed)
            ->where('start_at', '>', now())
            ->where('start_at', '<=', now()->addHours(24))
            ->with('user')
            ->get();

        foreach ($appointments as $appointment) {
            $alreadySent = DB::table('notifications')
                ->where('notifiable_id', $appointment->user_id)
                ->where('notifiable_type', get_class($appointment->user))
                ->where('type', AppointmentReminder::class)
                ->whereJsonContains('data->appointment_id', $appointment->id)
                ->exists();

            if (! $alreadySent) {
                $appointment->user->notify(new AppointmentReminder($appointment));
            }
        }
    }
}
