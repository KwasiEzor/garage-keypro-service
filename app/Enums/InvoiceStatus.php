<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum InvoiceStatus: string implements HasColor, HasLabel
{
    case Draft = 'draft';
    case Sent = 'sent';
    case Paid = 'paid';
    case Cancelled = 'cancelled';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Sent => 'Sent',
            self::Paid => 'Paid',
            self::Cancelled => 'Cancelled',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Sent => 'info',
            self::Paid => 'success',
            self::Cancelled => 'danger',
        };
    }

    public function canBeEdited(): bool
    {
        return $this === self::Draft;
    }

    public function canBeSent(): bool
    {
        return $this === self::Draft;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this, [self::Draft, self::Sent]);
    }
}
