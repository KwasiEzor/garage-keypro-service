<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\CalendarSyncService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncAppointmentToCalendar implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Appointment $appointment
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(CalendarSyncService $calendarSync): void
    {
        $calendarSync->syncAppointment($this->appointment);
    }
}
