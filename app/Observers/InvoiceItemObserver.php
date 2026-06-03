<?php

namespace App\Observers;

use App\Models\InvoiceItem;
use App\Support\InvoiceService;

class InvoiceItemObserver
{
    public function __construct(
        private readonly InvoiceService $invoiceService
    ) {}

    /**
     * Handle the InvoiceItem "saving" event.
     *
     * Auto-calculate total_price and tax_amount before saving.
     */
    public function saving(InvoiceItem $item): void
    {
        // Calculate item total
        $item->total_price = $this->invoiceService->calculateItemTotal(
            (float) $item->quantity,
            (float) $item->unit_price
        );

        // Calculate tax amount if tax_rate is set
        if ($item->tax_rate !== null) {
            $item->tax_amount = round($item->total_price * ($item->tax_rate / 100), 2);
        } else {
            $item->tax_amount = 0;
        }
    }

    /**
     * Handle the InvoiceItem "saved" event.
     *
     * Recalculate invoice totals when item changes.
     */
    public function saved(InvoiceItem $item): void
    {
        $invoice = $item->invoice()->first();
        if ($invoice) {
            $this->invoiceService->recalculateInvoice($invoice);
        }
    }

    /**
     * Handle the InvoiceItem "deleted" event.
     *
     * Recalculate invoice totals when item is deleted.
     */
    public function deleted(InvoiceItem $item): void
    {
        $invoice = $item->invoice()->first();
        if ($invoice) {
            $this->invoiceService->recalculateInvoice($invoice);
        }
    }
}
