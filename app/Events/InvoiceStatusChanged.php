<?php

declare(strict_types=1);

namespace App\Events;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InvoiceStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Invoice $invoice,
        public readonly InvoiceStatus $oldStatus,
        public readonly InvoiceStatus $newStatus
    ) {}
}
