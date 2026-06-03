<?php

namespace App\Exceptions;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Exception;

class InvalidInvoiceStateException extends Exception
{
    public static function cannotTransition(Invoice $invoice, InvoiceStatus $targetStatus): self
    {
        return new self(
            "Cannot transition invoice #{$invoice->number} from {$invoice->status->value} to {$targetStatus->value}"
        );
    }
}
