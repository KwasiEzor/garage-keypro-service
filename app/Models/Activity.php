<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Activity extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'activity_log';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'log_name',
        'description',
        'subject_type',
        'subject_id',
        'causer_type',
        'causer_id',
        'properties',
        'event',
        'ip_address',
        'user_agent',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'properties' => 'array',
    ];

    /**
     * Get the subject of the activity.
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the causer of the activity.
     */
    public function causer(): MorphTo
    {
        return $this->morphTo();
    }
}
