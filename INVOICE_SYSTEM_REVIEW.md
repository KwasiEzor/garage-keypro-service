# Invoice System Review & Improvement Plan

**Review Date:** June 3, 2026
**Reviewer:** Senior Developer Analysis
**Status:** Pre-Production Review

## Executive Summary

Current invoice system has basic CRUD functionality but lacks production-ready features. Critical issues include race conditions in invoice numbering, incomplete state machine enforcement, missing audit trails, and no payment tracking. Estimated effort: 3-4 phases for full production readiness.

---

## Critical Issues (Fix Immediately)

### 1. Race Condition in Invoice Numbering
**Location:** `app/Support/InvoiceService.php:43`
**Severity:** HIGH - Will cause duplicate invoice numbers under concurrent load

**Current Code:**
```php
public function generateInvoiceNumber(Invoice $invoice): string
{
    $count = Invoice::where('team_id', $invoice->team_id)->count() + 1;
    return 'INV-' . now()->year . '-' . str_pad((string) $count, 4, '0', STR_PAD_LEFT);
}
```

**Problem:** Multiple concurrent requests can read same count value, generating duplicate numbers.

**Solution:**
```php
public function generateInvoiceNumber(Invoice $invoice): string
{
    return DB::transaction(function () use ($invoice) {
        $lastInvoice = Invoice::where('team_id', $invoice->team_id)
            ->lockForUpdate()
            ->latest('id')
            ->first();

        $nextNumber = $lastInvoice
            ? ((int) substr($lastInvoice->number, -4)) + 1
            : 1;

        return sprintf('INV-%s-%04d', now()->year, $nextNumber);
    });
}
```

**Alternative:** Use database sequence or atomic counter in Redis.

### 2. Status Enum Not Applied to Model
**Location:** `app/Models/Invoice.php`
**Severity:** MEDIUM - Enum exists but not enforced

**Issue:** `InvoiceStatus` enum defined but model still casts status as string.

**Fix:** Add to Invoice model casts:
```php
protected function casts(): array
{
    return [
        'status' => InvoiceStatus::class,
        'issue_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_total' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];
}
```

### 3. No State Machine Enforcement
**Location:** Everywhere status is changed
**Severity:** HIGH - Invalid state transitions possible

**Problem:** `InvoiceStatus` has validation methods (`canBeEdited()`, `canBeSent()`, `canBeCancelled()`) but nothing enforces them. Can change Paid invoice to Draft.

**Solution:** Create service methods that enforce transitions:
```php
// In InvoiceService
public function markAsSent(Invoice $invoice): void
{
    if (!$invoice->status->canBeSent()) {
        throw new InvalidStateTransitionException(
            "Cannot send invoice in {$invoice->status->value} status"
        );
    }

    $invoice->update(['status' => InvoiceStatus::Sent]);
    event(new InvoiceSent($invoice));
}
```

---

## Architecture Problems

### 4. Missing Observer Pattern
**What's Missing:** Auto-calculations and lifecycle hooks

**Create:** `app/Observers/InvoiceObserver.php`
```php
class InvoiceObserver
{
    public function creating(Invoice $invoice): void
    {
        if (empty($invoice->number)) {
            $invoice->number = app(InvoiceService::class)
                ->generateInvoiceNumber($invoice);
        }
    }

    public function saved(Invoice $invoice): void
    {
        // Recalculate totals when invoice saved
        if ($invoice->wasChanged(['subtotal', 'tax_total'])) {
            app(InvoiceService::class)->recalculateInvoice($invoice);
        }
    }
}
```

**Create:** `app/Observers/InvoiceItemObserver.php`
```php
class InvoiceItemObserver
{
    public function saving(InvoiceItem $item): void
    {
        $item->total_price = $item->quantity * $item->unit_price;
    }

    public function saved(InvoiceItem $item): void
    {
        app(InvoiceService::class)->recalculateInvoice($item->invoice);
    }

    public function deleted(InvoiceItem $item): void
    {
        app(InvoiceService::class)->recalculateInvoice($item->invoice);
    }
}
```

