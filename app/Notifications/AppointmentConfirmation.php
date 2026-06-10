<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Spatie\CalendarLinks\Link;

class AppointmentConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Appointment $appointment)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $appointment = $this->appointment->load(['service', 'team']);

        $link = Link::create(
            $appointment->service->name,
            $appointment->start_at,
            $appointment->end_at
        )
            ->description($appointment->notes ?? '')
            ->address($appointment->team->name);

        $icsContent = $link->ics([
            'UID' => "appointment-{$appointment->id}@".config('app.url'),
        ], ['format' => 'file']);

        return (new MailMessage)
            ->subject('Appointment Confirmed - '.$appointment->service->name)
            ->view('emails.appointments.confirmation', [
                'appointment' => $appointment,
                'notifiable' => $notifiable,
            ])
            ->attachData($icsContent, 'appointment.ics', [
                'mime' => 'text/calendar',
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'service_name' => $this->appointment->service->name,
            'team_name' => $this->appointment->team->name,
            'start_at' => $this->appointment->start_at->toISOString(),
            'end_at' => $this->appointment->end_at->toISOString(),
            'status' => $this->appointment->status->value,
        ];
    }
}
