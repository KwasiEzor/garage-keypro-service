<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\BrandFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $logo_path
 * @property bool $is_featured
 * @property bool $is_active
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, Service> $services
 * @property-read int|null $services_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand active()
 * @method static \Database\Factories\BrandFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand featured()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereLogoPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Brand extends Model
{
    /** @use HasFactory<BrandFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo_path',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    #[\Override]
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the services associated with this brand.
     *
     * @return BelongsToMany<Service>
     */
    public function services()
    {
        return $this->belongsToMany(Service::class)->withPivot('price', 'notes')->withTimestamps();
    }

    /**
     * Scope to only featured and active brands.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    protected function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('is_active', true);
    }

    /**
     * Scope to only active brands.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    protected function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
