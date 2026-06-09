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

class AppointmentCancellation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Appointment $appointment,
        public ?string $cancellationReason = null
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = Setting::get(
            'email_appointment_cancellation_subject',
            'Appointment Cancelled - {service}'
        );

        $subject = str_replace(
            '{service}',
            $this->appointment->service->name ?? 'Service',
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
            view: 'emails.appointments.cancellation',
            with: [
                'cancellationReason' => $this->cancellationReason,
            ],
        );
    }
}
