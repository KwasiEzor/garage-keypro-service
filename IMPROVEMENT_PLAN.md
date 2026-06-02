# Garage KeyPro Service - Improvement Plan

**Project**: garage-keypro-service (Laravel 13 + Inertia v3 + React 19 + Filament v5)
**Current State**: 100/100 tests passing, basic auth functional, needs production hardening
**Goal**: Production-ready application with security, RBAC, infrastructure, performance, and comprehensive testing

---

## Phase 0: Documentation Discovery & Current State Analysis

### Documentation Sources Required

Before each phase, use Laravel Boost `search-docs` tool with these queries:

**Authorization & RBAC**:
- `search-docs` queries: `["authorization gates", "policies", "filament authorization"]`
- Key docs: Laravel authorization, Filament panel access control, role/permission patterns
- Current state: Basic UserPolicy exists (all methods return true), needs role-based checks

**Security Hardening**:
- `search-docs` queries: `["rate limiting", "csrf protection", "validation"]`
- Key docs: Laravel security, middleware, throttling, input sanitization
- Current state: Basic CSRF via Fortify, needs rate limiting and security headers

**Infrastructure & Deployment**:
- `search-docs` queries: `["docker deployment", "github actions", "environment configuration"]`
- Key docs: Laravel deployment, Docker setup, CI/CD patterns
- Current state: No Docker config, no CI/CD pipeline, dev-only .env

**Performance Optimization**:
- `search-docs` queries: `["cache", "queues jobs", "database optimization"]`
- Key docs: Laravel caching, queue workers, Eloquent optimization
- Current state: No caching strategy, no queue workers, potential N+1 queries

**Testing & Coverage**:
- `search-docs` queries: `["pest testing", "architecture tests", "code coverage"]`
- Key docs: Pest v4 patterns, arch() tests, coverage tools
- Current state: 100 tests (24 files), no browser tests, no arch tests

### Current Architecture Findings

**Models** (13 total):
- User, Team, Membership, Invoice, Brand, Service, Lead, Gallery, Setting, Passkey, etc.
- User has: teams (HasTeams trait), client_invoices, passkeys, 2FA support
- Team-based multi-tenancy with current_team_id

