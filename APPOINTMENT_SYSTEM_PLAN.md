# Production-Ready Appointment System Implementation Plan

**Project:** garage-keypro-service
**Created:** 2026-06-04
**Status:** Ready for Implementation

---

## Phase 0: Documentation Discovery ✅ COMPLETE

All documentation has been gathered and verified against the current codebase.

### Allowed APIs & Patterns

**Laravel Notifications (v13):**
- `php artisan make:notification AppointmentConfirmation --pest`
- `implements ShouldQueue` for async sending
- `->attach()`, `->attachData()` for .ics files
- `Notification::fake()` for testing
- **Location:** `app/Notifications/`
- **Copy from:** `app/Notifications/Teams/TeamInvitation.php` (queued mail example)

**Filament Resources (v5):**
- `php artisan make:filament-resource Appointment --generate --soft-deletes`
- Separated schemas: `app/Filament/Resources/Appointments/Schemas/AppointmentForm.php`
- Table actions with confirmation modals
- Stats widgets: `php artisan make:filament-widget AppointmentStats --stats-overview`
- **Copy from:** `app/Filament/Resources/Invoices/` (complete CRUD example)

**Inertia v3 React:**
- `useForm()` hook for form submission
- Deferred props: `Inertia::optional(fn() => ...)` server-side
- `<Deferred data="..." fallback={<Loading />}>` client-side
- Error handling via `onSuccess`, `onError` callbacks
- **Copy from:** `resources/js/pages/auth/login.tsx` (Form component pattern)

**Spatie Calendar Links:**
- `Link::create($title, $from, $to)->description()->address()`
- `.ics([], ['format' => 'file'])` for downloads/attachments
- `response()->streamDownload()` for .ics downloads
- `Attachment::fromData()` for email attachments
- **Copy from:** `app/Http/Controllers/AppointmentController.php:81-87`

**Laravel Jobs & Scheduling:**
- `php artisan make:job SendAppointmentReminder --pest`
- `Schedule::job(new JobClass)->hourly()` in `routes/console.php`
- `#[Tries(5)] #[Timeout(120)]` attributes
- **Copy from:** `app/Jobs/SendInvoiceEmail.php`

### Anti-Patterns to Avoid

❌ **DO NOT** use `app/Console/Kernel.php` - doesn't exist in Laravel 13
❌ **DO NOT** use `fetch()` for Inertia routes - use `useHttp()` or deferred props
❌ **DO NOT** skip race condition protection - use DB transactions + locks
❌ **DO NOT** hardcode calendar link to Google only - provide all formats
❌ **DO NOT** use inline validation - create FormRequest classes
❌ **DO NOT** skip notifications - users need confirmation emails

---

## Phase 1: Database & Model Layer (P0 - Critical)

### Objective
Create `Appointment` model with race condition protection and proper relationships.

### Tasks

#### 1.1 Create Appointment Migration
```bash
php artisan make:migration create_appointments_table --no-interaction
```

**Copy from:** `database/migrations/*_create_invoices_table.php` (enum, foreign keys, indexes)

**Required columns:**
```php
$table->id();
$table->foreignId('team_id')->constrained()->cascadeOnDelete();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->foreignId('service_id')->constrained()->cascadeOnDelete();
$table->dateTime('start_at')->index();
$table->dateTime('end_at')->index();
$table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])->default('confirmed');
$table->text('notes')->nullable();
$table->text('cancellation_reason')->nullable();
$table->timestamps();
$table->softDeletes();

// CRITICAL: Prevent double-booking
$table->unique(['team_id', 'start_at', 'deleted_at'], 'unique_team_time_slot');
```

#### 1.2 Create Appointment Model
```bash
php artisan make:model Appointment --factory --no-interaction
```

**Copy from:** `app/Models/Invoice.php` (casts, relationships, soft deletes)

