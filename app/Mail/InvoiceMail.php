<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Invoice;
use App\Models\Setting;
use App\Services\InvoicePdfGenerator;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Invoice $invoice,
        public string $type = 'created'
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subjectKeys = [
            'created' => 'email_invoice_sent_subject',
            'sent' => 'email_invoice_sent_subject',
            'paid' => 'email_invoice_paid_subject',
            'overdue' => 'email_invoice_overdue_subject',
        ];

        $defaultSubjects = [
            'created' => 'Invoice #{number} from GarageKeyPro',
            'sent' => 'Invoice #{number} from GarageKeyPro',
            'paid' => 'Payment Receipt - Invoice #{number}',
            'overdue' => 'Payment Reminder - Invoice #{number} Overdue',
        ];

        $subject = Setting::get(
            $subjectKeys[$this->type] ?? 'email_invoice_sent_subject',
            $defaultSubjects[$this->type] ?? 'Invoice #{number}'
        );

        $subject = str_replace('{number}', $this->invoice->number, $subject);

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Use new branded templates for sent and paid, keep markdown for others
        $view = match ($this->type) {
            'sent' => 'emails.invoices.sent',
            'paid' => 'emails.invoices.paid',
            default => null,
        };

        if ($view) {
            return new Content(
                view: $view,
            );
        }

        return new Content(
            markdown: 'emails.invoices.notification',
            with: [
                'invoice' => $this->invoice,
                'type' => $this->type,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $pdf = app(InvoicePdfGenerator::class)->generate($this->invoice);

        return [
            Attachment::fromData(fn () => $pdf->output(), "invoice-{$this->invoice->number}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
