<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamSettings extends Model
{
    protected $fillable = [
        'team_id',
        'buffer_minutes',
        'max_advance_booking_days',
        'min_advance_booking_hours',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