**Required:**
- Use `AppointmentStatus` enum for status casting
- Relationships: `belongsTo(Team, User, Service)`
- Accessors for formatted dates
- `SoftDeletes` trait

#### 1.3 Create AppointmentStatus Enum
```bash
php artisan make:enum AppointmentStatus
```

**Copy from:** `app/Enums/InvoiceStatus.php` (badge colors, labels)

**Values:** Pending, Confirmed, Completed, Cancelled, NoShow

#### 1.4 Create AppointmentFactory
**Copy from:** `database/factories/InvoiceFactory.php`

**Include:** Realistic appointment times, various statuses

#### 1.5 Run Migration
```bash
php artisan migrate
```

### Verification Checklist
- [ ] Migration creates `appointments` table with all columns
- [ ] Unique constraint exists on `team_id + start_at + deleted_at`
- [ ] Foreign keys cascade on delete
- [ ] Appointment model casts status to enum
- [ ] Factory generates valid appointments
- [ ] `php artisan tinker --execute "Appointment::factory()->create()"` succeeds

### Documentation References
- Migrations: `database/migrations/*_create_invoices_table.php`
- Models: `app/Models/Invoice.php`
- Enums: `app/Enums/InvoiceStatus.php`
- Factories: `database/factories/InvoiceFactory.php`

---

## Phase 2: Business Logic with Race Condition Protection (P0)

### Objective
Implement atomic booking with slot validation and Zap integration.

### Tasks

#### 2.1 Create StoreAppointmentRequest
```bash
php artisan make:request StoreAppointmentRequest --no-interaction
```

**Copy from:** `app/Http/Requests/Invoices/StoreInvoiceRequest.php` (nested validation, authorization)

**Required validation:**
- `team_id`: exists, active
- `service_id`: exists, is_active=true
- `date`: required, after_or_equal:today, before:+90 days
- `slot`: required, regex:/^\d{2}:\d{2}$/
- `notes`: nullable, max:500

**Custom validation in `withValidator()`:**
- Check slot still available via `Team::getBookableSlots()`
- Verify no conflicting appointments in DB

#### 2.2 Update AppointmentService with Atomic Booking
**File:** `app/Services/AppointmentService.php`

**Add method:**
```php
public function createAppointment(
    Team $team,
    User $client,
    Service $service,
    CarbonInterface $startAt,
    ?string $notes = null
): Appointment {
    return DB::transaction(function () use ($team, $client, $service, $startAt, $notes) {
        $endAt = $startAt->copy()->addMinutes($service->estimated_duration);

        // Lock check: slot still available?
        $conflict = Appointment::where('team_id', $team->id)
            ->where(function ($query) use ($startAt, $endAt) {
                $query->whereBetween('start_at', [$startAt, $endAt])
                    ->orWhereBetween('end_at', [$startAt, $endAt]);
            })
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->lockForUpdate()
            ->exists();

        if ($conflict) {
            throw new SlotUnavailableException('Time slot no longer available');
        }

        // Create appointment record
        $appointment = Appointment::create([
            'team_id' => $team->id,
            'user_id' => $client->id,
            'service_id' => $service->id,
            'start_at' => $startAt,
            'end_at' => $endAt,
            'notes' => $notes,
            'status' => AppointmentStatus::Confirmed,
        ]);

        // Sync with Zap (for UI calendar integration)
        Zap::for($team)
            ->named($service->name.' - '.$client->name)
            ->appointment()
            ->on($startAt->format('Y-m-d'))
            ->addPeriod($startAt->format('H:i'), $endAt->format('H:i'))
            ->withMetadata(['appointment_id' => $appointment->id])
            ->save();

        return $appointment;
    });
}
```

**Copy from:** `app/Services/InvoiceService.php` (service structure)

#### 2.3 Create SlotUnavailableException
```bash
php artisan make:exception SlotUnavailableException
```

**Copy from:** `app/Exceptions/InvalidInvoiceStateException.php`

