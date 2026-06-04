# Appointment Booking Wizard - Implementation Plan

## Overview
Modernize appointment booking UX from single-form to multi-step wizard with visual calendar and time grid selection. Target: 7-8/10 UX vs industry leaders (Calendly/Acuity).

## Approach
**Multi-Step Wizard with Visual Calendar & Time Grid**
- Step-by-step booking flow (Service → Calendar → Time → Review → Confirm)
- Visual calendar with availability indicators
- Button grid for time selection
- Confirmation summary page
- Reschedule functionality
- Mobile-first responsive design

---

## Pros & Cons

### ✅ Pros
**UX Impact**
- Eliminates dead-ends - Users see availability before picking date
- Faster booking - Visual selection 3x faster than dropdowns
- Lower cognitive load - One decision per step
- Higher conversion - Review step reduces booking anxiety (15-30% lift)
- Mobile-friendly - Button grids work better than native pickers

**Technical**
- Reuses existing backend - AppointmentService already solid
- Incremental migration - Can deploy step-by-step
- Standard patterns - React components well-documented
- Type-safe - TypeScript catches bugs early
- Testable - Each step isolated for testing

**Business**
- Matches user expectations - Calendly/Acuity set the standard
- Reduces support burden - Clear flow = fewer confused users
- Enables features - Foundation for waitlist, reminders, multi-booking
- Competitive - Brings UX to 7-8/10 vs industry

### ❌ Cons
**Implementation Cost**
- ~2-3 weeks dev time - Significant refactor
- New dependencies - react-day-picker, date-fns
- Testing overhead - More components = more tests
- Migration complexity - Existing bookings unaffected but need validation

**Technical Debt**
- Larger bundle size - Calendar library adds ~20-30KB gzipped
- More API calls - Need availability per day (can cache)
- State management - Multi-step wizard needs careful state handling

**Edge Cases**
- Timezone complexity - User TZ detection can fail
- Calendar performance - 100+ slots/day needs optimization
- Mobile gestures - Date swipe vs page scroll conflicts

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

#### Task 1.1: Install Dependencies & Setup
```bash
npm install react-day-picker date-fns
npm install -D @types/react-day-picker
```

**Deliverables:**
- Calendar component library installed
- Date utilities configured
- TypeScript types available

---

#### Task 1.2: Create Wizard State Management
**Component:** `resources/js/hooks/useBookingWizard.ts`

```typescript
interface BookingState {
  step: 1 | 2 | 3 | 4;
  serviceId: string;
  teamId: string;
  date: Date;
  slot: string;
  notes: string;
}
```

**Features:**
- Step navigation (next/prev/jump)
- Form state persistence
- Validation per step
- LocalStorage backup (resume incomplete booking)

---

#### Task 1.3: Backend - Availability Endpoint Enhancement
**Controller:** `AppointmentController@availability`

```php
// GET /api/appointments/availability
// ?service_id=1&team_id=2&month=2026-06
public function availability(Request $request)
{
    // Return: { "2026-06-05": { slots: 12, first: "09:00" }, ... }
}
```

**Features:**
- Month-level availability lookup (cache 5min)
- Per-day slot counts
- First available time per day
- Exclude past dates

**Files:**
- `routes/api.php`
- `app/Http/Controllers/AppointmentController.php`

---

### Phase 2: Core Components (Week 1-2)

#### Task 2.1: Step 1 - Service Selection
**Component:** `resources/js/pages/appointments/steps/ServiceStep.tsx`

**Features:**
- Service cards with image, name, duration, price
- Visual selection state
- Duration badge
- Price "from €X"
- Description tooltip

**Design:**
- Grid layout (2 cols mobile, 3 cols desktop)
- Large touch targets (min 120x120px)
- Racing red border on selected

---

#### Task 2.2: Step 2 - Calendar & Time Selection
**Component:** `resources/js/pages/appointments/steps/DateTimeStep.tsx`

**Features:**

**Calendar Section:**
- react-day-picker integration
- Availability indicators (dot/count badge)
- Disabled unavailable dates
- Month navigation
- Today highlight

**Time Grid Section:**
- Auto-load slots when date selected
- Button grid (3 cols mobile, 4 cols desktop)
- Group by time of day (Morning/Afternoon/Evening)
- Loading skeleton
- Empty state: "No slots available [Next Day →]"

**Files:**
- `resources/js/pages/appointments/steps/DateTimeStep.tsx`
- `resources/js/components/TimeSlotGrid.tsx`
- `resources/js/components/AvailabilityCalendar.tsx`

---

