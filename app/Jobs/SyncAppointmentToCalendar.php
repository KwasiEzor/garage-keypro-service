<?php

namespace App\Jobs;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Zap\Facades\Zap;

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
    public function handle(): void
    {
        // Load relationships needed for calendar sync
        $this->appointment->load(['team', 'service', 'user']);

        $startAt = Carbon::parse($this->appointment->start_at);
        $endAt = Carbon::parse($this->appointment->end_at);

        // Sync appointment to Zap calendar
        Zap::for($this->appointment->team)
            ->named($this->appointment->service->name.' - '.$this->appointment->user->name)
            ->appointment()
            ->on($startAt->format('Y-m-d'))
            ->addPeriod($startAt->format('H:i'), $endAt->format('H:i'))
            ->withMetadata([
                'appointment_id' => $this->appointment->id,
                'service' => $this->appointment->service->name,
                'client' => $this->appointment->user->email,
            ])
            ->save();
    }
}
