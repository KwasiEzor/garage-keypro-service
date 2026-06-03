<?php

namespace App\Services;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class InvoicePdfGenerator
{
    /**
     * Generate a PDF instance for the given invoice.
     */
    public function generate(Invoice $invoice): \Barryvdh\DomPDF\PDF
    {
        return Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice->load(['client', 'team', 'items']),
        ]);
    }

    /**
     * Download the invoice as a PDF file.
     */
    public function download(Invoice $invoice): Response
    {
        return $this->generate($invoice)
            ->download("invoice-{$invoice->number}.pdf");
    }

    /**
     * Stream the invoice PDF in the browser.
     */
    public function stream(Invoice $invoice): Response
    {
        return $this->generate($invoice)
            ->stream("invoice-{$invoice->number}.pdf");
    }
}
