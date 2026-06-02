<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $customer_name
 * @property string|null $customer_location
 * @property string|null $vehicle_info
 * @property string $content
 * @property int $rating
 * @property string|null $avatar_path
 * @property bool $is_featured
 * @property bool $is_active
 * @property CarbonImmutable|null $service_date
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial active()
 * @method static \Database\Factories\TestimonialFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial featured()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereAvatarPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereCustomerLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereServiceDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Testimonial whereVehicleInfo($value)
 *
 * @mixin \Eloquent
 */
class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_location',
        'vehicle_info',
        'content',
        'rating',
        'avatar_path',
        'is_featured',
        'is_active',
        'service_date',
    ];

    #[\Override]
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'service_date' => 'date',
        ];
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
