<?php

namespace App\Mail;

use App\Models\Invoice;
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
        $subjects = [
            'created' => "New Invoice #{$this->invoice->number}",
            'sent' => "Invoice #{$this->invoice->number} from {$this->invoice->team->name}",
            'paid' => "Receipt for Invoice #{$this->invoice->number}",
            'overdue' => "URGENT: Invoice #{$this->invoice->number} is overdue",
        ];

        return new Envelope(
            subject: $subjects[$this->type] ?? "Invoice #{$this->invoice->number}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
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
