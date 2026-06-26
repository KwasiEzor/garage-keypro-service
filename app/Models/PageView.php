<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $url
 * @property string $path
 * @property string $method
 * @property string|null $ip
 * @property string|null $session_id
 * @property int|null $user_id
 * @property string|null $device_type
 * @property string|null $browser
 * @property string|null $os
 * @property string|null $country
 * @property string|null $referrer
 * @property string|null $referrer_domain
 * @property string|null $utm_source
 * @property string|null $utm_medium
 * @property string|null $utm_campaign
 * @property int|null $response_time_ms
 * @property CarbonImmutable $visited_at
 */
class PageView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'url', 'path', 'method', 'ip', 'session_id', 'user_id',
        'device_type', 'browser', 'os', 'country',
        'referrer', 'referrer_domain',
        'utm_source', 'utm_medium', 'utm_campaign',
        'response_time_ms', 'visited_at',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['visited_at' => 'immutable_datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @param Builder<PageView> $query */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('visited_at', today());
    }

    /** @param Builder<PageView> $query */
    public function scopeLastDays(Builder $query, int $days = 30): Builder
    {
        return $query->where('visited_at', '>=', now()->subDays($days));
    }

    /** @param Builder<PageView> $query */
    public function scopeHumans(Builder $query): Builder
    {
        return $query->where('device_type', '!=', 'bot')->whereNotNull('device_type');
    }
}