### 5. No Domain Events
**Impact:** No audit trail, no async notifications, no extensibility

**Create Events:**
- `app/Events/InvoiceCreated.php`
- `app/Events/InvoiceSent.php`
- `app/Events/InvoicePaid.php`
- `app/Events/InvoiceCancelled.php`
- `app/Events/InvoiceOverdue.php`

**Create Listeners:**
- `app/Listeners/LogInvoiceActivity.php` - Audit trail
- `app/Listeners/SendInvoiceNotification.php` - Email client
- `app/Listeners/UpdateAnalytics.php` - Track metrics

### 6. No Form Request Validation
**Location:** `app/Http/Controllers/InvoiceController.php`
**Problem:** No validation on create/update

**Create:**
- `app/Http/Requests/StoreInvoiceRequest.php`
- `app/Http/Requests/UpdateInvoiceRequest.php`
- `app/Http/Requests/UpdateInvoiceStatusRequest.php`

**Example:**
```php
class StoreInvoiceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:users,id'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after:issue_date'],
            'currency' => ['required', 'string', 'size:3'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
```

### 7. Controller Doing Too Much
**Location:** `app/Http/Controllers/InvoiceController.php:30-47`
**Problem:** `show()` method handles UUID lookup, ID lookup, route detection, authorization

**Refactor:**
```php
// Separate public and authenticated routes
public function showPublic(string $uuid): Response
{
    $invoice = Invoice::where('uuid', $uuid)
        ->with(['team', 'client', 'items.service'])
        ->firstOrFail();

    return Inertia::render('Invoices/Show', [
        'invoice' => $invoice,
    ]);
}

public function show(Request $request, Invoice $invoice): Response
{
    $this->authorize('view', $invoice);

    $invoice->load(['team', 'client', 'items.service']);

    return Inertia::render('Invoices/Show', [
        'invoice' => $invoice,
    ]);
}
```

### 8. Policy Incomplete
**Location:** `app/Policies/InvoicePolicy.php`
**Problem:** Only generic CRUD checks, no state-based authorization

**Add Methods:**
```php
public function send(User $user, Invoice $invoice): bool
{
    return $user->belongsToTeam($invoice->team)
        && $invoice->status->canBeSent();
}

public function markAsPaid(User $user, Invoice $invoice): bool
{
    return $user->belongsToTeam($invoice->team)
        && in_array($invoice->status, [InvoiceStatus::Sent, InvoiceStatus::Draft]);
}

public function cancel(User $user, Invoice $invoice): bool
{
    return $user->belongsToTeam($invoice->team)
        && $invoice->status->canBeCancelled();
}

public function download(User $user, Invoice $invoice): bool
{
    return $this->view($user, $invoice);
}
```

---

## Data Integrity Issues

### 9. No Automatic Total Calculation
**Location:** `app/Models/InvoiceItem.php`
**Problem:** `total_price` can be manually overridden, causing incorrect totals

