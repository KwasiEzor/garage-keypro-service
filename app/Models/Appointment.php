<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $team_id
 * @property int $user_id
 * @property int $service_id
 * @property CarbonImmutable $start_at
 * @property CarbonImmutable $end_at
 * @property AppointmentStatus $status
 * @property string|null $notes
 * @property string|null $cancellation_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property CarbonImmutable|null $deleted_at
 * @property-read Team $team
 * @property-read User $user
 * @property-read Service $service
 *
 * @method static \Database\Factories\AppointmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment withoutTrashed()
 *
 * @mixin \Eloquent
 */
class Appointment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'team_id',
        'user_id',
        'service_id',
        'start_at',
        'end_at',
        'status',
        'notes',
        'cancellation_reason',
    ];

    /**
     * Get the team that owns the appointment.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the user (client) for the appointment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service for the appointment.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope for upcoming appointments (future, not cancelled/no-show).
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_at', '>=', now())
            ->whereNotIn('status', [AppointmentStatus::Cancelled->value, AppointmentStatus::NoShow->value])
            ->orderBy('start_at');
    }

    /**
     * Scope for past appointments (completed or in the past).
     */
    public function scopePast($query)
    {
        return $query->where(function ($q) {
            $q->where('start_at', '<', now())
                ->orWhere('status', AppointmentStatus::Completed->value);
        })
            ->whereNotIn('status', [AppointmentStatus::Cancelled->value, AppointmentStatus::NoShow->value])
            ->orderBy('start_at', 'desc');
    }

    /**
     * Scope for cancelled appointments.
     */
    public function scopeCancelled($query)
    {
        return $query->whereIn('status', [AppointmentStatus::Cancelled->value, AppointmentStatus::NoShow->value])
            ->orderBy('start_at', 'desc');
    }

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'status' => AppointmentStatus::class,
            'start_at' => 'datetime',
            'end_at' => 'datetime',
        ];
    }
}
