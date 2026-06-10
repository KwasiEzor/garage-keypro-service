<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Appointment;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Spatie\CalendarLinks\Link;

class AppointmentReminder extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Appointment $appointment
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = Setting::get(
            'email_appointment_reminder_subject',
            'Reminder: Your Appointment Tomorrow at {time}'
        );

        $subject = str_replace(
            ['{time}', '{date}'],
            [
                $this->appointment->start_at->format('g:i A'),
                $this->appointment->start_at->format('M j, Y'),
            ],
            $subject
        );

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointments.reminder',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
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
            Attachment::fromData(fn () => $icsContent, 'appointment-reminder.ics')
                ->withMime('text/calendar'),
        ];
    }
}
