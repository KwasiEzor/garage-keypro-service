# ADR 001: Zap Calendar Integration for Appointment Scheduling

**Date:** 2026-06-06
**Status:** Accepted
**Decision Makers:** Development Team

## Context

GarageKeyPro Service requires a robust appointment scheduling system with:
- Real-time availability management
- Team-specific schedules and working hours
- Multi-timezone support
- Conflict prevention (no double-booking)
- Calendar visualization for admin dashboard

We evaluated several approaches for implementing the scheduling backend.

## Decision

We will use **Zap** (Laravel scheduling package) for calendar and availability management.

## Options Considered

### Option 1: Custom Schedule Table (Rejected)
**Pros:**
- Full control over schema
- No external dependencies
- Simple to understand

**Cons:**
- Need to implement complex scheduling logic ourselves
- Recurring schedule patterns require significant code
- Timezone handling prone to bugs
- No visual calendar component out of the box
- High maintenance burden

### Option 2: Third-Party API (e.g., Calendly, Acuity) (Rejected)
**Pros:**
- Feature-complete solution
- Professional calendar UI
- Handles complex scheduling scenarios

**Cons:**
- Monthly subscription costs ($15-50/user)
- Limited customization
- Data stored externally (privacy concerns)
- Vendor lock-in
- API rate limits
- Requires internet connectivity

### Option 3: Zap Package (SELECTED)
**Pros:**
- Laravel-native package (composer-based)
- Flexible schedule models (availability, appointments, events)
- Built-in conflict detection
- Timezone-aware by design
- Free and open-source
- Data stays in our database
- Active maintenance

**Cons:**
- Learning curve for team
- Package updates may introduce breaking changes
- Less mature than commercial solutions

## Rationale

Zap provides the best balance of:
1. **Cost efficiency** - No per-user fees
2. **Data ownership** - All schedule data in our PostgreSQL database
3. **Customization** - Can extend models and add custom logic
4. **Integration** - Native Laravel integration with Eloquent ORM
5. **Performance** - Local queries, no API latency

The package handles the complex scheduling logic (recurring patterns, timezone conversions, conflict detection) while giving us full control over the business logic layer.

## Implementation Details

```php
// Team availability schedule
Zap::for($team)
    ->named('Standard Working Hours')
    ->availability()
    ->from(now()->format('Y-m-d'))
    ->to(now()->addYears(2)->endOfYear()->format('Y-m-d'))
    ->addPeriod('09:00', '12:00')
    ->addPeriod('14:00', '17:00')
    ->save();

// Appointment booking
$appointment = Zap::for($team)
    ->named($service->name . ' - ' . $client->name)
    ->appointment()
    ->on($startAt->format('Y-m-d'))
    ->addPeriod($startAt->format('H:i'), $endAt->format('H:i'))
    ->save();
```

## Consequences

### Positive
- ✅ Rapid development - Leveraged existing package instead of reinventing wheel
- ✅ Cost savings - No monthly subscription fees
- ✅ Data privacy - Client appointment data stays internal
- ✅ Testability - Can mock Zap facade in tests
- ✅ Performance - Database queries faster than external API calls

### Negative
- ⚠️ Package dependency - Must monitor for breaking changes in updates
- ⚠️ Limited community - Smaller ecosystem than commercial solutions
- ⚠️ Documentation gaps - Some features require source code inspection

### Mitigation
- Lock Zap version in composer.json to prevent unexpected breaking changes
- Create wrapper service (CalendarSyncService) to isolate Zap dependencies
- Queue calendar sync jobs to prevent blocking requests
- Comprehensive test coverage for scheduling logic

## Related Decisions
- [ADR 003: Filament Admin Interface](003-filament-admin-interface.md)
- [ADR 004: Inertia.js for SPA](004-inertia-spa.md)

## References
- Zap Package Documentation: https://github.com/zap/zap
- Laravel Scheduling Best Practices: https://laravel.com/docs/scheduling
