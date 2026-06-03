<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\InvoiceCancelled;
use App\Events\InvoiceCreated;
use App\Events\InvoiceOverdue;
use App\Events\InvoicePaid;
use App\Events\InvoiceSent;
use App\Events\InvoiceStatusChanged;
use App\Support\ActivityLogger;

class LogInvoiceActivity
{
    /**
     * Handle invoice created event.
     */
    public function handleCreated(InvoiceCreated $event): void
    {
        ActivityLogger::log(
            description: "Invoice #{$event->invoice->number} created",
            subject: $event->invoice,
            logName: 'invoice',
            event: 'created'
        );
    }

    /**
     * Handle invoice sent event.
     */
    public function handleSent(InvoiceSent $event): void
    {
        ActivityLogger::log(
            description: "Invoice #{$event->invoice->number} sent to client",
            subject: $event->invoice,
            logName: 'invoice',
            event: 'sent'
        );
    }

    /**
     * Handle invoice paid event.
     */
    public function handlePaid(InvoicePaid $event): void
    {
        ActivityLogger::log(
            description: "Invoice #{$event->invoice->number} marked as paid via {$event->paymentMethod}",
            subject: $event->invoice,
            logName: 'invoice',
            event: 'paid',
            properties: [
                'payment_method' => $event->paymentMethod,
                'payment_reference' => $event->paymentReference,
                'amount' => (float) $event->invoice->total_amount,
            ]
        );
    }

    /**
     * Handle invoice cancelled event.
     */
    public function handleCancelled(InvoiceCancelled $event): void
    {
        ActivityLogger::log(
            description: "Invoice #{$event->invoice->number} cancelled",
            subject: $event->invoice,
            logName: 'invoice',
            event: 'cancelled'
        );
    }

    /**
     * Handle invoice status changed event.
     */
    public function handleStatusChanged(InvoiceStatusChanged $event): void
    {
        ActivityLogger::log(
            description: "Invoice #{$event->invoice->number} status changed from {$event->oldStatus->value} to {$event->newStatus->value}",
            subject: $event->invoice,
            logName: 'invoice',
            event: 'status_changed',
            properties: [
                'old_status' => $event->oldStatus->value,
                'new_status' => $event->newStatus->value,
            ]
        );
    }

    /**
     * Handle invoice overdue event.
     */
    public function handleOverdue(InvoiceOverdue $event): void
    {
        ActivityLogger::log(
            description: "Invoice #{$event->invoice->number} identified as overdue",
            subject: $event->invoice,
            logName: 'invoice',
            event: 'overdue'
        );
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(): array
    {
        return [
            InvoiceCreated::class => 'handleCreated',
            InvoiceSent::class => 'handleSent',
            InvoicePaid::class => 'handlePaid',
            InvoiceCancelled::class => 'handleCancelled',
            InvoiceOverdue::class => 'handleOverdue',
            InvoiceStatusChanged::class => 'handleStatusChanged',
        ];
    }
}
