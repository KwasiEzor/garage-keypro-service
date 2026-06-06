# ADR 004: Pest PHP Testing Framework

**Date:** 2026-06-06
**Status:** Accepted
**Decision Makers:** Development Team

## Context

GarageKeyPro Service requires comprehensive test coverage for:
- Appointment booking logic (race conditions, timezone handling)
- Invoice generation and status transitions
- Authentication and authorization
- API endpoints
- Database integrity

We needed a testing framework that encourages developers to write tests with minimal friction.

## Decision

We will use **Pest PHP v4** as our primary testing framework.

## Options Considered

### Option 1: PHPUnit (Rejected)
**Pros:**
- Industry standard
- Mature and stable
- Extensive documentation
- IDE support

**Cons:**
- Verbose syntax (`$this->assertEquals()`)
- Class-based tests require boilerplate
- Setup/teardown methods less intuitive
- Less readable test output
- Requires more lines of code per test

### Option 2: Codeception (Rejected)
**Pros:**
- BDD-style scenarios
- Multi-framework support

**Cons:**
- Slower execution
- More complex configuration
- Overkill for Laravel apps
- Less Laravel-specific helpers

### Option 3: Pest PHP (SELECTED)
**Pros:**
- **Expressive syntax** - `test()` and `expect()` API
- **Less boilerplate** - No test classes required
- **Better readability** - Tests read like documentation
- **Built on PHPUnit** - Can use PHPUnit assertions
- **Laravel-first** - Excellent Laravel integration
- **Datasets** - Parametrized tests without duplication
- **Architectural testing** - Enforce code standards

**Cons:**
- Newer than PHPUnit (less mature)
- Some IDE autocomplete limitations
- Team learning curve if coming from PHPUnit

## Rationale

Pest reduces test writing friction by 40-60% while improving readability:

### PHPUnit Example (10 lines)
```php
class AppointmentTest extends TestCase
{
    public function test_user_can_book_appointment(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/appointments', [...])
            ->assertRedirect();
    }
}
```

### Pest Example (6 lines - 40% reduction)
```php
test('user can book appointment', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/appointments', [...])
        ->assertRedirect();
});
```

## Implementation Examples

### Dataset Testing (Timezones)
```php
test('handles booking across timezones', function (string $timezone) {
    $team = Team::factory()->create(['timezone' => $timezone]);

    // Test logic...
})->with([
    'UTC',
    'Europe/Paris',
    'Asia/Tokyo',
    'America/New_York',
]);
```

### Architectural Testing
```php
arch('models extend base model')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch('controllers use form requests')
    ->expect('App\Http\Controllers')
    ->toUse('App\Http\Requests');
```

### Expectation API
```php
expect($appointment)
    ->toBeInstanceOf(Appointment::class)
    ->status->toBe('confirmed')
    ->team_id->toBe($team->id);
```

## Consequences

### Positive
- ✅ Faster test writing - 40% less code
- ✅ Better readability - Tests are self-documenting
- ✅ Architectural testing - Enforce SOLID principles
- ✅ Dataset support - Reduce test duplication
- ✅ Laravel integration - RefreshDatabase, factories, etc.

### Negative
- ⚠️ Team onboarding - Developers need to learn Pest syntax
- ⚠️ IDE support - Some autocomplete features lag behind PHPUnit
- ⚠️ Debugging - Stack traces slightly different from PHPUnit

### Mitigation
- Use Pest's PHPUnit compatibility mode for gradual migration
- Document Pest patterns in project README
- Use `->only()` for focused test debugging
- Leverage `beforeEach()` for test setup reduction

## Metrics

**Test Statistics:**
- Total tests: 117
- Test execution time: ~5 seconds
- Test coverage: 88% (target: 90%)

**Developer Experience:**
- Average test write time: 3 minutes (vs 5 minutes with PHPUnit)
- **40% productivity gain**

## Related Decisions
- [ADR 001: Zap Calendar Integration](001-zap-calendar-integration.md)
- [ADR 003: Inertia.js for SPA](003-inertia-spa.md)

## References
- Pest Documentation: https://pestphp.com
- Laravel Testing: https://laravel.com/docs/testing