#### Task 2.3: Step 3 - Notes & Details
**Component:** `resources/js/pages/appointments/steps/DetailsStep.tsx`

**Features:**
- Vehicle specs textarea
- Optional fields clearly marked
- Character count (if limit)
- Example placeholder text

---

#### Task 2.4: Step 4 - Review & Confirm
**Component:** `resources/js/pages/appointments/steps/ReviewStep.tsx`

**Features:**
- Summary cards: Service, When, Where, Notes
- Price display: "Starting from €89"
- Cancellation policy: "Free cancellation up to 24h"
- Edit buttons per section (jump back to step)
- Final CTA: "Confirm Booking"

---

#### Task 2.5: Wizard Container & Navigation
**Component:** `resources/js/pages/appointments/index.tsx` (refactor)

**Features:**
- Step indicator (1/4 progress)
- Back/Next buttons
- Step validation before next
- Mobile: Bottom sheet navigation
- Desktop: Sidebar with completed steps

---

### Phase 3: Enhanced Features (Week 2)

#### Task 3.1: Reschedule Flow
**Backend:**
```php
// POST /appointments/{appointment}/reschedule
public function reschedule(Appointment $appointment, Request $request)
{
    $this->authorize('reschedule', $appointment);
    // Cancel old + create new (same transaction)
}
```

**Frontend:**
- "Reschedule" button on appointment show page
- Pre-fill wizard with existing appointment data
- Change service allowed? (config)
- Show cancellation reason

**Files:**
- `app/Http/Controllers/AppointmentController.php`
- `app/Policies/AppointmentPolicy.php`
- `resources/js/pages/appointments/show.tsx`

---

#### Task 3.2: Past Appointments & History
**Backend:**
```php
// Update myAppointments to return all, group by status
public function myAppointments(): Response
{
    return Inertia::render('appointments/my-appointments', [
        'upcoming' => $user->appointments()->upcoming()->get(),
        'past' => $user->appointments()->past()->get(),
        'cancelled' => $user->appointments()->cancelled()->get(),
    ]);
}
```

**Frontend:**
- Tab navigation: Upcoming | Past | Cancelled
- Past appointments: "Book Again" button
- Cancelled: Show reason
- Empty states per tab

**Files:**
- `app/Models/Appointment.php` (add scopes)
- `resources/js/pages/appointments/my-appointments.tsx`

---

#### Task 3.3: Mobile Optimization Pass
**Features:**
- Sticky footer with CTA
- Bottom sheet for selections (service/time)
- Larger touch targets (44x44px min)
- Swipeable steps
- Haptic feedback (vibrate on selection)

**Testing:**
- iOS Safari
- Android Chrome
- Various screen sizes (320px - 768px)

---

#### Task 3.4: Loading States & Feedback
**Features:**
- Skeleton UI while loading calendar
- Shimmer effect on slot grid
- Optimistic updates (instant UI response)
- Error boundaries with retry
- Toast notifications consistent

---

### Phase 4: Polish & Testing (Week 3)

#### Task 4.1: Timezone Handling
**Backend:**
- Store appointment in UTC (already doing)
- Send user timezone with booking
- Display times in user TZ

**Frontend:**
```tsx
// Detect user timezone
const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
```

---

#### Task 4.2: Automated Email Reminders
**Backend:**
```php
// New Job: SendAppointmentReminder
php artisan make:job SendAppointmentReminder

// Schedule in routes/console.php
Schedule::call(function () {
    Appointment::where('start_at', '>', now())
        ->where('start_at', '<', now()->addHours(24))
        ->each(fn($apt) => SendAppointmentReminder::dispatch($apt));
})->hourly();
```

**Files:**
- `app/Jobs/SendAppointmentReminder.php`
- `app/Mail/AppointmentReminder.php`
- `resources/views/emails/appointment-reminder.blade.php`
- `routes/console.php`

---

#### Task 4.3: Testing Suite
**Pest Tests:**
- Feature: booking through wizard
- Feature: calendar availability
- Feature: reschedule flow
- Feature: appointment history
- Browser: mobile navigation
- Browser: touch interactions

**Files:**
- `tests/Feature/AppointmentBookingWizardTest.php`
- `tests/Feature/AppointmentRescheduleTest.php`
- `tests/Browser/AppointmentBookingTest.php`

---

#### Task 4.4: Performance Optimization
**Backend:**
- Cache availability queries (5min TTL)
- Eager load relationships
- Database indexes

**Frontend:**
- Lazy load calendar library
- Prefetch availability
- Debounce API calls

