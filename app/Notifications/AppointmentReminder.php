<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Mail\AppointmentReminder as AppointmentReminderMailable;
use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class AppointmentReminder extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): AppointmentReminderMailable
    {
        return new AppointmentReminderMailable($this->appointment);
    }

    public function toArray($notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'message' => 'Reminder: Appointment tomorrow for '.$this->appointment->service->name,
        ];
    }
}
