<?php

namespace App\Exceptions;

use Carbon\CarbonInterface;
use Exception;

class SlotUnavailableException extends Exception
{
    public static function forTime(CarbonInterface $startAt): self
    {
        return new self(
            "The time slot at {$startAt->format('Y-m-d H:i')} is no longer available."
        );
    }
}