**Target Metrics:**
- Lighthouse score >90
- FCP <1.5s
- LCP <2.5s

---

#### Task 4.5: Documentation & Handoff
**Docs:**
- User guide
- Admin guide
- Developer docs
- API docs

---

### Phase 5: Optional Enhancements (Post-Launch)

1. Waitlist functionality
2. SMS notifications
3. Group booking
4. Payment integration
5. Service bundles
6. Staff preference
7. Social proof indicators
8. Gift cards/promo codes

---

## Technical Stack

### New Dependencies
```json
{
  "react-day-picker": "^9.0.0",
  "date-fns": "^3.0.0"
}
```

### Backend (No Changes)
- Laravel 13
- Inertia v3
- Wayfinder
- Existing AppointmentService

---

## Success Metrics

### UX Metrics
- Booking completion rate: >80%
- Time to book: <2 minutes
- Bounce rate: <30%
- Mobile conversion: Match desktop

### Technical Metrics
- Lighthouse score: >90
- API response: <200ms (p95)
- Zero race conditions
- Test coverage: >85%

### Business Metrics
- Support tickets: -50%
- Repeat bookings: +20%
- Cancellations: -10%

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Foundation | 3-4 days | Backend API, wizard hook |
| Phase 2: Core Components | 5-7 days | Steps, calendar, time grid |
| Phase 3: Enhanced Features | 4-5 days | Reschedule, history, mobile |
| Phase 4: Polish & Testing | 3-4 days | Tests, performance, docs |
| **Total** | **15-20 days** | Production-ready |

---

## Rollout Strategy

### Week 1-2: Build & Internal Testing
- Dev environment
- Internal team testing
- Fix critical bugs

### Week 3: Beta Testing
- Staging deployment
- 10-20 beta users
- Collect feedback
- Monitor analytics

### Week 4: Gradual Rollout
- Day 1-2: 10% traffic
- Day 3-4: 50% traffic
- Day 5-7: 100% traffic
- Feature flag fallback

---

## Risk Mitigation

### High-Risk
1. Calendar performance with 90+ slots
   - Mitigation: Pagination, lazy load, cache

2. Mobile date picker UX varies by OS
   - Mitigation: Custom calendar (react-day-picker)

3. Timezone bugs
   - Mitigation: Extensive tests, display TZ everywhere

4. User confusion during migration
   - Mitigation: Feature flag, gradual rollout

### Medium-Risk
5. API performance
   - Mitigation: Redis cache, indexes, optimization

6. State management complexity
   - Mitigation: Proven patterns, tests

---

## Status Tracking

- [x] Phase 1: Foundation ✅ **COMPLETED**
  - [x] Task 1.1: Dependencies installed (react-day-picker, date-fns)
  - [x] Task 1.2: Wizard state hook (useBookingWizard.ts)
  - [x] Task 1.3: Backend availability API (AppointmentController@availability)

- [x] Phase 2: Core Components ✅ **COMPLETED**
  - [x] Task 2.1: Service selection step (ServiceStep.tsx)
  - [x] Task 2.2: Calendar & time step (DateTimeStep.tsx + AvailabilityCalendar + TimeSlotGrid)
  - [x] Task 2.3: Notes step (DetailsStep.tsx)
  - [x] Task 2.4: Review step (ReviewStep.tsx)
  - [x] Task 2.5: Wizard container (index-wizard.tsx)

- [x] Phase 3: Enhanced Features ⚠️ **PARTIALLY COMPLETE** (3.1 & 3.2 done)
  - [x] Task 3.1: Reschedule flow
  - [x] Task 3.2: Appointment history (tabs)
  - [ ] Task 3.3: Mobile optimization
  - [ ] Task 3.4: Loading states

- [ ] Phase 4: Polish & Testing
  - [ ] Task 4.1: Timezone handling
  - [ ] Task 4.2: Email reminders
  - [ ] Task 4.3: Test suite
  - [ ] Task 4.4: Performance optimization
  - [ ] Task 4.5: Documentation

---

## References
- [Time Picker UX Best Practices 2026](https://www.eleken.co/blog-posts/time-picker-ux)
- [Booking UX Patterns](https://app.uxcel.com/courses/common-patterns/booking-best-practices-107)
- [Booking Landing Page Examples 2026](https://unicornplatform.com/blog/best-booking-landing-page-examples-in-2026/)
- [Calendly vs Acuity Comparison](https://calendly.com/blog/calendly-versus-acuity)
- [Hotel Reservation System Design](https://phptravels.com/blog/hotel-reservation-system-design)
