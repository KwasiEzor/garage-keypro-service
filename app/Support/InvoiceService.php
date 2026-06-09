<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\InvoiceStatus;
use App\Events\InvoiceCancelled;
use App\Events\InvoicePaid;
use App\Events\InvoiceSent;
use App\Events\InvoiceStatusChanged;
use App\Exceptions\InvalidInvoiceStateException;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * Recalculate all totals for the given invoice.
     *
     * Supports both per-item tax rates and invoice-level tax rate.
     */
    public function recalculateInvoice(Invoice $invoice): void
    {
        $invoice->loadMissing('items');

        $subtotal = 0;
        $taxTotal = 0;

        foreach ($invoice->items as $item) {
            $itemTotal = (float) $item->total_price;
            $subtotal += $itemTotal;

            // Use per-item tax if set, otherwise fall back to invoice tax_rate
            if ($item->tax_rate !== null) {
                $taxTotal += (float) $item->tax_amount;
            } elseif ($invoice->tax_rate > 0) {
                $taxTotal += round($itemTotal * ($invoice->tax_rate / 100), 2);
            }
        }

        $invoice->updateQuietly([
            'subtotal' => $subtotal,
            'tax_total' => $taxTotal,
            'total_amount' => $subtotal + $taxTotal,
        ]);
    }

    /**
     * Calculate the total price for a single line item.
     */
    public function calculateItemTotal(float $quantity, float $unitPrice): float
    {
        return round($quantity * $unitPrice, 2);
    }

    /**
     * Generate a unique invoice number for the given invoice.
     *
     * Uses DB transaction with row locking to prevent race conditions.
     */
    public function generateInvoiceNumber(Invoice $invoice): string
    {
        return DB::transaction(function () use ($invoice): string {
            // Lock the last invoice to prevent concurrent number generation
            $lastInvoice = Invoice::where('team_id', $invoice->team_id)
                ->lockForUpdate()
                ->latest('id')
                ->first();

            // Extract the sequence number from the last invoice
            $nextNumber = 1;
            if ($lastInvoice && preg_match('/INV-\d{4}-(\d{4})/', $lastInvoice->number, $matches)) {
                $nextNumber = ((int) $matches[1]) + 1;
            }

            return sprintf('INV-%s-%04d', now()->year, $nextNumber);
        });
    }

    /**
     * Mark invoice as sent and update sent_at timestamp.
     *
     * @throws InvalidInvoiceStateException
     */
    public function markAsSent(Invoice $invoice): void
    {
        if (! $invoice->status->canBeSent()) {
            throw InvalidInvoiceStateException::cannotTransition($invoice, InvoiceStatus::Sent);
        }

        $oldStatus = $invoice->status;

        $invoice->update([
            'status' => InvoiceStatus::Sent,
            'sent_at' => now(),
        ]);

        InvoiceSent::dispatch($invoice);
        InvoiceStatusChanged::dispatch($invoice, $oldStatus, InvoiceStatus::Sent);
    }

    /**
     * Mark invoice as paid and record payment details.
     *
     * @throws InvalidInvoiceStateException
     */
    public function markAsPaid(
        Invoice $invoice,
        string $paymentMethod,
        ?float $amountPaid = null,
        ?string $paymentReference = null
    ): void {
        if ($invoice->status === InvoiceStatus::Paid) {
            throw InvalidInvoiceStateException::cannotTransition($invoice, InvoiceStatus::Paid);
        }

        if ($invoice->status === InvoiceStatus::Cancelled) {
            throw InvalidInvoiceStateException::cannotTransition($invoice, InvoiceStatus::Paid);
        }

        $amountToRecord = $amountPaid ?? (float) $invoice->total_amount;

        DB::transaction(function () use ($invoice, $paymentMethod, $amountToRecord, $paymentReference): void {
            // Record the payment
            $invoice->payments()->create([
                'amount' => $amountToRecord,
                'payment_method' => $paymentMethod,
                'payment_reference' => $paymentReference,
                'paid_at' => now(),
            ]);

            $oldStatus = $invoice->status;
            $newAmountPaid = (float) $invoice->amount_paid + $amountToRecord;

            $updateData = [
                'amount_paid' => $newAmountPaid,
                'payment_method' => $paymentMethod,
                'payment_reference' => $paymentReference,
            ];

            // If fully paid, update status
            if ($newAmountPaid >= (float) $invoice->total_amount) {
                $updateData['status'] = InvoiceStatus::Paid;
                $updateData['paid_at'] = now();
            }

            $invoice->update($updateData);

            if ($invoice->status === InvoiceStatus::Paid) {
                InvoicePaid::dispatch($invoice, $paymentMethod, $paymentReference);
            }

            if ($oldStatus !== $invoice->status) {
                InvoiceStatusChanged::dispatch($invoice, $oldStatus, $invoice->status);
            }
        });
    }

    /**
     * Record a partial payment for the invoice.
     */
    public function recordPayment(
        Invoice $invoice,
        float $amount,
        string $paymentMethod,
        ?string $paymentReference = null,
        ?string $notes = null
    ): void {
        $this->markAsPaid($invoice, $paymentMethod, $amount, $paymentReference);

        if ($notes) {
            $invoice->payments()->latest()->first()->update(['notes' => $notes]);
        }
    }

    /**
     * Cancel the invoice.
     *
     * @throws InvalidInvoiceStateException
     */
    public function markAsCancelled(Invoice $invoice): void
    {
        if (! $invoice->status->canBeCancelled()) {
            throw InvalidInvoiceStateException::cannotTransition($invoice, InvoiceStatus::Cancelled);
        }

        $oldStatus = $invoice->status;

        $invoice->update([
            'status' => InvoiceStatus::Cancelled,
        ]);

        InvoiceCancelled::dispatch($invoice);
        InvoiceStatusChanged::dispatch($invoice, $oldStatus, InvoiceStatus::Cancelled);
    }
}
