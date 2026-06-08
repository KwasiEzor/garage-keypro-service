<?php

namespace App\Models;

use Zap\Models\Schedule as ZapSchedule;

/**
 * Extend Zap's Schedule model to use it in the application.
 * This ensures all Zap scheduling features work correctly.
 */
class Schedule extends ZapSchedule
{
    // Inherits all functionality from Zap\Models\Schedule
}