**Solution:** Use observer (see #4) + make total_price non-fillable or use accessor:
```php
// Remove 'total_price' from $fillable array
protected $fillable = [
    'invoice_id',
    'service_id',
    'description',
    'quantity',
    'unit_price',
    // 'total_price', <- REMOVE
];

// Add accessor if needed for manual override cases
protected $appends = ['calculated_total'];

public function getCalculatedTotalAttribute(): float
{
    return round($this->quantity * $this->unit_price, 2);
}
```

### 10. Tax Calculation Incomplete
**Location:** `database/migrations/2026_05_30_122217_create_invoices_table.php`
**Problem:** Has `tax_total` but no `tax_rate` field. Comment says "future per-item tax" but no structure.

**Add Migration:**
```php
Schema::table('invoices', function (Blueprint $table) {
    $table->decimal('tax_rate', 5, 2)->default(0)->after('subtotal');
});

Schema::table('invoice_items', function (Blueprint $table) {
    $table->decimal('tax_rate', 5, 2)->nullable()->after('total_price');
    $table->decimal('tax_amount', 15, 2)->default(0)->after('tax_rate');
});
```

**Update InvoiceService:**
```php
public function recalculateInvoice(Invoice $invoice): void
{
    $invoice->loadMissing('items');

    $subtotal = 0;
    $taxTotal = 0;

    foreach ($invoice->items as $item) {
        $itemTotal = $item->quantity * $item->unit_price;
        $itemTax = $item->tax_rate
            ? $itemTotal * ($item->tax_rate / 100)
            : $itemTotal * ($invoice->tax_rate / 100);

        $subtotal += $itemTotal;
        $taxTotal += $itemTax;
    }

    $invoice->update([
        'subtotal' => $subtotal,
        'tax_total' => $taxTotal,
        'total_amount' => $subtotal + $taxTotal,
    ]);
}
```

### 11. Money Handling Weak
**Problem:** Using `decimal:2` and string currency. No multi-currency, no Money objects.

**Solution:** Use `brick/money` package
```bash
composer require brick/money
```

**Create Value Object:**
```php
// app/ValueObjects/Money.php
class Money
{
    public function __construct(
        public readonly int $amount, // Store as cents
        public readonly string $currency
    ) {}

    public static function fromDecimal(float $amount, string $currency): self
    {
        return new self((int) round($amount * 100), $currency);
    }

    public function toDecimal(): float
    {
        return $this->amount / 100;
    }
}
```

---

## Missing Production Features

### 12. No Payment Tracking
**Add Migration:**
```php
Schema::table('invoices', function (Blueprint $table) {
    $table->timestamp('sent_at')->nullable()->after('status');
    $table->timestamp('paid_at')->nullable()->after('sent_at');
    $table->string('payment_method')->nullable()->after('paid_at');
    $table->string('payment_reference')->nullable()->after('payment_method');
    $table->decimal('amount_paid', 15, 2)->default(0)->after('total_amount');
});
```

**Create Model:**
```php
// app/Models/Payment.php - For tracking multiple/partial payments
class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'amount',
        'payment_method',
        'payment_reference',
        'paid_at',
        'notes',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
```

### 13. No PDF Generation
**Install Package:**
```bash
composer require barryvdh/laravel-dompdf
```

**Create:**
```php
// app/Services/InvoicePdfGenerator.php
class InvoicePdfGenerator
{
    public function generate(Invoice $invoice): \Barryvdh\DomPDF\PDF
    {
        $pdf = PDF::loadView('invoices.pdf', [
            'invoice' => $invoice->load(['client', 'team', 'items']),
        ]);

        return $pdf;
    }

    public function download(Invoice $invoice): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return $this->generate($invoice)
            ->download("invoice-{$invoice->number}.pdf");
    }

    public function stream(Invoice $invoice): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return $this->generate($invoice)
            ->stream("invoice-{$invoice->number}.pdf");
    }
}
```

**Create View:** `resources/views/invoices/pdf.blade.php`

### 14. No Email System
**Create Mailable:**
```php
// app/Mail/InvoiceMail.php
class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
        public string $type = 'created'
    ) {}

    public function build(): self
    {
        $pdf = app(InvoicePdfGenerator::class)->generate($this->invoice);

        return $this->subject("Invoice {$this->invoice->number}")
            ->markdown('emails.invoices.' . $this->type)
            ->attachData($pdf->output(), "invoice-{$this->invoice->number}.pdf", [
                'mime' => 'application/pdf',
            ]);
    }
}
```

**Update Job:**
```php
// app/Jobs/SendInvoiceEmail.php
public function handle(): void
{
    Mail::to($this->recipient)
        ->send(new InvoiceMail($this->invoice, $this->type));

    if ($this->type === 'sent') {
        $this->invoice->update(['sent_at' => now()]);
    }
}
```

### 15. No Activity Logging
**Install Package:**
```bash
composer require spatie/laravel-activitylog
```

**Or use existing ActivityLogger:**
Check if `app/Support/ActivityLogger.php` can be extended.

**Create Listener:**
```php
// app/Listeners/LogInvoiceActivity.php
class LogInvoiceActivity
{
    public function handle(object $event): void
    {
        if ($event instanceof InvoiceCreated) {
            activity('invoice')
                ->performedOn($event->invoice)
                ->causedBy(auth()->user())
                ->log('Invoice created');
        }

        if ($event instanceof InvoiceStatusChanged) {
            activity('invoice')
                ->performedOn($event->invoice)
                ->causedBy(auth()->user())
                ->withProperties([
                    'old_status' => $event->oldStatus->value,
                    'new_status' => $event->newStatus->value,
                ])
                ->log('Invoice status changed');
        }
    }
}
```

### 16. No Overdue Detection
**Create Scope:**
```php
// In Invoice model
public function scopeOverdue(Builder $query): void
{
    $query->where('status', InvoiceStatus::Sent)
        ->where('due_date', '<', now());
}

public function scopeDueSoon(Builder $query, int $days = 7): void
{
    $query->where('status', InvoiceStatus::Sent)
        ->whereBetween('due_date', [now(), now()->addDays($days)]);
}
```

**Create Command:**
```php
// app/Console/Commands/SendOverdueReminders.php
class SendOverdueReminders extends Command
{
    protected $signature = 'invoices:send-overdue-reminders';

    public function handle(): void
    {
        Invoice::overdue()
            ->with('client')
            ->chunk(100, function ($invoices) {
                foreach ($invoices as $invoice) {
                    SendInvoiceEmail::dispatch(
                        $invoice,
                        $invoice->client,
                        'overdue'
                    );
                }
            });
    }
}
```

**Schedule in `app/Console/Kernel.php`:**
```php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('invoices:send-overdue-reminders')->daily();
}
```

### 17. Soft Delete Restoration Blocked
**Location:** `app/Policies/InvoicePolicy.php:58`
**Problem:** `restore()` returns false but no business justification

**Decision Needed:**
- If invoices should never be restored: Remove `SoftDeletes` trait, use hard deletes
- If invoices can be restored by admins: Update policy
- If invoices should be archived, not deleted: Add `archived_at` field instead

**Recommended:**
```php
public function restore(User $user, Invoice $invoice): bool
{
    // Only admins can restore invoices within 30 days
    return $user->isAdmin()
        && $invoice->deleted_at->greaterThan(now()->subDays(30));
}
```

### 18. No API Resources
**Problem:** Raw models in responses, exposes internal structure

**Create:**
```php
// app/Http/Resources/InvoiceResource.php
class InvoiceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'number' => $this->number,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->getLabel(),
                'color' => $this->status->getColor(),
            ],
            'client' => new UserResource($this->whenLoaded('client')),
            'team' => new TeamResource($this->whenLoaded('team')),
            'items' => InvoiceItemResource::collection($this->whenLoaded('items')),
            'dates' => [
                'issued' => $this->issue_date->toDateString(),
                'due' => $this->due_date->toDateString(),
                'paid' => $this->paid_at?->toDateString(),
                'sent' => $this->sent_at?->toDateString(),
            ],
            'amounts' => [
                'subtotal' => (float) $this->subtotal,
                'tax' => (float) $this->tax_total,
                'total' => (float) $this->total_amount,
                'currency' => $this->currency,
            ],
            'notes' => $this->notes,
            'can' => [
                'view' => $request->user()?->can('view', $this->resource),
                'update' => $request->user()?->can('update', $this->resource),
                'delete' => $request->user()?->can('delete', $this->resource),
                'send' => $request->user()?->can('send', $this->resource),
                'markAsPaid' => $request->user()?->can('markAsPaid', $this->resource),
            ],
        ];
    }
}
```

---

## Testing Gaps

### 19. Insufficient Test Coverage
**Current:** Only viewing tests exist
**Missing:**
- Invoice creation
- Status transitions
- Total calculations
- Number generation
- Authorization edge cases
- InvoiceService tests
- Race condition tests

**Create Tests:**

```php
// tests/Unit/InvoiceServiceTest.php
test('generateInvoiceNumber is unique under concurrent load', function () {
    $team = Team::factory()->create();

    $numbers = collect();

    // Simulate 10 concurrent requests
    $processes = [];
    for ($i = 0; $i < 10; $i++) {
        $processes[] = async(function () use ($team) {
            $invoice = Invoice::factory()->create(['team_id' => $team->id]);
            return $invoice->number;
        });
    }

    foreach ($processes as $process) {
        $numbers->push($process->await());
    }

    expect($numbers->unique())->toHaveCount(10);
});

test('invoice status can only transition to valid states', function () {
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Paid]);

    $service = app(InvoiceService::class);

    expect(fn() => $service->markAsDraft($invoice))
        ->toThrow(InvalidStateTransitionException::class);
});

test('invoice totals recalculate when items change', function () {
    $invoice = Invoice::factory()->create();

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 2,
        'unit_price' => 100,
    ]);

    $invoice->refresh();

    expect($invoice->subtotal)->toBe(200.00);
    expect($invoice->total_amount)->toBe(200.00);
});
```

```php
// tests/Feature/InvoiceWorkflowTest.php
test('complete invoice lifecycle works', function () {
    $user = User::factory()->create();
    $client = User::factory()->create();

    // Create draft
    $response = $this->actingAs($user)->post(route('invoices.store'), [
        'client_id' => $client->id,
        'issue_date' => now()->toDateString(),
        'due_date' => now()->addDays(14)->toDateString(),
        'items' => [
            ['description' => 'Service', 'quantity' => 1, 'unit_price' => 100],
        ],
    ]);

    $invoice = Invoice::latest()->first();
    expect($invoice->status)->toBe(InvoiceStatus::Draft);

    // Send invoice
    $this->actingAs($user)->post(route('invoices.send', $invoice));
    $invoice->refresh();
    expect($invoice->status)->toBe(InvoiceStatus::Sent);
    expect($invoice->sent_at)->not->toBeNull();

    // Mark as paid
    $this->actingAs($user)->post(route('invoices.mark-paid', $invoice), [
        'payment_method' => 'bank_transfer',
    ]);
    $invoice->refresh();
    expect($invoice->status)->toBe(InvoiceStatus::Paid);
    expect($invoice->paid_at)->not->toBeNull();
});
```

---

## Production Roadmap

### Phase 1: Data Integrity & Stability (Week 1)
**Priority:** CRITICAL - Fix bugs, prevent data corruption

**Tasks:**
1. ✅ Fix invoice numbering race condition
2. ✅ Add enum casting for status
3. ✅ Create InvoiceObserver for auto-calculations
4. ✅ Create InvoiceItemObserver for total_price calculation
5. ✅ Add FormRequest validation classes
6. ✅ Add database index: `unique(['team_id', 'number'])`
7. ✅ Add migration for payment tracking fields
8. ✅ Add migration for tax_rate fields
9. ✅ Write unit tests for InvoiceService
10. ✅ Write feature tests for status transitions

**Deliverables:**
- No race conditions
- Automatic total calculations
- Validated input
- 80%+ test coverage for core logic

### Phase 2: Business Logic & Events (Week 2)
**Priority:** HIGH - Enable proper workflows

**Tasks:**
1. ✅ Expand InvoiceService with state transition methods
2. ✅ Create domain events (Created, Sent, Paid, Cancelled, Overdue)
3. ✅ Create event listeners for audit logging
4. ✅ Build InvoiceMailable with PDF attachment
5. ✅ Complete SendInvoiceEmail job
6. ✅ Create OverdueReminderCommand scheduled job
7. ✅ Update InvoicePolicy with state-based methods
8. ✅ Add API resources for clean responses
9. ✅ Integration tests for email sending
10. ✅ Integration tests for full lifecycle

**Deliverables:**
- Complete audit trail
- Email notifications working
- State machine enforced
- Overdue detection automated

### Phase 3: Production Features (Week 3)
**Priority:** MEDIUM - Essential for real use

**Tasks:**
1. ✅ PDF generation (barryvdh/laravel-dompdf)
2. ✅ Payment recording system with Payment model
3. ✅ Multi-currency support (brick/money package)
4. ✅ Per-item tax calculation engine
5. ✅ Invoice templates (customizable per team)
6. ✅ Recurring invoices (separate feature)
7. ✅ Partial payment tracking
8. ✅ Invoice preview before sending
9. ✅ Bulk actions (send multiple, export multiple)
10. ✅ Performance optimization (query caching, N+1 prevention)

**Deliverables:**
- Professional PDF invoices
- Multi-currency support
- Flexible tax handling
- Template system

### Phase 4: Polish & Scale (Week 4)
**Priority:** LOW - Nice to have

**Tasks:**
1. ✅ Admin dashboard with invoice metrics
2. ✅ Export to accounting software (QuickBooks, Xero APIs)
3. ✅ Webhook system for external integrations
4. ✅ Invoice disputes/notes system
5. ✅ Credit notes/refunds
6. ✅ Client portal for invoice viewing
7. ✅ Invoice reminders automation (3 days before, on due date, 3 days after)
8. ✅ Late fee calculation and application
9. ✅ Comprehensive API documentation
10. ✅ Performance benchmarks and optimization

**Deliverables:**
- Analytics dashboard
- External integrations
- Client self-service
- Scalable to 100k+ invoices

---

## Database Schema Changes Required

### invoices table
```sql
ALTER TABLE invoices
ADD COLUMN tax_rate DECIMAL(5,2) DEFAULT 0 AFTER subtotal,
ADD COLUMN sent_at TIMESTAMP NULL AFTER status,
ADD COLUMN paid_at TIMESTAMP NULL AFTER sent_at,
ADD COLUMN payment_method VARCHAR(255) NULL AFTER paid_at,
ADD COLUMN payment_reference VARCHAR(255) NULL AFTER payment_method,
ADD COLUMN amount_paid DECIMAL(15,2) DEFAULT 0 AFTER total_amount;

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_overdue ON invoices(status, due_date);
```

### invoice_items table
```sql
ALTER TABLE invoice_items
ADD COLUMN tax_rate DECIMAL(5,2) NULL AFTER total_price,
ADD COLUMN tax_amount DECIMAL(15,2) DEFAULT 0 AFTER tax_rate;
```

### New payments table
```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    payment_reference VARCHAR(255) NULL,
    paid_at TIMESTAMP NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_payments_invoice_id (invoice_id),
    INDEX idx_payments_paid_at (paid_at)
);
```

---

## Files to Create

### Core Business Logic
- `app/Services/InvoiceService.php` - Expand existing
- `app/Services/InvoicePdfGenerator.php` - New
- `app/Observers/InvoiceObserver.php` - New
- `app/Observers/InvoiceItemObserver.php` - New
- `app/ValueObjects/Money.php` - New

### Events & Listeners
- `app/Events/InvoiceCreated.php`
- `app/Events/InvoiceSent.php`
- `app/Events/InvoicePaid.php`
- `app/Events/InvoiceCancelled.php`
- `app/Events/InvoiceOverdue.php`
- `app/Events/InvoiceStatusChanged.php`
- `app/Listeners/LogInvoiceActivity.php`
- `app/Listeners/SendInvoiceNotification.php`

### HTTP Layer
- `app/Http/Requests/StoreInvoiceRequest.php`
- `app/Http/Requests/UpdateInvoiceRequest.php`
- `app/Http/Requests/UpdateInvoiceStatusRequest.php`
- `app/Http/Requests/RecordPaymentRequest.php`
- `app/Http/Resources/InvoiceResource.php`
- `app/Http/Resources/InvoiceItemResource.php`
- `app/Http/Resources/PaymentResource.php`

### Jobs & Commands
- `app/Mail/InvoiceMail.php` - Update
- `app/Jobs/SendInvoiceEmail.php` - Complete existing
- `app/Console/Commands/SendOverdueReminders.php`
- `app/Console/Commands/MarkOverdueInvoices.php`

### Models
- `app/Models/Payment.php`
- Update `app/Models/Invoice.php` with new fields/scopes
- Update `app/Models/InvoiceItem.php` with new fields

### Tests
- `tests/Unit/InvoiceServiceTest.php`
- `tests/Unit/InvoiceStatusTest.php`
- `tests/Unit/InvoiceObserverTest.php`
- `tests/Feature/InvoiceWorkflowTest.php`
- `tests/Feature/InvoicePaymentTest.php`
- `tests/Feature/InvoicePdfTest.php`
- `tests/Feature/InvoiceEmailTest.php`

### Views
- `resources/views/invoices/pdf.blade.php`
- `resources/views/emails/invoices/created.blade.php`
- `resources/views/emails/invoices/sent.blade.php`
- `resources/views/emails/invoices/paid.blade.php`
- `resources/views/emails/invoices/overdue.blade.php`

---

## Metrics to Track

### Before Implementation
- Invoice creation failures: Unknown
- Duplicate invoice numbers: Likely occurring
- Status transition violations: Possible
- Test coverage: ~15% (4 tests)
- N+1 queries: 3+ per invoice view

### After Phase 1
- Invoice creation failures: 0%
- Duplicate invoice numbers: 0 (guaranteed by DB lock)
- Status transition violations: 0 (enforced)
- Test coverage: >80%
- N+1 queries: 0 (eager loading enforced)

### After Phase 2
- Average invoice processing time: <100ms
- Email delivery success rate: >99%
- Audit log coverage: 100%
- Overdue detection accuracy: 100%

### After Phase 3
- PDF generation time: <500ms
- Multi-currency support: 150+ currencies
- Tax calculation accuracy: 100%
- Template rendering time: <200ms

---

## Dependencies to Install

```bash
# Phase 1
composer require brick/money

# Phase 2
composer require spatie/laravel-activitylog

# Phase 3
composer require barryvdh/laravel-dompdf

# Phase 4 (optional)
composer require league/csv
composer require intuit/quickbooks-php  # If needed
```

---

## Estimated Effort

| Phase | Days | Developer Hours |
|-------|------|----------------|
| Phase 1: Data Integrity | 5 | 30-40 |
| Phase 2: Business Logic | 5 | 35-45 |
| Phase 3: Production Features | 5 | 40-50 |
| Phase 4: Polish | 5 | 30-40 |
| **Total** | **20** | **135-175** |

**Team Size:** 1 senior developer
**Timeline:** 4 weeks at 70% capacity (other tasks)
**Risk Buffer:** +25% for unknowns

---

## Questions for Product/Business

1. **Invoice Numbering:** Custom format per team or keep global format?
2. **Soft Deletes:** Should deleted invoices be restorable? For how long?
3. **Currencies:** Default currency? Support crypto?
4. **Tax:** Simple percentage or complex multi-jurisdiction?
5. **Payments:** Partial payments allowed? Payment plans?
6. **PDF:** Logo upload per team? Custom templates?
7. **Recurring:** Monthly/yearly subscriptions needed?
8. **Late Fees:** Automatic or manual? What percentage?
9. **Reminders:** How many? What intervals?
10. **Integrations:** QuickBooks? Xero? Stripe? What priority?

---

## Next Steps

1. Review this document with team
2. Prioritize phases based on business needs
3. Get answers to product questions
4. Start Phase 1 implementation
5. Set up monitoring for invoice metrics
6. Plan rollout strategy (feature flag? Gradual?)

---

**Ready to implement?** Start with Phase 1 tasks for immediate stability improvements.