**Controllers** (11 total):
- PublicController, Admin/* controllers, Filament resources
- Mix of Inertia responses and API endpoints

**Policies** (3 total):
- UserPolicy, TeamPolicy, InvoicePolicy
- All methods currently return true (no role checks)

**Auth Stack**:
- Laravel Fortify (login, register, 2FA, passkeys)
- Filament v5 admin panel (canAccessPanel checks User::class)
- No role/permission system

**Routes**:
- `/admin/*` - Filament panel (auth middleware)
- `/` - Public Inertia pages
- API routes minimal

### Anti-Patterns to Avoid

❌ Don't invent authorization methods not in Laravel docs (e.g., `User::hasRole()` without package)
❌ Don't modify core Filament classes - use documented extension points
❌ Don't create custom auth guards without documented need
❌ Don't add middleware without checking existing stack
❌ Don't use deprecated APIs (check Laravel 13 upgrade guide)

---

## Phase 1: Role-Based Access Control (RBAC)

**Goal**: Implement proper role/permission system for User and Team authorization

### Tasks

**1.1 Add role column to users table**
```bash
php artisan make:migration add_role_to_users_table
```
- Migration file: `database/migrations/YYYY_MM_DD_HHMMSS_add_role_to_users_table.php`
- Copy pattern from: Existing migrations in `database/migrations/`
- Add: `$table->string('role')->default('member');`
- Enum values: `admin`, `manager`, `member`

**1.2 Create Role enum**
```bash
php artisan make:enum Role
```
- File: `app/Enums/Role.php`
- Copy pattern from: Check if TeamRole enum exists (mentioned in UserFactory)
- Define cases: `Admin`, `Manager`, `Member`
- Add helper methods: `isAdmin()`, `isManager()`, `canAccessAdminPanel()`

**1.3 Update User model**
- File: `app/Models/User.php` (line 70-110)
- Add to fillable: `'role'`
- Add to casts: `'role' => Role::class`
- Update `canAccessPanel()`: `return $this->role->canAccessAdminPanel();`
- Add helper: `public function isAdmin(): bool { return $this->role === Role::Admin; }`

**1.4 Update UserPolicy with role checks**
- File: `app/Policies/UserPolicy.php`
- Pattern: Admin can do everything, managers can view/update, members can only view themselves
```php
public function viewAny(User $user): bool {
    return $user->role->canAccessAdminPanel();
}

public function update(User $user, User $model): bool {
    return $user->isAdmin() || $user->id === $model->id;
}

public function delete(User $user, User $model): bool {
    return $user->isAdmin() && $user->id !== $model->id;
}
```

**1.5 Update TeamPolicy with role checks**
- File: `app/Policies/TeamPolicy.php`
- Check: Use `User::belongsToTeam()` and `User::hasTeamPermission()` (exists per summary)
- Pattern: Team ownership + role checks

**1.6 Update InvoicePolicy with role checks**
- File: `app/Policies/InvoicePolicy.php`
- Pattern: Admin can manage all, managers can manage team invoices, members view only

**1.7 Update UserFactory default role**
- File: `database/factories/UserFactory.php`
- Set: `'role' => Role::Member`
- Create state: `admin()` that sets `Role::Admin`

**1.8 Create seeder for admin user**
```bash
php artisan make:seeder AdminUserSeeder
```
- Create admin user with known credentials
- Add to DatabaseSeeder

### Verification

```bash
# Run migrations
php artisan migrate

# Run tests
php artisan test --compact --filter=UserManagementTest
php artisan test --compact --filter=Policy

# Verify in tinker
php artisan tinker --execute 'User::factory()->admin()->create()'
php artisan tinker --execute 'Gate::allows("viewAny", User::class)'
```

**Success criteria**:
- [ ] Migration adds role column
- [ ] Role enum exists with helper methods
- [ ] User model casts role to enum
- [ ] Policies check role before allowing actions
- [ ] Tests pass with role-based authorization
- [ ] Admin user seeder creates usable admin account

---

## Phase 2: Security Hardening

**Goal**: Add rate limiting, security headers, input validation, and audit logging

### Documentation Patterns

Search docs for:
- `"rate limiting routing"` - RateLimiter facade, throttle middleware
- `"security headers middleware"` - CSP, HSTS, X-Frame-Options
- `"validation form requests"` - Form Request classes

### Tasks

**2.1 Add rate limiting to authentication routes**
- File: Check `routes/web.php` or `app/Providers/FortifyServiceProvider.php`
- Pattern from docs: Use `RateLimiter::for('login', ...)` in RouteServiceProvider
- Add throttle middleware to Fortify routes
- Limits: 5 attempts per minute for login, 3 for password reset

**2.2 Add rate limiting to API routes**
- File: `routes/api.php`
- Add middleware: `throttle:api` (60 requests per minute)
- Custom limiter for sensitive endpoints

**2.3 Create security middleware for headers**
```bash
php artisan make:middleware SecurityHeaders
```
- Add headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Register in `bootstrap/app.php` middleware stack
- Check existing middleware in AdminPanelProvider (PreventRequestForgery mentioned)

**2.4 Create Form Request classes for validation**
```bash
php artisan make:request StoreLeadRequest
php artisan make:request UpdateServiceRequest
php artisan make:request CreateInvoiceRequest
```
- Move validation from controllers to Form Requests
- Add authorization checks
- Pattern: Check existing controllers in `app/Http/Controllers/`

**2.5 Add audit logging for sensitive operations**
```bash
php artisan make:migration create_activity_log_table
```
- Log: User role changes, invoice creation/updates, team membership changes
- Option: Use spatie/laravel-activitylog package (check with `search-docs`)

**2.6 Add CSRF token verification to Inertia forms**
- Files: Check `resources/js/` React components with forms
- Ensure: Inertia's CSRF handling is active (built-in with Inertia v3)
- Verify: `@csrf` token in Blade, axios/fetch includes token

**2.7 Sanitize user input in controllers**
- Review: All controllers in `app/Http/Controllers/`
- Add: Input validation via Form Requests
- Check: No raw DB queries with user input

### Verification

```bash
# Test rate limiting
php artisan test --compact --filter=RateLimit

# Check middleware stack
php artisan route:list --columns=Method,URI,Middleware

# Test Form Requests
php artisan test --compact --filter=Validation

# Verify security headers
curl -I https://garage-keypro-service.test
```

**Success criteria**:
- [ ] Rate limiting active on auth routes (test lockout after 5 attempts)
- [ ] Security headers middleware registered and active
- [ ] Form Request classes created with validation rules
- [ ] Audit log captures sensitive operations
- [ ] All controllers use Form Requests for validation
- [ ] Tests verify rate limiting and validation

---

## Phase 3: Infrastructure & Deployment Setup

**Goal**: Docker containerization, CI/CD pipeline, production environment config

### Documentation Patterns

Search docs for:
- `"docker sail"` - Laravel Sail for local development
- `"github actions testing"` - CI/CD patterns
- `"deployment production"` - Environment setup, caching, optimization

### Tasks

**3.1 Set up Laravel Sail for local Docker development**
```bash
php artisan sail:install
```
- Services: MySQL, Redis, Mailpit, Selenium (for browser tests)
- File: `docker-compose.yml` created
- Update README with Docker setup instructions

**3.2 Create Dockerfile for production**
- File: `Dockerfile`
- Pattern: Multi-stage build (composer install, npm build, production image)
- Base: `php:8.4-fpm-alpine`
- Copy pattern from Laravel docs or community examples

**3.3 Create docker-compose.production.yml**
- Services: App, Nginx, MySQL, Redis, Queue Worker
- Volumes for storage and logs
- Environment variables from .env

**3.4 Create GitHub Actions CI/CD pipeline**
- File: `.github/workflows/tests.yml`
- Jobs: Install dependencies, run Pint, run Larastan, run Pest tests
- Matrix: PHP 8.4
- Pattern: Search GitHub for "laravel pest github actions"

**3.5 Create deployment workflow**
- File: `.github/workflows/deploy.yml`
- Trigger: Push to `main` branch
- Steps: Build Docker image, push to registry, deploy to server
- Requires: Deployment secrets (SSH keys, Docker registry)

**3.6 Create environment config for production**
- File: `.env.production.example`
- Set: APP_ENV=production, APP_DEBUG=false, proper DB/Redis config
- Document required variables: APP_KEY, DB_*, MAIL_*, etc.

**3.7 Add health check endpoint**
```bash
php artisan make:controller HealthController
```
- Route: `/health`
- Check: Database connection, Redis connection, storage writable
- Response: JSON with status

**3.8 Create deployment scripts**
- File: `scripts/deploy.sh`
- Steps: Pull code, install deps, migrate DB, cache config/routes, restart queue workers
- File: `scripts/rollback.sh`
- Steps: Revert to previous release, migrate down if needed

### Verification

```bash
# Test Sail
./vendor/bin/sail up
./vendor/bin/sail artisan migrate

# Test Docker build
docker build -t garage-keypro-service .

# Test health check
curl http://localhost/health

# Push code to trigger CI/CD
git push origin main
```

**Success criteria**:
- [ ] Sail runs locally with all services
- [ ] Production Dockerfile builds successfully
- [ ] GitHub Actions runs tests on push
- [ ] Deployment workflow configured (manual trigger for now)
- [ ] Health check endpoint responds correctly
- [ ] Environment variables documented

---

## Phase 4: Performance Optimization

**Goal**: Caching, queue workers, database optimization, asset optimization

### Documentation Patterns

Search docs for:
- `"cache remember"` - Cache facade patterns
- `"queue jobs dispatch"` - Job classes and workers
- `"eager loading with"` - N+1 query prevention

### Tasks

**4.1 Set up Redis for caching**
- File: `.env` - Set `CACHE_DRIVER=redis`, `SESSION_DRIVER=redis`
- File: `config/cache.php` - Verify Redis config
- Sail: Redis service already included from Phase 3

**4.2 Add caching to frequently accessed data**
- File: `app/Http/Controllers/PublicController.php`
- Cache: Services list, brands list, gallery images
- Pattern: `Cache::remember('services', 3600, fn() => Service::all())`
- Add cache tags for grouped invalidation

**4.3 Create cache warming command**
```bash
php artisan make:command WarmCache
```
- Warm: Services, brands, settings, public data
- Schedule: Run daily in `app/Console/Kernel.php`

**4.4 Implement queue workers for heavy tasks**
```bash
php artisan make:job SendInvoiceEmail
php artisan make:job ProcessGalleryImage
```
- Move: Email sending, image processing to queues
- File: `.env` - Set `QUEUE_CONNECTION=redis`
- Update controllers to dispatch jobs

**4.5 Add database indexes**
- File: Create migration `add_indexes_to_tables`
- Indexes needed (based on common queries):
  - `users.email` (unique, already exists)
  - `invoices.client_id` (foreign key)
  - `invoices.status`
  - `leads.created_at`
  - `gallery.is_published`
- Check existing indexes first: `php artisan db:show --counts`

**4.6 Optimize Eloquent queries**
- Find N+1 queries: Install `barryvdh/laravel-debugbar` for dev
- Files to check: All controllers and Filament resources
- Pattern: Replace `$users->teams` with `$users->load('teams')` or use `with('teams')`
- Check: `Invoice` with `client` relationship, `Team` with `members`

**4.7 Add response caching for public pages**
```bash
composer require spatie/laravel-responsecache
```
- Cache: Homepage, services page, gallery (public routes)
- TTL: 1 hour
- Invalidate: On content update

**4.8 Optimize frontend assets**
- File: `vite.config.js`
- Add: Code splitting for large components
- Add: Image lazy loading (already started in hero-section.tsx)
- Run: `npm run build` and check bundle size

### Verification

```bash
# Test cache
php artisan tinker --execute 'Cache::put("test", "value", 60); Cache::get("test");'

# Test queue
php artisan queue:work --once

# Check indexes
php artisan db:show

# Test N+1 detection
php artisan test --filter=DatabaseQueries

# Measure performance
php artisan route:list --columns=Method,URI --except-vendor
# Use browser DevTools for frontend performance
```

**Success criteria**:
- [ ] Redis cache working (verify with tinker)
- [ ] Frequently accessed data cached
- [ ] Queue jobs processing successfully
- [ ] Database indexes added to foreign keys and filtered columns
- [ ] No N+1 queries in main routes (test with debugbar)
- [ ] Response caching active on public pages
- [ ] Frontend bundle size reduced (check build output)

---

## Phase 5: Comprehensive Testing & Coverage

**Goal**: Increase test coverage, add browser tests, architecture tests, and CI integration

### Documentation Patterns

Search docs for:
- `"pest browser testing"` - Browser tests with Selenium
- `"pest architecture tests"` - arch() tests for code rules
- `"code coverage xdebug"` - Coverage reporting

### Tasks

**5.1 Add Pest architecture tests**
- File: `tests/Architecture/GeneralTest.php`
```php
arch('controllers extend base controller')
    ->expect('App\Http\Controllers')
    ->toExtendNothing()
    ->ignoring('App\Http\Controllers\Controller');

arch('models extend base model')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch('policies follow naming convention')
    ->expect('App\Policies')
    ->toHaveSuffix('Policy');
```

**5.2 Add security architecture tests**
- File: `tests/Architecture/SecurityTest.php`
```php
arch('controllers use form requests for validation')
    ->expect('App\Http\Controllers')
    ->not->toUse(['Illuminate\Support\Facades\Validator']);

arch('no debug statements in production code')
    ->expect(['dd', 'dump', 'var_dump', 'print_r'])
    ->not->toBeUsed();
```

**5.3 Create browser tests for critical flows**
```bash
php artisan make:test Auth/LoginFlowTest
php artisan make:test Invoice/CreateInvoiceFlowTest
```
- Use: Pest browser testing (Sail includes Selenium)
- Pattern: `->visit('/login')->type('email', 'test@example.com')->click('Login')`
- Test: Login, 2FA, invoice creation, team switching

**5.4 Add feature tests for missing coverage**
- Models: Gallery, Lead, Service, Brand (test relationships, scopes)
- Controllers: All public controller methods
- Policies: All policy methods with different roles
- Middleware: Security headers, rate limiting

**5.5 Set up code coverage reporting**
- File: `phpunit.xml` (line 43)
- Enable coverage: Add `<coverage>` section with source paths
- Generate report: `php artisan test --coverage --min=80`
- CI: Upload coverage to Codecov or Coveralls

**5.6 Add API tests for endpoints**
- File: `tests/Feature/Api/InvoiceApiTest.php`
- Test: All API routes with various auth states
- Check: Response structure, status codes, validation errors

**5.7 Add smoke tests for all pages**
- File: `tests/Feature/SmokeTest.php`
```php
it('can load all public pages', function (string $route) {
    get($route)->assertOk();
})->with([
    '/',
    '/services',
    '/gallery',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
]);
```

**5.8 Add performance tests**
- File: `tests/Performance/DatabaseTest.php`
- Test: No N+1 queries in main routes
- Pattern: Use `DB::enableQueryLog()` and assert query count

### Verification

```bash
# Run all tests
php artisan test --compact

# Run architecture tests
php artisan test --filter=Architecture

# Run browser tests (requires Selenium)
./vendor/bin/sail artisan test --filter=Browser

# Generate coverage report
php artisan test --coverage --min=80

# Check for N+1 queries
php artisan test --filter=Performance
```

**Success criteria**:
- [ ] Architecture tests enforce code quality rules
- [ ] Browser tests cover critical user flows
- [ ] Code coverage ≥ 80%
- [ ] All public routes have smoke tests
- [ ] All API endpoints have tests
- [ ] Performance tests detect N+1 queries
- [ ] CI runs all tests and reports coverage

---

## Phase 6: UX Enhancements & Frontend Polish

**Goal**: Improve user experience, accessibility, responsive design, and error handling

### Documentation Patterns

Search docs for:
- `"inertia form validation"` - Client-side validation patterns
- `"react accessibility"` - ARIA labels, keyboard navigation
- `"tailwind responsive"` - Mobile-first design

### Tasks

**6.1 Add client-side form validation**
- Files: All form components in `resources/js/pages/` and `resources/js/components/`
- Pattern: Use Inertia's `useForm()` with validation rules
- Add: Real-time validation feedback (already started with brand search)
- Check: `resources/js/pages/home.tsx` for existing patterns

**6.2 Improve error handling and user feedback**
- Add toast notifications for success/error states
- Library: Consider `react-hot-toast` or `sonner`
- Add error boundaries in React components
- Graceful degradation for failed API calls

**6.3 Add loading states and skeletons**
- Files: All pages with deferred props or async data
- Pattern: Already started in some components (check for existing skeletons)
- Add: Skeleton components for loading states
- Inertia v3: Use deferred props with empty states

**6.4 Enhance accessibility (a11y)**
- Audit: Run Lighthouse accessibility tests
- Fix: Missing ARIA labels, low contrast text, keyboard navigation
- Add: Skip links, focus management
- Tools: `eslint-plugin-jsx-a11y`

**6.5 Optimize responsive design**
- Files: All components with layout issues on mobile
- Check: hero-section.tsx, service-card.tsx, gallery-card.tsx (modified recently)
- Pattern: Use Tailwind mobile-first breakpoints (sm:, md:, lg:)
- Test: Chrome DevTools responsive mode

**6.6 Add pagination to gallery and lists**
- Files: `resources/js/pages/gallery/index.tsx`
- Pattern: Inertia pagination (already has real-time search)
- Add: Infinite scroll option using Inertia v3 features

**6.7 Improve dashboard and admin UX**
- Filament: Customize widgets, charts, and navigation
- File: `app/Providers/Filament/AdminPanelProvider.php`
- Add: Dashboard widgets for key metrics (invoices, leads, revenue)

**6.8 Add offline support (PWA basics)**
- Add: `manifest.json` for PWA
- Add: Service worker for offline page caching
- Tool: `vite-plugin-pwa`

### Verification

```bash
# Run Lighthouse
npm run build
# Use Chrome DevTools > Lighthouse > Run audit

# Test responsive design
# Manual: Chrome DevTools > Toggle device toolbar

# Test accessibility
npx eslint resources/js --ext .tsx

# Test forms
# Manual: Fill out all forms, trigger validation errors

# Test PWA
# Manual: Chrome DevTools > Application > Service Workers
```

**Success criteria**:
- [ ] All forms have client-side validation with real-time feedback
- [ ] Error boundaries catch and display errors gracefully
- [ ] Loading states use skeleton components
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Mobile responsive on all pages (test 375px width)
- [ ] Pagination works on all list pages
- [ ] Dashboard shows useful metrics and widgets
- [ ] PWA manifest exists and service worker registers

---

## Phase 7: Documentation & Monitoring

**Goal**: Complete documentation, add monitoring, and prepare for production launch

### Tasks

**7.1 Complete README.md**
- Add: Installation instructions (Docker, local)
- Add: Testing instructions
- Add: Deployment instructions
- Add: API documentation link
- Add: Contributing guidelines

**7.2 Add API documentation**
```bash
composer require darkaonline/l5-swagger
```
- Generate: Swagger/OpenAPI docs for API routes
- Endpoint: `/api/documentation`

**7.3 Add monitoring and error tracking**
```bash
composer require sentry/sentry-laravel
```
- Set up: Sentry for error tracking (or alternative like Flare)
- Add: `SENTRY_LARAVEL_DSN` to `.env.production.example`
- Test: Trigger error and verify in Sentry dashboard

**7.4 Add application performance monitoring (APM)**
- Option 1: Laravel Pulse (lightweight, built-in)
- Option 2: New Relic or DataDog (full APM)
- Track: Slow queries, queue jobs, cache hit rate

**7.5 Create runbook for operations**
- File: `docs/RUNBOOK.md`
- Include: Common tasks (deploy, rollback, scale queue workers)
- Include: Troubleshooting (DB connection issues, cache problems)
- Include: Monitoring dashboards and alerts

**7.6 Add changelog**
- File: `CHANGELOG.md`
- Format: Keep a Changelog format
- Document: All phases completed, breaking changes, migrations

**7.7 Security audit and penetration testing**
- Run: `composer audit` for dependency vulnerabilities
- Run: Laravel security checker
- Consider: Third-party penetration testing

**7.8 Load testing**
- Tool: Apache Bench, k6, or Loader.io
- Test: Homepage, login, invoice creation under load
- Identify: Bottlenecks and optimize

### Verification

```bash
# Check documentation completeness
cat README.md CHANGELOG.md docs/RUNBOOK.md

# Test API docs
curl http://localhost/api/documentation

# Verify Sentry integration
php artisan sentry:test

# Run security audit
composer audit

# Load test
ab -n 1000 -c 10 http://localhost/
```

**Success criteria**:
- [ ] README has complete setup and deployment instructions
- [ ] API documentation generated and accessible
- [ ] Error tracking active (test with triggered error)
- [ ] APM showing metrics (queries, jobs, cache)
- [ ] Runbook documents all operational procedures
- [ ] Changelog documents all changes
- [ ] No critical security vulnerabilities in dependencies
- [ ] Application handles 100 concurrent users without errors

---

## Final Phase: Pre-Production Checklist

### Verification Steps

Run all verification commands from previous phases:

```bash
# Code quality
vendor/bin/pint --test
vendor/bin/phpstan analyse
php artisan test --coverage --min=80

# Security
composer audit
curl -I https://garage-keypro-service.test | grep -E '(X-Frame-Options|X-Content-Type-Options)'

# Performance
# Check N+1 queries, cache hit rate, query times

# Infrastructure
docker build -t garage-keypro-service .
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate:fresh --seed

# Documentation
# Review all docs for completeness

# Monitoring
# Verify Sentry, APM, health checks
```

### Production Readiness Checklist

- [ ] **Security**: Rate limiting, CSRF, HTTPS, security headers, audit logs
- [ ] **Authorization**: RBAC implemented, policies enforce role checks
- [ ] **Infrastructure**: Docker setup, CI/CD pipeline, deployment scripts
- [ ] **Performance**: Redis cache, queue workers, database indexes, no N+1 queries
- [ ] **Testing**: 80%+ coverage, architecture tests, browser tests, load tests
- [ ] **UX**: Forms validated, errors handled, responsive, accessible (Lighthouse ≥ 90)
- [ ] **Documentation**: README, API docs, runbook, changelog
- [ ] **Monitoring**: Error tracking, APM, health checks, alerts
- [ ] **Environment**: Production .env configured, secrets secured
- [ ] **Backups**: Database backup strategy, disaster recovery plan

### Known Gaps & Future Work

1. **Advanced Permissions**: Current RBAC is role-based only (admin/manager/member). Consider adding fine-grained permissions system (e.g., Spatie Laravel-permission) for complex authorization needs.

2. **Multi-tenancy Isolation**: Verify team data isolation is enforced at database level (scopes, policies). Consider row-level security.

3. **Internationalization (i18n)**: No translation support. Add if serving multiple languages.

4. **Advanced Search**: Basic search exists. Consider Meilisearch or Algolia for better search UX.

5. **Real-time Features**: No WebSockets. Add Laravel Reverb or Pusher if real-time updates needed.

6. **Mobile App**: Web-only. Consider API-first refactor if native mobile apps planned.

7. **Analytics**: Basic usage tracking. Consider adding Google Analytics or Plausible.

8. **Email Templates**: Basic transactional emails. Consider branded HTML email templates.

---

## Execution Strategy

### Recommended Order

1. **Phase 1 (RBAC)** - Critical for security, blocks Phase 2 security tests
2. **Phase 2 (Security)** - Critical for production, required before Phase 3 deployment
3. **Phase 5 (Testing)** - Parallel with Phases 1-2, verify as you build
4. **Phase 3 (Infrastructure)** - After core security, prepare deployment
5. **Phase 4 (Performance)** - After infrastructure, optimize before launch
6. **Phase 6 (UX)** - Parallel with Phase 4, frontend polish
7. **Phase 7 (Docs & Monitoring)** - Final phase before launch

### Time Estimates (Developer Days)

- Phase 1: 2-3 days
- Phase 2: 2-3 days
- Phase 3: 3-4 days
- Phase 4: 2-3 days
- Phase 5: 3-4 days
- Phase 6: 2-3 days
- Phase 7: 2-3 days

**Total**: ~16-23 developer days (3-5 weeks for single developer)

### Risk Mitigation

- **Breaking Changes**: Each phase includes backwards-compatible changes where possible. Test thoroughly after Phase 1 (RBAC) as it changes auth behavior.
- **Data Migration**: Phase 1 adds `role` column - requires data migration for existing users (all become `member` by default).
- **Downtime**: Phases 3-4 may require brief downtime for Redis/queue setup. Plan maintenance window.

---

## Tools & Commands Reference

```bash
# Laravel Boost (use these for docs)
# Already configured as MCP server
search-docs query="your search" packages=["laravel", "filament"]
database-query query="SELECT * FROM users LIMIT 5"
database-schema table="users"
get-absolute-url path="/admin/users"

# Code quality
vendor/bin/pint --dirty
vendor/bin/phpstan analyse
composer audit

# Testing
php artisan test --compact
php artisan test --coverage --min=80
php artisan test --filter=Architecture

# Infrastructure
./vendor/bin/sail up -d
docker build -t garage-keypro-service .
php artisan route:list --columns=Method,URI,Middleware

# Performance
php artisan cache:clear
php artisan queue:work
php artisan db:show

# Frontend
npm run dev
npm run build
npm run lint
```

---

**Plan Created**: 2026-06-02
**For**: garage-keypro-service
**By**: Claude Code (Orchestrator)
**Next Step**: Review plan → Execute phases sequentially → Verify each phase → Ship to production