#### 2.4 Update AppointmentController::store()
**File:** `app/Http/Controllers/AppointmentController.php`

**Replace inline validation with:**
```php
public function store(StoreAppointmentRequest $request)
{
    $validated = $request->validated();

    try {
        $appointment = $this->appointmentService->createAppointment(
            Team::findOrFail($validated['team_id']),
            auth()->user(),
            Service::findOrFail($validated['service_id']),
            Carbon::parse($validated['date'].' '.$validated['slot']),
            $validated['notes'] ?? null
        );

        // Dispatch notification
        $appointment->user->notify(new AppointmentConfirmation($appointment));

        return redirect()->route('appointments.show', $appointment)
            ->with('success', 'Appointment confirmed!');
    } catch (SlotUnavailableException $e) {
        return back()
            ->withInput()
            ->withErrors(['slot' => 'This time slot is no longer available. Please choose another.']);
    }
}
```

### Verification Checklist
- [ ] FormRequest validates all fields
- [ ] FormRequest checks slot availability in `withValidator()`
- [ ] AppointmentService uses DB transaction
- [ ] Race condition test: concurrent bookings rejected
- [ ] Appointment record created before Zap sync
- [ ] SlotUnavailableException thrown on conflict

### Documentation References
- Form Requests: `app/Http/Requests/Invoices/StoreInvoiceRequest.php`
- Services: `app/Services/InvoiceService.php`
- DB Transactions: Laravel 13 documentation (via search-docs)
- Pessimistic Locking: `lockForUpdate()` method

---

## Phase 3: Email Notifications with Calendar Attachments (P0)

### Objective
Send confirmation emails with .ics calendar attachments.

### Tasks

#### 3.1 Create AppointmentConfirmation Notification
```bash
php artisan make:notification AppointmentConfirmation --pest
```

**Copy from:** `app/Notifications/Teams/TeamInvitation.php` (queued notification, mail channel)

**Required:**
```php
class AppointmentConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Appointment $appointment) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Confirmed - '.$this->appointment->service->name)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your appointment has been confirmed.')
            ->line('Service: '.$this->appointment->service->name)
            ->line('Date: '.$this->appointment->start_at->format('l, F j, Y'))
            ->line('Time: '.$this->appointment->start_at->format('g:i A'))
            ->line('Location: '.$this->appointment->team->name)
            ->action('View Appointment', route('appointments.show', $this->appointment))
            ->attach($this->generateIcsAttachment());
    }

    protected function generateIcsAttachment(): array
    {
        $link = Link::create(
            $this->appointment->service->name,
            $this->appointment->start_at,
            $this->appointment->end_at
        )
            ->description($this->appointment->notes ?? '')
            ->address($this->appointment->team->name);

        $icsContent = $link->ics([
            'UID' => "appointment-{$this->appointment->id}@yoursite.com",
        ], ['format' => 'file']);

        return [
            'data' => $icsContent,
            'name' => 'appointment.ics',
            'options' => ['mime' => 'text/calendar'],
        ];
    }
}
```

#### 3.2 Create Notification Migration (if not exists)
```bash
php artisan make:notifications-table
php artisan migrate
```

#### 3.3 Update AppointmentController to Send Notification
**Already done in Phase 2.4**

### Verification Checklist
- [ ] Notification implements `ShouldQueue`
- [ ] Email includes all appointment details
- [ ] .ics file attached to email
- [ ] Database notification created
- [ ] Test: `Notification::fake()` assertion passes
- [ ] Test email: `php artisan tinker --execute "User::first()->notify(new AppointmentConfirmation(Appointment::first()))"`

### Documentation References
- Notifications: `app/Notifications/Teams/TeamInvitation.php`
- Calendar Links: `app/Http/Controllers/AppointmentController.php:81-87`
- ICS Generation: Spatie package docs (Phase 0)
- Mail Attachments: Laravel 13 Mail documentation

