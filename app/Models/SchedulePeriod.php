<?php

namespace App\Models;

use Zap\Models\SchedulePeriod as ZapSchedulePeriod;

/**
 * Extend Zap's SchedulePeriod model to use it in the application.
 * This ensures all Zap scheduling features work correctly.
 */
class SchedulePeriod extends ZapSchedulePeriod
{
    // Inherits all functionality from Zap\Models\SchedulePeriod
}
