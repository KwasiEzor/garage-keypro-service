<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Appointment;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmation extends Mailable implements ShouldQueue
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
            'email_appointment_confirmation_subject',
            'Appointment Confirmed - {service} on {date}'
        );

        $subject = str_replace(
            ['{service}', '{date}'],
            [
                $this->appointment->service->name ?? 'Service',
                $this->appointment->appointment_date->format('M j, Y'),
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
            view: 'emails.appointments.confirmation',
        );
    }
}