---

## Phase 4: Customer Appointment Dashboard (P1)

### Objective
Allow users to view and cancel their appointments.

### Tasks

#### 4.1 Add Routes
**File:** `routes/web.php`

```php
Route::middleware('auth')->group(function () {
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments'])
        ->name('appointments.my');
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])
        ->name('appointments.show');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])
        ->name('appointments.cancel');
    Route::get('/appointments/{appointment}/calendar', [AppointmentController::class, 'downloadCalendar'])
        ->name('appointments.calendar');
});
```

#### 4.2 Add Controller Methods
**File:** `app/Http/Controllers/AppointmentController.php`

```php
public function myAppointments(): Response
{
    return Inertia::render('appointments/my-appointments', [
        'appointments' => auth()->user()->appointments()
            ->with(['team', 'service'])
            ->where('start_at', '>=', now())
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->orderBy('start_at')
            ->get(),
    ]);
}

public function show(Appointment $appointment): Response
{
    $this->authorize('view', $appointment);

    return Inertia::render('appointments/show', [
        'appointment' => $appointment->load(['team', 'service']),
    ]);
}

public function cancel(Appointment $appointment)
{
    $this->authorize('cancel', $appointment);

    $appointment->update([
        'status' => AppointmentStatus::Cancelled,
        'cancellation_reason' => request('reason'),
    ]);

    return redirect()->route('appointments.my')
        ->with('success', 'Appointment cancelled.');
}

public function downloadCalendar(Appointment $appointment)
{
    $this->authorize('view', $appointment);

    $link = Link::create(
        $appointment->service->name,
        $appointment->start_at,
        $appointment->end_at
    )
        ->description($appointment->notes ?? '')
        ->address($appointment->team->name);

    $icsContent = $link->ics([
        'UID' => "appointment-{$appointment->id}@yoursite.com",
    ], ['format' => 'file']);

    return response()->streamDownload(
        fn () => print $icsContent,
        "appointment-{$appointment->id}.ics",
        ['Content-Type' => 'text/calendar; charset=utf-8']
    );
}
```

#### 4.3 Create AppointmentPolicy
```bash
php artisan make:policy AppointmentPolicy --model=Appointment
```

**Copy from:** `app/Policies/InvoicePolicy.php`

**Required methods:**
- `view()`: owner or team member
- `cancel()`: owner AND status=confirmed AND start_at > now()+2 hours

#### 4.4 Create React Pages
**Files:**
- `resources/js/pages/appointments/my-appointments.tsx`
- `resources/js/pages/appointments/show.tsx`

**Copy from:** `resources/js/pages/home.tsx` (layout structure)

**Use patterns from:** `resources/js/pages/auth/login.tsx` (Form component)

#### 4.5 Generate Wayfinder Routes
```bash
php artisan wayfinder:generate
```

### Verification Checklist
- [ ] `/my-appointments` renders list of user appointments
- [ ] `/appointments/{id}` shows appointment details
- [ ] Cancel button requires confirmation modal
- [ ] Policy prevents cancelling past/started appointments
- [ ] .ics download works from appointment detail page
- [ ] Wayfinder types generated for new routes

### Documentation References
- Inertia Pages: `resources/js/pages/auth/login.tsx`
- Policies: `app/Policies/InvoicePolicy.php`
- ICS Download: Spatie docs (Phase 0)
- Wayfinder: `resources/js/routes/`

---

## Phase 5: Filament Admin Resource (P1)

### Objective
Admin dashboard for managing all appointments.

### Tasks

#### 5.1 Create Filament Resource
```bash
php artisan make:filament-resource Appointment --generate --soft-deletes --view
```

#### 5.2 Configure Resource Table
**File:** `app/Filament/Resources/Appointments/Tables/AppointmentsTable.php`

**Copy from:** `app/Filament/Resources/Invoices/Tables/InvoicesTable.php`

