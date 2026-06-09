<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Appointment;
use App\Models\Setting;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduled extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Appointment $appointment,
        public ?CarbonImmutable $oldDate = null
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = Setting::get(
            'email_appointment_rescheduled_subject',
            'Appointment Rescheduled - New Time: {date}'
        );

        $subject = str_replace(
            '{date}',
            $this->appointment->appointment_date->format('M j, Y'),
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
            view: 'emails.appointments.rescheduled',
            with: [
                'oldDate' => $this->oldDate,
            ],
        );
    }
}
