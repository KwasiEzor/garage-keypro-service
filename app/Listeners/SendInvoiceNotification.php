<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\InvoicePaid;
use App\Events\InvoiceSent;
use App\Jobs\SendInvoiceEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Events\Dispatcher;

class SendInvoiceNotification implements ShouldQueue
{
    /**
     * Handle the InvoicePaid event.
     */
    public function handlePaid(InvoicePaid $event): void
    {
        SendInvoiceEmail::dispatch($event->invoice, $event->invoice->client, 'paid');
    }

    /**
     * Handle the InvoiceSent event.
     */
    public function handleSent(InvoiceSent $event): void
    {
        SendInvoiceEmail::dispatch($event->invoice, $event->invoice->client, 'sent');
    }

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            InvoicePaid::class,
            [SendInvoiceNotification::class, 'handlePaid']
        );

        $events->listen(
            InvoiceSent::class,
            [SendInvoiceNotification::class, 'handleSent']
        );
    }
}