**Columns:**
- Customer name (searchable)
- Service name
- Team name
- Start date/time (sortable)
- Status (badge with colors)
- Created at (toggleable, hidden by default)

**Filters:**
- Status filter
- Date range filter
- Team filter
- Service filter

**Actions:**
- View
- Edit
- Mark as completed
- Mark as no-show
- Cancel with reason
- Delete (soft)

#### 5.3 Configure Resource Form
**File:** `app/Filament/Resources/Appointments/Schemas/AppointmentForm.php`

**Copy from:** `app/Filament/Resources/Invoices/Schemas/InvoiceForm.php`

**Fields:**
- Customer select (relationship)
- Team select (relationship)
- Service select (relationship)
- Date picker
- Time picker (start)
- Duration (calculated from service)
- Status select
- Notes textarea
- Cancellation reason (visible when status=cancelled)

#### 5.4 Add Custom Actions
**File:** `app/Filament/Resources/Appointments/Pages/EditAppointment.php`

```php
protected function getHeaderActions(): array
{
    return [
        Action::make('mark_completed')
            ->icon('heroicon-o-check-circle')
            ->color('success')
            ->requiresConfirmation()
            ->action(fn () => $this->record->update(['status' => AppointmentStatus::Completed])),

        Action::make('mark_no_show')
            ->icon('heroicon-o-x-circle')
            ->color('warning')
            ->requiresConfirmation()
            ->action(fn () => $this->record->update(['status' => AppointmentStatus::NoShow])),

        DeleteAction::make(),
        RestoreAction::make(),
    ];
}
```

#### 5.5 Create Stats Widget
```bash
php artisan make:filament-widget AppointmentStats --stats-overview
```

**Copy from:** `app/Filament/Widgets/LeadStats.php`

**Stats:**
- Today's appointments (count)
- This week's appointments
- Upcoming appointments (next 7 days)
- Completion rate (%)

### Verification Checklist
- [ ] Resource appears in admin navigation
- [ ] Table shows all appointments with filters working
- [ ] Form validation prevents overlapping bookings
- [ ] Custom actions update status correctly
- [ ] Stats widget displays accurate counts
- [ ] Soft delete/restore works

### Documentation References
- Filament Resources: `app/Filament/Resources/Invoices/`
- Widgets: `app/Filament/Widgets/LeadStats.php`
- Custom Actions: Filament docs (Phase 0)

---

## Phase 6: Fix Frontend Inertia Patterns (P1)

### Objective
Replace `fetch()` with proper Inertia patterns.

### Tasks

#### 6.1 Convert to Deferred Props (Recommended)
**File:** `app/Http/Controllers/AppointmentController.php`

```php
public function index(): Response
{
    return Inertia::render('appointments/index', [
        'services' => Service::where('is_active', true)->get(),
        'teams' => Team::all(),
        'availableSlots' => Inertia::optional(function () {
            if (request('date') && request('team_id') && request('service_id')) {
                $team = Team::find(request('team_id'));
                $service = Service::find(request('service_id'));
                $date = Carbon::parse(request('date'));

                return $this->appointmentService->getAvailableSlots($team, $date, $service);
            }
            return [];
        }),
    ]);
}
```

**File:** `resources/js/pages/appointments/index.tsx`

**Replace fetch() with:**
```tsx
import { router } from '@inertiajs/react';

// When date/service/team changes:
router.reload({
    only: ['availableSlots'],
    data: {
        date: data.date,
        team_id: data.team_id,
        service_id: data.service_id,
    },
});
```

#### 6.2 Add Rate Limiting
**File:** `routes/web.php`

```php
Route::get('/appointments', [AppointmentController::class, 'index'])
    ->name('appointments.index')
    ->middleware('throttle:60,1'); // 60 requests per minute
```

