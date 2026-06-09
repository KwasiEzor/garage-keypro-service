<?php

declare(strict_types=1);

namespace App\Observers;

use App\Events\InvoiceCreated;
use App\Models\Invoice;
use App\Support\InvoiceService;
use Illuminate\Support\Str;

class InvoiceObserver
{
    public function __construct(
        private readonly InvoiceService $invoiceService
    ) {}

    /**
     * Handle the Invoice "creating" event.
     *
     * Auto-generate UUID and invoice number if not set.
     */
    public function creating(Invoice $invoice): void
    {
        if (empty($invoice->uuid)) {
            $invoice->uuid = (string) Str::uuid();
        }

        if (empty($invoice->number)) {
            $invoice->number = $this->invoiceService->generateInvoiceNumber($invoice);
        }
    }

    /**
     * Handle the Invoice "created" event.
     *
     * Dispatch InvoiceCreated event for listeners.
     */
    public function created(Invoice $invoice): void
    {
        InvoiceCreated::dispatch($invoice);
    }
}
