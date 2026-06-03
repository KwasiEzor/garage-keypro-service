<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $uuid
 * @property int $team_id
 * @property int $client_id
 * @property string $number
 * @property CarbonImmutable $issue_date
 * @property CarbonImmutable $due_date
 * @property InvoiceStatus $status
 * @property numeric $subtotal
 * @property numeric $tax_rate
 * @property numeric $tax_total
 * @property numeric $total_amount
 * @property numeric $amount_paid
 * @property CarbonImmutable|null $sent_at
 * @property CarbonImmutable|null $paid_at
 * @property string|null $payment_method
 * @property string|null $payment_reference
 * @property string $currency
 * @property string|null $notes
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property CarbonImmutable|null $deleted_at
 * @property-read User $client
 * @property-read Collection<int, InvoiceItem> $items
 * @property-read int|null $items_count
 * @property-read Team|null $team
 *
 * @method static \Database\Factories\InvoiceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereIssueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereSubtotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereTaxTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereTeamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice whereUuid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Invoice withoutTrashed()
 *
 * @mixin \Eloquent
 */
class Invoice extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'team_id',
        'client_id',
        'number',
        'issue_date',
        'due_date',
        'status',
        'subtotal',
        'tax_rate',
        'tax_total',
        'total_amount',
        'amount_paid',
        'currency',
        'notes',
        'sent_at',
        'paid_at',
        'payment_method',
        'payment_reference',
    ];

    /**
     * Bootstrap the model and its traits.
     */
    #[\Override]
    protected static function booted(): void
    {
        // UUID generation moved to InvoiceObserver
    }

    /**
     * Get the team that owns the invoice.
     *
     * @return BelongsTo<Team, Invoice>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the client (user) for the invoice.
     *
     * @return BelongsTo<User, Invoice>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Get the line items for the invoice.
     *
     * @return HasMany<InvoiceItem, Invoice>
     */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * Get the payments for the invoice.
     *
     * @return HasMany<Payment, Invoice>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include overdue invoices.
     */
    public function scopeOverdue(Builder $query): void
    {
        $query->where('status', InvoiceStatus::Sent)
            ->where('due_date', '<', now());
    }

    /**
     * Scope a query to only include invoices due soon.
     */
    public function scopeDueSoon(Builder $query, int $days = 7): void
    {
        $query->where('status', InvoiceStatus::Sent)
            ->whereBetween('due_date', [now(), now()->addDays($days)]);
    }

    #[\Override]
    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'issue_date' => 'date',
            'due_date' => 'date',
            'sent_at' => 'datetime',
            'paid_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'amount_paid' => 'decimal:2',
        ];
    }
}
