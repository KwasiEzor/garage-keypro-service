<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\LeadFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $vehicle_make
 * @property string|null $vehicle_model
 * @property string|null $vehicle_year
 * @property int|null $service_id
 * @property string|null $message
 * @property string $status
 * @property string $source
 * @property string|null $utm_source
 * @property string|null $utm_medium
 * @property string|null $utm_campaign
 * @property CarbonImmutable|null $contacted_at
 * @property int|null $assigned_to
 * @property string|null $notes
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User|null $assignedUser
 * @property-read Service|null $service
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead bySource(string $source)
 * @method static \Database\Factories\LeadFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead new()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereContactedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereServiceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereUtmCampaign($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereUtmMedium($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereUtmSource($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereVehicleMake($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereVehicleModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lead whereVehicleYear($value)
 *
 * @mixin \Eloquent
 */
class Lead extends Model
{
    /** @use HasFactory<LeadFactory> */
    use HasFactory;

    use SoftDeletes;

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

    #[\Override]
    protected function casts(): array
    {
        return [
            'contacted_at' => 'datetime',
        ];
    }

    /**
     * Get the service requested by the lead.
     *
     * @return BelongsTo<Service, Lead>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the user assigned to this lead.
     *
     * @return BelongsTo<User, Lead>
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Scope a query to only include new leads.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    protected function scopeNew(Builder $query): Builder
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope a query to filter leads by source.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    protected function scopeBySource(Builder $query, string $source): Builder
    {
        return $query->where('source', $source);
    }
}
