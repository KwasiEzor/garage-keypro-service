<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\GalleryItemFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string $image_path
 * @property string $category
 * @property bool $is_featured
 * @property bool $is_active
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @method static \Database\Factories\GalleryItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryItem whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class GalleryItem extends Model
{
    /** @use HasFactory<GalleryItemFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image_path',
        'category',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    /**
     * Get the gallery item image URL.
     */
    protected function imagePath(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    return $value;
                }

                return $value ? Storage::disk('public')->url($value) : null;
            },
        );
    }

    /**
     * Boot function from Laravel.
     */
    #[\Override]
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($galleryItem): void {
            if (empty($galleryItem->slug)) {
                $galleryItem->slug = Str::slug($galleryItem->title);
            }
        });
    }

    #[\Override]
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