### Verification Checklist
- [ ] No `fetch()` calls in appointment pages
- [ ] Slot loading uses Inertia partial reload
- [ ] Rate limiting prevents abuse
- [ ] Loading states work correctly
- [ ] Error handling via Inertia events

### Documentation References
- Deferred Props: Inertia v3 docs (Phase 0)
- Partial Reloads: `resources/js/pages/` examples
- Rate Limiting: Laravel 13 routing docs

---

## Phase 7: Timezone Support & Booking Rules (P2)

### Objective
Support multiple timezones and configurable booking rules.

### Tasks

#### 7.1 Add Timezone to Teams
```bash
php artisan make:migration add_timezone_to_teams_table
```

```php
$table->string('timezone')->default('Europe/Paris')->after('name');
```

#### 7.2 Create TeamSettings Model
```bash
php artisan make:model TeamSettings --migration
```

**Migration:**
```php
$table->foreignId('team_id')->constrained()->cascadeOnDelete();
$table->integer('buffer_minutes')->default(15);
$table->integer('max_advance_booking_days')->default(90);
$table->integer('min_advance_booking_hours')->default(2);
```

#### 7.3 Update AppointmentService
**Use team timezone for conversions:**
```php
$teamTz = new DateTimeZone($team->timezone);
$startAt = Carbon::parse($request->date.' '.$request->slot, $teamTz)->utc();
```

**Apply booking rules:**
```php
$settings = $team->settings ?? new TeamSettings(['team_id' => $team->id]);

if ($startAt->lt(now()->addHours($settings->min_advance_booking_hours))) {
    throw new ValidationException('Must book at least '.$settings->min_advance_booking_hours.' hours in advance');
}
```

### Verification Checklist
- [ ] Teams can set custom timezone
- [ ] Appointment times stored in UTC
- [ ] Display times in team timezone
- [ ] Booking rules enforced
- [ ] Timezone conversion tests pass

### Documentation References
- Carbon Timezone Handling: Laravel docs
- Team Settings: Similar to `config/` pattern

---

## Phase 8: Calendar Integration & Reminders (P2)

### Objective
Complete calendar integration and automated reminders.

### Tasks

#### 8.1 Enhance Calendar Links
**File:** `app/Http/Controllers/AppointmentController.php`

**Update store() method:**
```php
return redirect()->route('appointments.show', $appointment)->with([
    'success' => 'Appointment confirmed!',
    'calendar_links' => [
        'google' => $link->google(),
        'yahoo' => $link->yahoo(),
        'outlook' => $link->webOutlook(),
        'office365' => $link->webOffice(),
        'download' => route('appointments.calendar', $appointment),
    ],
]);
```

#### 8.2 Create Reminder Job
```bash
php artisan make:job SendAppointmentReminder --pest
```

**Copy from:** `app/Jobs/SendInvoiceEmail.php`

```php
class SendAppointmentReminder implements ShouldQueue
{
    public function handle(): void
    {
        $appointments = Appointment::where('status', AppointmentStatus::Confirmed)
            ->where('start_at', '>', now())
            ->where('start_at', '<=', now()->addHours(24))
            ->whereDoesntHave('notifications', function ($q) {
                $q->where('type', AppointmentReminder::class)
                    ->where('created_at', '>', now()->subDay());
            })
            ->get();

        foreach ($appointments as $appointment) {
            $appointment->user->notify(new AppointmentReminder($appointment));
        }
    }
}
```

#### 8.3 Schedule Reminder Job
**File:** `routes/console.php`

```php
use Illuminate\Support\Facades\Schedule;

Schedule::job(new SendAppointmentReminder)->hourly();
```

#### 8.4 Create AppointmentReminder Notification
```bash
php artisan make:notification AppointmentReminder --pest
```

**Similar to AppointmentConfirmation but with "Reminder" messaging**

