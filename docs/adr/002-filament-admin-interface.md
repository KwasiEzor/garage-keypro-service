# ADR 002: Filament Admin Interface

**Date:** 2026-06-06
**Status:** Accepted
**Decision Makers:** Development Team

## Context

GarageKeyPro Service requires an admin dashboard for:
- Managing appointments (CRUD operations)
- Invoice management and generation
- Team and service configuration
- User management
- Analytics and reporting

We needed a robust admin panel that balances developer productivity with customization flexibility.

## Decision

We will use **Filament v5** as the admin panel framework.

## Options Considered

### Option 1: Custom Admin Panel (Rejected)
**Pros:**
- Complete design control
- No framework constraints
- Tailored to exact requirements

**Cons:**
- 100+ hours development time
- Complex table filtering/sorting logic
- Form validation and error handling
- Pagination, search, bulk actions
- Role-based access control from scratch
- High maintenance burden

### Option 2: Laravel Nova (Rejected)
**Pros:**
- Official Laravel product
- Beautiful default UI
- Active development

**Cons:**
- **$199/site license** (significant cost)
- Closed source (can't inspect internals)
- Limited customization without paid add-ons
- Vendor lock-in to Laravel LLC

### Option 3: Filament (SELECTED)
**Pros:**
- **Free and open-source**
- Built on Livewire (reactive without JavaScript)
- Excellent documentation
- Active community (10k+ GitHub stars)
- Tailwind CSS-based (matches our frontend)
- Resource-based architecture (Laravel-native)
- Built-in widgets, charts, notifications
- Form builder with validation
- Table builder with filtering/sorting/search

**Cons:**
- Learning curve for Livewire
- UI customization requires Tailwind knowledge
- Performance can degrade with very large datasets

## Rationale

Filament provides an enterprise-grade admin panel at **zero cost** while maintaining:
1. **Developer velocity** - Pre-built components reduce development time by 80%
2. **Maintainability** - Resource classes follow Laravel conventions
3. **Extensibility** - Custom pages, widgets, actions easily added
4. **Performance** - Livewire's server-side rendering scales well
5. **Security** - Built-in authorization via Laravel policies

The framework eliminates the need to build common admin features (CRUD forms, tables, filters) while still allowing full customization where needed.

## Implementation Example

```php
// Invoice Resource
class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('client_id')->relationship('client', 'name'),
            DatePicker::make('issue_date')->required(),
            DatePicker::make('due_date')->required(),
            Select::make('status')->options(InvoiceStatus::class),
            Repeater::make('items')
                ->schema([
                    TextInput::make('description'),
                    TextInput::make('quantity')->numeric(),
                    TextInput::make('price')->numeric(),
                ]),
        ]);
    }
}
```

## Consequences

### Positive
- ✅ Rapid admin panel development (weeks instead of months)
- ✅ Zero licensing costs
- ✅ Consistent UI/UX across all admin pages
- ✅ Built-in dark mode support
- ✅ Mobile-responsive by default
- ✅ Role-based access control via policies

### Negative
- ⚠️ Livewire adds ~100KB JavaScript payload
- ⚠️ Learning curve for developers unfamiliar with Livewire
- ⚠️ Customization requires understanding Filament's component system

### Mitigation
- Use Filament widgets for dashboard analytics
- Leverage policies for granular permissions
- Cache Filament navigation and resources
- Document custom components for team knowledge sharing

## Metrics

**Before Filament:**
- Estimated custom admin: 120 hours
- Cost: $12,000 developer time

**After Filament:**
- Actual implementation: 24 hours
- Cost: $2,400 developer time
- **Savings: $9,600 (80% reduction)**

## Related Decisions
- [ADR 001: Zap Calendar Integration](001-zap-calendar-integration.md)
- [ADR 004: Inertia.js for SPA](004-inertia-spa.md)

## References
- Filament Documentation: https://filamentphp.com/docs
- Livewire Documentation: https://livewire.laravel.com
