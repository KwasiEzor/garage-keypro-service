# Changelog

All notable changes to GarageKeyPro Service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-06-06

### Added
- **Phase 4: Technical Debt Reduction**
  - Architecture Decision Records (ADRs) for Zap, Filament, Inertia, and Pest
  - Comprehensive deployment guide with Nginx/Supervisor configuration
  - CHANGELOG.md with semantic versioning

- **Phase 3: Accessibility Improvements**
  - ARIA labels for time slot selection (`aria-label`, `aria-pressed`)
  - Screen reader support for appointment booking wizard
  - Role-based grouping for interactive elements

- **Phase 2: Test Coverage Expansion**
  - Timezone parametrized tests (UTC, Europe/Paris, Asia/Tokyo, America/New_York, Australia/Sydney)
  - Cross-timezone double-booking prevention test
  - OpenAPI 3.0.3 specification for JSON endpoints (`docs/api/openapi.yaml`)
  - Restored critical removed tests (booking wizard, reschedule flow)

- **Phase 1: Security & Performance Hardening**
  - Timezone validation to prevent DoS attacks via invalid timezone strings
  - Rate limiting (30 req/min) on public invoice route to prevent UUID enumeration
  - Composite database indexes for appointments and invoices (O(n) → O(log n) queries)
  - Pessimistic locking for reschedule flow to prevent race conditions
  - Background job queue for Zap calendar sync (non-blocking requests)

### Changed
- Migrated Zap calendar sync from synchronous to queued background job
- Enhanced TimeSlotGrid component with accessibility attributes
- Improved test suite organization with better naming conventions

### Fixed
- Race condition in appointment reschedule flow
- Potential DoS vulnerability from unvalidated timezone input
- Slow filtered queries on appointments and invoices tables

### Security
- **CRITICAL:** Added timezone validation against `DateTimeZone::listIdentifiers()`
- **HIGH:** Implemented rate limiting on invoice show route (30/min per IP)
- **HIGH:** Fixed reschedule race condition with `lockForUpdate()` pessimistic locking

### Performance
- Added composite indexes: `idx_appointments_filter` (team_id, status, start_at)
- Added composite indexes: `idx_invoices_filter` (team_id, status, created_at)
- Moved Zap calendar sync to background queue (reduced response time by ~200ms)

### Documentation
- Created 4 Architecture Decision Records (ADR 001-004)
- Added comprehensive deployment guide (`docs/DEPLOYMENT.md`)
- Created OpenAPI 3.0.3 API specification (`docs/api/openapi.yaml`)

## [1.2.0] - 2026-06-05

### Added
- Production-ready appointment booking wizard (4-step flow)
  - Service selection step
  - Date/time selection with calendar
  - Details input (notes, vehicle info)
  - Review and confirmation
- Appointment reschedule functionality with validation
- Tabbed appointment history view (Upcoming, Past, Cancelled)
- Filament admin interface for appointment management
- Timezone and reminder support for appointments
- Vehicle fields in appointments table (make, model, year, license plate)

### Changed
- Refactored appointment dashboard UI with structured cards
- Enhanced appointment view with status-based actions
- Improved appointment list filtering and sorting

### Fixed
- TypeError in `AppointmentService::getAvailableSlots()` (returns array instead of Collection)
- React hydration mismatch in BackgroundSpotlight component
- Route mismatch between web.php and controller methods

### Performance
- Optimized custom cursor animation using GSAP `quickTo()`
- Minimized service card animations for faster page load

### Security
- Implemented race condition protection for appointment booking using `lockForUpdate()`

## [1.1.0] - 2026-06-02

### Added
- Health check endpoint (`/health`) for monitoring
- Production infrastructure: Docker setup, CI/CD configuration
- Horizon queue dashboard integration
- Pulse monitoring for application metrics

### Changed
- Architecture decision: Events + Horizon vs Reverb for invoice system (chose Horizon)

### Documentation
- Improvement plan document (`IMPROVEMENT_PLAN.md`)
- UX analysis comparing booking functionality to Calendly/Acuity standards

## [1.0.0] - 2026-06-01

### Added
- **Invoice System**
  - Invoice CRUD operations with Filament admin
  - Invoice status enum (Draft, Sent, Paid, Partial, Overdue, Cancelled)
  - Invoice PDF generation with Blade templates
  - Invoice number auto-generation
  - Tax calculations (item-level and invoice-level)
  - Money value object for financial calculations

- **Public Website**
  - Homepage with lead generation form
  - Services showcase page
  - Team profiles page
  - Contact page with Google Maps integration
  - Testimonials carousel component
  - Custom cursor with GSAP animations
  - Background spotlight effects

- **SEO & Compliance**
  - Site settings management in Filament
  - Privacy policy and terms of service pages
  - GDPR compliance features
  - Sitemap generation
  - Meta tags and Open Graph support

- **Filament Admin Panel**
  - Resource management for appointments, invoices, services
  - Technical gallery widget
  - Dashboard with statistics
  - User management

- **Frontend**
  - React 19 with Inertia.js v3
  - TypeScript strict mode
  - Tailwind CSS v4 for styling
  - Custom design system (luxury theme with racing red accents)
  - Responsive design for mobile/tablet/desktop

- **Testing**
  - Pest PHP v4 test suite
  - Feature tests for appointments and invoices
  - Architecture tests for code quality enforcement
  - PHPStan level 8 static analysis

### Performance
- Lighthouse score optimizations
  - Lazy loading for images
  - Code splitting for JavaScript bundles
  - Font preloading
  - Critical CSS inlining

### Security
- Laravel Sanctum for authentication
- CSRF protection on all forms
- Rate limiting on lead submission (3/min)
- Session security with HTTP-only cookies

### Developer Experience
- PHPDoc blocks for all classes and methods
- Laravel Pint code formatter
- Rector for automated refactoring
- Comprehensive README with setup instructions

## [0.1.0] - 2026-05-27

### Added
- Initial Laravel 13 application setup
- Pest testing framework installation
- Laravel Boost integration for enhanced developer experience
- Database schema: teams, services, appointments, invoices
- Authentication system with Laravel Fortify
- Multi-tenancy support via team-scoped models

---

## Migration Guide

### From 1.2.0 to 1.3.0

**No breaking changes.** This is a minor release focused on documentation and security hardening.

**Required Actions:**
1. Run migrations: `php artisan migrate --force`
2. Restart queue workers: `php artisan queue:restart`
3. Clear caches: `php artisan config:cache && php artisan route:cache`

**New Environment Variables:**
None required.

**Database Changes:**
- Added composite indexes (automatically applied via migration)

---

## Versioning Strategy

**Major (X.0.0):** Breaking changes requiring user action
**Minor (0.X.0):** New features, non-breaking changes
**Patch (0.0.X):** Bug fixes, security patches

---

## Support

**Documentation:** [GitHub Wiki](https://github.com/KwasiEzor/garage-keypro-service/wiki)
**Issues:** [GitHub Issues](https://github.com/KwasiEzor/garage-keypro-service/issues)
**Discussions:** [GitHub Discussions](https://github.com/KwasiEzor/garage-keypro-service/discussions)

---

[Unreleased]: https://github.com/KwasiEzor/garage-keypro-service/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/KwasiEzor/garage-keypro-service/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/KwasiEzor/garage-keypro-service/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/KwasiEzor/garage-keypro-service/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/KwasiEzor/garage-keypro-service/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/KwasiEzor/garage-keypro-service/releases/tag/v0.1.0