### Verification Checklist
- [ ] All calendar platforms available
- [ ] .ics download works
- [ ] Reminder job scheduled
- [ ] Reminders sent 24h before appointment
- [ ] No duplicate reminders sent
- [ ] `php artisan schedule:list` shows reminder job

### Documentation References
- Calendar Links: Spatie docs (Phase 0)
- Jobs: `app/Jobs/SendInvoiceEmail.php`
- Scheduling: `routes/console.php` pattern (Phase 0)

---

## Phase 9: Comprehensive Testing (P2)

### Objective
Test all critical paths including race conditions.

### Tasks

#### 9.1 Appointment Model Tests
```bash
php artisan make:test --pest --unit AppointmentTest
```

**Copy from:** `tests/Feature/InvoiceLifecycleTest.php`

**Tests:**
- Factory creates valid appointments
- Status transitions work
- Relationships load correctly
- Soft deletes work

#### 9.2 Booking Race Condition Test
**File:** `tests/Feature/AppointmentBookingTest.php`

```php
test('prevents double-booking same slot', function () {
    $team = Team::factory()->create();
    $service = Service::factory()->create(['estimated_duration' => 60]);
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $startAt = now()->addDay()->setTime(9, 0);

    // User 1 books
    $appointment1 = app(AppointmentService::class)->createAppointment(
        $team, $user1, $service, $startAt
    );
    expect($appointment1)->toBeInstanceOf(Appointment::class);

    // User 2 tries same slot - should fail
    expect(fn() => app(AppointmentService::class)->createAppointment(
        $team, $user2, $service, $startAt
    ))->toThrow(SlotUnavailableException::class);
});

test('allows booking after cancelled appointment', function () {
    // Create and cancel appointment
    $appointment = Appointment::factory()->create([
        'status' => AppointmentStatus::Cancelled,
    ]);

    // New booking for same slot should succeed
    $newAppointment = app(AppointmentService::class)->createAppointment(
        $appointment->team,
        User::factory()->create(),
        $appointment->service,
        $appointment->start_at
    );

    expect($newAppointment->id)->not->toBe($appointment->id);
});
```

#### 9.3 Notification Tests
**File:** `tests/Feature/AppointmentNotificationTest.php`

```php
test('sends confirmation email with calendar attachment', function () {
    Notification::fake();

    $appointment = Appointment::factory()->create();

    $appointment->user->notify(new AppointmentConfirmation($appointment));

    Notification::assertSentTo(
        $appointment->user,
        AppointmentConfirmation::class,
        function ($notification) use ($appointment) {
            $mail = $notification->toMail($appointment->user);
            expect($mail->subject)->toContain('Confirmed');
            return true;
        }
    );
});
```

#### 9.4 Run Full Test Suite
```bash
php artisan test --compact --filter Appointment
```

### Verification Checklist
- [ ] All appointment tests pass
- [ ] Race condition test prevents double-booking
- [ ] Notification tests verify email content
- [ ] Policy tests verify authorization
- [ ] Edge cases covered (cancelled, no-show, past dates)

### Documentation References
- Testing: `tests/Feature/InvoiceLifecycleTest.php`
- Notification Testing: `tests/Feature/Teams/TeamInvitationTest.php`
- Pest: `tests/Feature/` examples

---

## Phase 10: Final Verification & Launch Checklist

### Pre-Launch Verification

#### Database
- [ ] Run migrations on fresh database: `php artisan migrate:fresh`
- [ ] Seed test data: `php artisan db:seed --class=AppointmentSeeder`
- [ ] Verify unique constraints prevent duplicates
- [ ] Check foreign key cascades work

#### Backend
- [ ] All routes registered and accessible
- [ ] FormRequest validation working
- [ ] Policy authorization enforced
- [ ] Race condition protection active (DB transaction test)
- [ ] Notifications queue properly

#### Frontend
- [ ] Booking form validates before submission
- [ ] Loading states display correctly
- [ ] Error messages show validation errors
- [ ] Success flow redirects to appointment detail
- [ ] Calendar links render properly

