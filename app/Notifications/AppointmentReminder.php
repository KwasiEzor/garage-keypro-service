<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Spatie\CalendarLinks\Link;

class AppointmentReminder extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reminder: Appointment Tomorrow - '.$this->appointment->service->name)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('This is a reminder for your appointment tomorrow.')
            ->line('Service: '.$this->appointment->service->name)
            ->line('Date: '.$this->appointment->start_at->format('l, F j, Y'))
            ->line('Time: '.$this->appointment->start_at->format('g:i A'))
            ->line('Location: '.$this->appointment->team->name)
            ->action('View Appointment', route('appointments.show', $this->appointment))
            ->attach($this->generateIcsAttachment());
    }

    public function toArray($notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'message' => 'Reminder: Appointment tomorrow for '.$this->appointment->service->name,
        ];
    }

    protected function generateIcsAttachment(): array
    {
        $link = Link::create(
            $this->appointment->service->name,
            $this->appointment->start_at,
            $this->appointment->end_at
        )
            ->description($this->appointment->notes ?? '')
            ->address($this->appointment->team->name);

        $icsContent = $link->ics([
            'UID' => "appointment-{$this->appointment->id}@".config('app.url'),
        ], ['format' => 'file']);

        return [
            'data' => $icsContent,
            'name' => 'appointment-reminder.ics',
            'options' => ['mime' => 'text/calendar'],
        ];
    }
}
