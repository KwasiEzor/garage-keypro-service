<?php

namespace App\Models;

use Database\Factories\LeadFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    /** @use HasFactory<LeadFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'vehicle_make',
        'vehicle_model',
        'vehicle_year',
        'service_id',
        'message',
        'status',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'contacted_at',
        'assigned_to',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'contacted_at' => 'datetime',
        ];
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }
}