#### Admin Panel
- [ ] Resource appears in navigation
- [ ] Filters and search work
- [ ] Custom actions execute successfully
- [ ] Stats widget shows correct data

#### Email & Calendar
- [ ] Test email delivery: `php artisan tinker --execute "User::first()->notify(new AppointmentConfirmation(Appointment::first()))"`
- [ ] .ics file downloads successfully
- [ ] Calendar import works (Google, Outlook, Apple)
- [ ] Email attachment opens in calendar apps

#### Performance
- [ ] Rate limiting active on public routes
- [ ] Jobs processing via queue (not sync)
- [ ] Schedule running: `php artisan schedule:work`
- [ ] No N+1 queries (check with Debugbar)

#### Testing
- [ ] All Pest tests pass: `php artisan test --compact`
- [ ] Browser test: Book appointment end-to-end
- [ ] Race condition test: Concurrent booking attempts
- [ ] Timezone test: Different team timezones

### Anti-Pattern Checks

Run these greps to ensure no anti-patterns:
```bash
# Should find ZERO results
grep -r "fetch(route('appointments" resources/js/
grep -r "app/Console/Kernel.php" .
grep -r "->google()\s*;" app/ | grep -v "calendar_links"

# Should find results (confirming correct usage)
grep -r "DB::transaction" app/Services/AppointmentService.php
grep -r "lockForUpdate" app/Services/AppointmentService.php
grep -r "StoreAppointmentRequest" app/Http/Controllers/AppointmentController.php
```

### Documentation Updates
- [ ] Update README with appointment feature
- [ ] Document API routes (if exposing)
- [ ] Add deployment notes (queue worker, scheduler cron)

### Deployment Checklist
- [ ] Queue worker running: `php artisan horizon` or `php artisan queue:work`
- [ ] Scheduler cron configured: `* * * * * cd /path && php artisan schedule:run`
- [ ] Mail driver configured (not log driver in production)
- [ ] Timezone set in `config/app.php`
- [ ] Rate limiting configured in production

---

## Success Criteria

**Must Have (P0):**
- ✅ Users can book appointments without double-booking
- ✅ Confirmation emails sent with .ics attachments
- ✅ Race condition protection prevents conflicts
- ✅ FormRequest validates all inputs

**Should Have (P1):**
- ✅ Users can view and cancel their appointments
- ✅ Admin can manage all appointments via Filament
- ✅ No fetch() in Inertia pages
- ✅ Rate limiting prevents abuse

**Nice to Have (P2):**
- ✅ Timezone support for multi-location teams
- ✅ Configurable booking rules per team
- ✅ All calendar platforms supported
- ✅ Automated 24h reminders

---

## Rollback Plan

If critical issues found:

1. **Disable Booking:** Comment out `appointments.store` route
2. **Revert Migration:** `php artisan migrate:rollback --step=1`
3. **Clear Queue:** `php artisan queue:flush`
4. **Restore Original:** `git checkout app/Services/AppointmentService.php`

---

## Estimated Implementation Order

**Day 1:** Phases 1-3 (Database, Business Logic, Notifications)
**Day 2:** Phases 4-5 (Customer Dashboard, Admin Panel)
**Day 3:** Phases 6-8 (Inertia Fixes, Timezone, Calendar)
**Day 4:** Phases 9-10 (Testing, Verification, Launch)

**Total Complexity:** Medium-High (race conditions, timezone handling)
**Risk Level:** Medium (critical: double-booking prevention)
**Dependencies:** Existing Zap integration, queue infrastructure

---

## Notes for Implementation Agent

- Start each phase with documentation review
- Copy patterns from existing code (don't invent)
- Run tests after each phase
- Use `--no-interaction` flag on all artisan commands
- Verify anti-patterns after each implementation
- DB transaction is NON-NEGOTIABLE for booking
