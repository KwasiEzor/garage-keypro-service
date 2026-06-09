<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Mail\InvoiceMail;
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
        Mail::to($this->recipient)->send(new InvoiceMail($this->invoice, $this->type));

        logger()->info('Invoice email sent', [
            'invoice_id' => $this->invoice->id,
            'recipient_id' => $this->recipient->id,
            'type' => $this->type,
        ]);
    }
}
