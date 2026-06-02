<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendInvoiceEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Invoice $invoice,
        public User $recipient,
        public string $type = 'created'
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // TODO: Implement actual email sending
        // Mail::to($this->recipient)->send(new InvoiceMail($this->invoice, $this->type));

        logger()->info('Invoice email queued for sending', [
            'invoice_id' => $this->invoice->id,
            'recipient_id' => $this->recipient->id,
            'type' => $this->type,
        ]);
    }
}
