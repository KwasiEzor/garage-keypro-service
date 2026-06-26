# GarageKeyPro Service — Developer Guide

> Complete reference for engineers working on this codebase.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites & Local Setup](#3-prerequisites--local-setup)
4. [Environment Configuration](#4-environment-configuration)
5. [Directory Structure](#5-directory-structure)
6. [Database & Models](#6-database--models)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Routing](#8-routing)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Admin Panel (Filament)](#10-admin-panel-filament)
11. [Site Settings System](#11-site-settings-system)
12. [Analytics & Tracking](#12-analytics--tracking)
13. [Email & Notifications](#13-email--notifications)
14. [Invoice & PDF System](#14-invoice--pdf-system)
15. [Appointment Booking System](#15-appointment-booking-system)
16. [Real-time (Reverb)](#16-real-time-reverb)
17. [Caching Strategy](#17-caching-strategy)
18. [Queue & Jobs](#18-queue--jobs)
19. [Code Quality Toolchain](#19-code-quality-toolchain)
20. [Testing](#20-testing)
21. [Seeding & Development Data](#21-seeding--development-data)
22. [Deployment](#22-deployment)
23. [Common Tasks & Recipes](#23-common-tasks--recipes)

---

## 1. Project Overview

**GarageKeyPro Service** is a full-stack web application for an automotive locksmith business in Lomé, Togo. It handles:

- Public marketing site (services, gallery, testimonials, FAQs)
- Appointment booking with availability management
- Lead capture and CRM
- Invoice generation with PDF export
- Multi-team admin dashboard
- Real-time notifications via Laravel Reverb
- Analytics and page-view tracking

**Admin credentials (local dev):**
```
URL:      https://garage-keypro-service.test/admin
Email:    admin@garage-keypro.com
Password: Admin@1234!
```

---

## 2. Tech Stack

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| PHP | 8.4 | Runtime |
| Laravel | 13 | Framework |
| Laravel Fortify | 1 | Authentication (passkeys, 2FA, email verification) |
| Filament | 5 | Admin panel |
| Inertia Laravel | 3 | Server-side Inertia adapter |
| Laravel Horizon | 5 | Queue dashboard |
| Laravel Pulse | 1 | Performance monitoring |
| Laravel Reverb | — | WebSocket server |
| Laravel Wayfinder | 0 | Type-safe route helpers |
| Spatie Permission | 8 | RBAC |
| Spatie Media Library | — | File/image management |
| Spatie CSP | 3 | Content Security Policy |
| Spatie Sluggable | 4 | Auto-generated slugs |
| DomPDF | 3 | PDF invoice generation |
| Brick/Money | 0 | Currency arithmetic |
| Sentry | 4 | Error monitoring |
| Larastan | 3 | PHPStan for Laravel |
| Pest | 4 | Testing framework |
| Pint | 1 | PHP code style |
| Rector | 2 | Automated refactoring |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI library |
| TypeScript | 5.7 | Type safety |
| Inertia React | 3 | Client-side Inertia adapter |
| Tailwind CSS | 4 | Utility CSS |
| Radix UI | — | Accessible component primitives |
| Zod | 4 | Schema validation |
| React Hook Form | 7 | Form state |
| GSAP | 3.12 | Animations |
| Framer Motion | 12 | Animations |
| date-fns | 4 | Date utilities |
| lucide-react | — | Icons |
| Sonner | 2 | Toast notifications |
| Vite | 8 | Build tool |
| ESLint + Prettier | 9 / 3 | JS code quality |

---

## 3. Prerequisites & Local Setup

### Requirements

- [Laravel Herd](https://herd.laravel.com) — serves the site at `https://garage-keypro-service.test`
- PHP 8.4 (via Herd)
- Node.js 22+
- PostgreSQL (managed by Herd or standalone)
- Composer 2.x

### First-time setup

```bash
# 1. Clone the repository
git clone https://github.com/KwasiEzor/garage-keypro-service.git
cd garage-keypro-service

# 2. One-command setup (installs deps, generates key, migrates, builds assets)
composer run setup

# OR manually:
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
npm run build
```

### Running the dev server

```bash
# Runs: artisan serve + queue:listen + pail + vite dev (concurrent)
composer run dev
```

The site is served by Herd at `https://garage-keypro-service.test` — do **not** run `php artisan serve` separately.

### Database

The project uses **PostgreSQL** locally. Configure `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=keypro
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

---

## 4. Environment Configuration

Copy `.env.example` to `.env` and fill in these key values:

```env
APP_NAME="KeyPro Service"
APP_ENV=local
APP_URL=https://garage-keypro-service.test

# Database
DB_CONNECTION=pgsql
DB_DATABASE=keypro

# Queue (use database for local, Redis in production)
QUEUE_CONNECTION=database

# Broadcasting (Reverb for real-time)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

# Mail (Mailpit for local dev — runs on http://localhost:8025)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_FROM_ADDRESS="noreply@garage-keypro.com"

# Sentry (optional for local)
SENTRY_LARAVEL_DSN=
```

---

## 5. Directory Structure

```
garage-keypro-service/
├── app/
│   ├── Enums/                  # PHP Enums (Role, AppointmentStatus, etc.)
│   ├── Filament/
│   │   ├── Pages/              # Custom admin pages
│   │   ├── Resources/          # Admin CRUD resources
│   │   └── Widgets/            # Dashboard widgets
│   ├── Http/
│   │   ├── Controllers/        # Application controllers
│   │   └── Middleware/         # Custom middleware
│   ├── Models/                 # Eloquent models
│   ├── Notifications/          # Email/DB notifications
│   ├── Observers/              # Model observers (cache busting, activity log)
│   ├── Policies/               # Authorization policies
│   ├── Providers/              # Service providers
│   └── Services/               # Business logic services
├── database/
│   ├── factories/              # Model factories
│   ├── migrations/             # Database migrations
│   └── seeders/                # Database seeders
├── docs/                       # Developer documentation (this file)
├── resources/
│   ├── css/                    # Tailwind entry points
│   ├── js/
│   │   ├── actions/            # Wayfinder-generated route helpers
│   │   ├── components/         # Reusable React components
│   │   │   ├── brand/          # Public-facing marketing components
│   │   │   ├── premium/        # Premium car showcase
│   │   │   └── ui/             # Generic UI primitives (shadcn-style)
│   │   ├── layouts/            # React layout components
│   │   ├── lib/                # Utilities and helpers
│   │   ├── pages/              # Inertia page components
│   │   │   ├── appointments/   # Booking flow (multi-step)
│   │   │   ├── auth/           # Login, register, 2FA, passkeys
│   │   │   ├── brands/         # Brand catalogue
│   │   │   ├── gallery/        # Gallery
│   │   │   ├── Invoices/       # Dashboard invoices
│   │   │   ├── legal/          # Privacy policy, ToS
│   │   │   ├── services/       # Service catalogue
│   │   │   └── settings/       # User profile/security settings
│   │   ├── routes/             # Wayfinder-generated typed routes
│   │   └── types/              # TypeScript type definitions
│   └── views/
│       ├── emails/             # Blade email templates
│       └── filament/           # Filament Blade overrides
├── routes/
│   ├── channels.php            # Reverb broadcast channels
│   ├── console.php             # Artisan commands
│   ├── settings.php            # Settings-related routes
│   └── web.php                 # Main web routes
├── scripts/                    # phpstan.sh, pint.sh helper scripts
└── tests/
    ├── Browser/                # Playwright browser tests
    └── Feature/                # Pest feature tests
```

---

## 6. Database & Models

### Migration order and key tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with 2FA, passkey, team support |
| `teams` | Multi-team workspace |
| `memberships` | Pivot: users ↔ teams |
| `team_settings` | Per-team configuration |
| `settings` | Global key/value site settings |
| `services` | Service catalogue |
| `brands` | Car brand catalogue |
| `brand_service` | Pivot: brands ↔ services |
| `faqs` | FAQ entries |
| `leads` | Contact/lead form submissions |
| `testimonials` | Customer testimonials |
| `gallery_items` | Media gallery (premium cars etc.) |
| `schedules` | Team working schedules |
| `schedule_periods` | Available time slots within a schedule |
| `appointments` | Customer bookings |
| `invoices` | Invoice records |
| `invoice_items` | Line items on invoices |
| `payments` | Payment records |
| `page_views` | Analytics tracking (no `timestamps`) |
| `activity_log` | Audit trail (via Spatie) |
| `notifications` | DB notifications |
| `media` | Spatie Media Library |
| `permissions` / `roles` | Spatie RBAC |

### Key Models

#### `User`
- Implements `FilamentUser`, `MustVerifyEmail`, `PasskeyUser`
- Traits: `HasTeams`, `HasRoles`, `SoftDeletes`, `TwoFactorAuthenticatable`, `PasskeyAuthenticatable`
- Has enum `Role` column: `Admin`, `Manager`, `Member`
- `canAccessPanel(Panel $panel)` — allows admin/manager to access Filament

#### `Setting`
- Key/value store. All values are strings.
- Shared globally via Inertia as `settings` in `HandleInertiaRequests`
- See [Site Settings System](#11-site-settings-system) for all keys

#### `Appointment`
- Status enum (pending, confirmed, cancelled, completed, rescheduled)
- Has `AppointmentPolicy` for authorization (cancel, reschedule)
- Linked to `User`, `Service`, `Team`

#### `PageView`
- Analytics record — `$timestamps = false`
- Scopes: `scopeToday()`, `scopeLastDays(int $days)`, `scopeHumans()` (excludes bots)

### Soft Deletes

Enabled on: `User`, `Lead`, `Team`

### Cache busting

Model observers in `AppServiceProvider` clear relevant cache tags automatically:
- `Service` saves → busts `featured_services`, `all`, `slugged`, `related`, `sitemap`
- `Brand` saves → busts `featured_brands`, `all`
- `Testimonial` saves → busts `home.testimonials`
- `Faq` saves → busts `faqs.grouped`

---

## 7. Authentication & Authorization

### Authentication methods

1. **Email + Password** — standard Fortify auth
2. **Passkeys** — via `@laravel/passkeys` (WebAuthn)
3. **Two-Factor Authentication** — TOTP via Fortify

All routes under `auth` middleware require email verification (`verified` middleware on booking/dashboard routes).

### Roles & Permissions (Spatie)

Two layers:

**Laravel `Role` enum** (column on `users` table):
```php
Role::Admin    // 'admin'
Role::Manager  // 'manager'
Role::Member   // 'member'
```

**Spatie roles** (assigned via `model_has_roles` table):
```
admin     → full admin panel access
manager   → admin panel access, limited scope
member    → frontend only
```

**Key checks:**
```php
$user->hasRole('admin');
$user->role === Role::Admin;      // enum check
$user->role->canAccessAdminPanel(); // Admin or Manager
```

**Policies registered in `AuthServiceProvider`:**
- `AppointmentPolicy` — users can only cancel/reschedule their own future appointments
- `InvoicePolicy` — clients see only their own invoices
- `TeamPolicy` — team owner permissions
- `UserPolicy` — profile management

---

## 8. Routing

All routes are in `routes/web.php` and `routes/settings.php`.

### Public routes (no auth)

| Method | URI | Name | Controller |
|--------|-----|------|------------|
| GET | `/` | `home` | `PublicController@home` |
| GET | `/services` | `services.index` | `PublicController@services` |
| GET | `/services/{service:slug}` | `services.show` | `PublicController@serviceShow` |
| GET | `/brands` | `brands.index` | `PublicController@brands` |
| GET | `/gallery` | `gallery.index` | `GalleryController@index` |
| GET | `/faq` | `faq` | `PublicController@faq` |
| GET | `/privacy-policy` | `privacy-policy` | `PublicController@privacyPolicy` |
| GET | `/terms-of-service` | `terms-of-service` | `PublicController@termsOfService` |
| POST | `/leads` | `leads.store` | `LeadController@store` (throttle: 3/min) |
| GET | `/invoices/{uuid}` | `invoices.show` | `InvoiceController@show` (throttle: 30/min) |
| GET | `/sitemap.xml` | `sitemap` | `SitemapController@index` |
| GET | `/robots.txt` | `robots` | `SitemapController@robots` |

### Authenticated routes (require `auth` + `verified`)

| Method | URI | Name | Notes |
|--------|-----|------|-------|
| GET | `/appointments` | `appointments.index` | throttle: 60/min |
| POST | `/appointments` | `appointments.store` | throttle: 5/min |
| GET | `/appointments/slots` | `appointments.slots` | Available slots query |
| GET | `/appointments/availability` | `appointments.availability` | Calendar availability |
| GET | `/appointments/{appointment}` | `appointments.show` | |
| DELETE | `/appointments/{appointment}` | `appointments.cancel` | Policy: own + future + >2h |
| GET | `/appointments/{appointment}/reschedule` | `appointments.reschedule` | |
| POST | `/appointments/{appointment}/reschedule` | `appointments.reschedule.process` | |
| GET | `/appointments/{appointment}/calendar` | `appointments.calendar` | `.ics` download |
| GET | `/{current_team}/dashboard` | `dashboard` | Team-scoped |
| GET | `/dashboard/invoices` | `dashboard.invoices.index` | |
| GET | `/dashboard/invoices/{invoice}` | `dashboard.invoices.show` | |

### Admin panel

All admin routes are prefixed `/admin` and handled by Filament. Access requires `canAccessPanel()` returning true (Admin or Manager role).

### Route helpers (Wayfinder)

Never hardcode URLs. Use generated typed helpers:

```typescript
// From resources/js/routes/ or resources/js/actions/
import { home, appointments } from '@/routes';
import { AppointmentController } from '@/actions/AppointmentController';

<Link href={appointments()}>Book</Link>
<Link href={AppointmentController.show(appointment.id)}>View</Link>
```

Regenerate after adding routes:
```bash
php artisan wayfinder:generate
```

---

## 9. Frontend Architecture

### Inertia v3 (no SSR)

Pages are React components in `resources/js/pages/`. SSR is **disabled** (prevented hydration mismatches with GSAP/animations).

```typescript
// Server renders via Inertia::render()
return Inertia::render('home', [
    'featuredServices' => Inertia::defer(fn() => Service::featured()->get()),
]);
```

### Layouts

| Layout | Used by |
|--------|---------|
| `PublicLayout` | All public marketing pages |
| `AppLayout` | Authenticated dashboard pages |
| `AuthLayout` | Login, register, etc. |
| `SettingsLayout` | Profile/security settings |

### Shared props (available on every page)

Shared via `HandleInertiaRequests::share()`:

```typescript
const { auth, settings, brands, services, flash, currentTeam, teams } = usePage().props;
```

- `auth.user` — authenticated user (null if guest)
- `settings` — all key/value settings from DB (see [Settings System](#11-site-settings-system))
- `brands` — all active brands (for nav dropdowns)
- `services` — all active services (for nav dropdowns)
- `flash.success / flash.error` — session flash messages
- `currentTeam` — user's active team context

### Deferred props

Expensive data is deferred and arrives after initial render:

```typescript
// In page component — stats arrives as undefined initially
export default function Dashboard({ stats }: { stats?: StatsType }) {
    return <div>{stats?.totalSpent ?? 0}</div>;  // always use optional chaining
}
```

### Component conventions

- **UI primitives** (`resources/js/components/ui/`) — Radix UI wrappers, one component per file
- **Brand/marketing** (`resources/js/components/brand/`) — hero, service card, lead form, etc.
- **App shell** (`resources/js/components/app-*.tsx`) — sidebar, header, navigation

### Styling

Tailwind CSS v4 — no `tailwind.config.js` needed. Custom theme tokens defined in `resources/css/app.css`:
- `--color-racing-red` — brand red (`#ef4444`)
- `--color-luxury-black` / `--color-luxury-charcoal` — dark backgrounds
- Custom utility: `.skewed-btn`, `.text-glow`, `.bg-grid-pattern`

### TypeScript

Strict mode enabled. All page props must be typed:

```typescript
interface HomeProps {
    featuredServices: Service[];
    featuredBrands?: Brand[];   // ? for deferred props
}
```

Types live in `resources/js/types/`. Run `npm run types:check` to validate.

---

## 10. Admin Panel (Filament)

Admin panel at `/admin`. Requires `Role::Admin` or `Role::Manager`.

### Resources

| Resource | Model | Key Features |
|----------|-------|-------------|
| `AppointmentResource` | `Appointment` | List/view/edit bookings, status management |
| `BrandResource` | `Brand` | Car brands with logo upload |
| `FaqResource` | `Faq` | FAQ with categories and sort order |
| `GalleryItemResource` | `GalleryItem` | Media gallery management |
| `InvoiceResource` | `Invoice` | Invoice CRUD, PDF download, email send |
| `LeadResource` | `Lead` | CRM lead management, status tracking |
| `ServiceResource` | `Service` | Service catalogue with pricing |
| `TestimonialResource` | `Testimonial` | Customer reviews with rating |
| `UserResource` | `User` | User management with role assignment |

### Custom Pages

| Page | URL | Purpose |
|------|-----|---------|
| `ManageSettings` | `/admin/settings` | Site-wide settings (general, SEO, legal, hero, etc.) |
| `ManageEmailSettings` | `/admin/email-settings` | Email template configuration |
| `ManageInvoiceSettings` | `/admin/invoice-settings` | Invoice defaults, tax, numbering |
| `Analytics` | `/admin/analytics` | Visitor analytics dashboard |

### Widgets

**Dashboard widgets:**
- `AppointmentStats` — today's/upcoming appointment counts
- `LeadStats` — lead conversion metrics
- `LeadsChart` — lead volume over time
- `LeadsOverview` — pipeline overview
- `LatestLeads` / `RecentLeadsTable` — recent lead activity
- `LeadSourceChart` — lead sources breakdown

**Analytics page widgets:**
- `AnalyticsStatsWidget` — page views, unique visitors, bounce rate, response time
- `VisitorTrendChart` — line chart (7/30/90 day period filter)
- `DeviceBreakdownChart` — desktop/mobile/tablet/bot doughnut
- `TrafficSourcesChart` — direct/search/social/UTM/referral pie
- `TopPagesWidget` — top 15 pages by views
- `RecentVisitorsWidget` — last 50 page views

### Adding a new Filament resource

```bash
php artisan make:filament-resource ModelName --generate --no-interaction
```

Follow existing resource structure: separate `Schema/`, `Table/`, and `Pages/` directories within the resource folder.

---

## 11. Site Settings System

All site-wide content is stored in the `settings` table as key/value pairs and managed via `Admin → Settings`.

### How it works

1. Admin saves settings in Filament `ManageSettings` page
2. `Setting::updateOrCreate(['key' => $key], ['value' => $value])` persists them
3. `HandleInertiaRequests` shares `Setting::all()->pluck('value', 'key')` as `settings` on every Inertia page
4. Frontend reads via `usePage().props.settings?.key_name`

### All available settings keys

**General**
```
site_name           contact_phone        site_address
support_email       opening_hours        footer_text
```

**SEO**
```
seo_title           seo_description      seo_keywords
seo_robots          google_analytics_id  facebook_pixel_id
```

**Social links**
```
social_facebook     social_instagram     social_twitter
social_youtube      social_tiktok
```

**GDPR / Compliance**
```
cookie_consent_enabled    cookie_consent_message
privacy_policy_url        terms_of_service_url
privacy_policy_content    terms_of_service_content
```

**WhatsApp**
```
whatsapp_enabled    whatsapp_number    whatsapp_message
```

**Hero section** (home page top banner)
```
hero_badge               hero_title            hero_subtitle
hero_cta_primary_text    hero_cta_primary_href
hero_cta_secondary_text  hero_image_url
```

**How It Works steps**
```
how_step1_title    how_step1_desc
how_step2_title    how_step2_desc
how_step3_title    how_step3_desc
```

**Mission section**
```
mission_badge         mission_heading       mission_quote
mission_stat1_value   mission_stat1_label
mission_stat2_value   mission_stat2_label
mission_image_url
```

**Section labels**
```
section_services_badge      section_services_heading   section_services_subtext
section_process_badge       section_process_heading
section_testimonials_badge  section_testimonials_heading
section_contact_heading     section_contact_subtext
```

### Adding a new setting

1. Add the field to `ManageSettings.php` inside the appropriate `Section`
2. Add the key with a default value to `SiteSettingsSeeder.php`
3. Read in the frontend: `settings?.your_new_key || 'fallback'`
4. No migration needed — the `settings` table is a generic key/value store

---

## 12. Analytics & Tracking

### Page view tracking

`TrackPageView` middleware runs on every web request **after** the response is sent (terminable middleware). It records:

- `url`, `path`, `method` — request info
- `ip`, `session_id`, `user_id` — visitor identity
- `device_type` — desktop / mobile / tablet / bot
- `browser` — Edge / Opera / Chrome / Firefox / Safari / IE
- `os` — Windows / macOS / iOS / Android / Linux
- `referrer`, `referrer_domain` — traffic source
- `utm_source`, `utm_medium`, `utm_campaign` — UTM parameters
- `response_time_ms` — server response time
- `visited_at` — timestamp (no `created_at`/`updated_at`)

**Skipped automatically:**
- Non-GET requests
- Admin, Pulse, Horizon, Filament, Livewire, Debugbar paths
- Requests for static files (`.js`, `.css`, `.png`, etc.)
- 5xx responses

### PageView model scopes

```php
PageView::humans()          // excludes bots and null device_type
PageView::today()           // visited today
PageView::lastDays(30)      // last N days
```

### Analytics admin page

`/admin/analytics` — available to Admin and Manager roles. Shows 6 widgets with real-time data polling.

---

## 13. Email & Notifications

### Email drivers

- **Local dev:** Mailpit on `http://localhost:8025`
- **Production:** Configure `MAIL_MAILER`, `MAIL_HOST`, etc. in `.env`

### Sent emails

| Trigger | Notification / Listener |
|---------|------------------------|
| User registers | `WelcomeEmail` (via `Registered` event) |
| Appointment confirmed | `AppointmentConfirmed` notification |
| Appointment cancelled | `AppointmentCancelled` notification |
| Appointment rescheduled | `AppointmentRescheduled` notification |
| Invoice created/paid | `SendInvoiceNotification` subscriber |
| Invoice email action (admin) | `InvoiceService` dispatches mail |

### Email templates

Blade templates in `resources/views/emails/`. Settings for sender name/address are in `Admin → Email Settings`.

### Database notifications

Stored in `notifications` table. Users see them in the dashboard notification bell.

---

## 14. Invoice & PDF System

### Invoice flow

1. Admin creates invoice in Filament (`InvoiceResource`)
2. Line items added (`InvoiceItem` model with `Brick\Money` for currency math)
3. PDF generated on demand via `InvoicePdfGenerator` service (DomPDF)
4. Admin can email invoice to client via table action
5. Client accesses invoice at `/invoices/{uuid}` (public, throttled)

### PDF generation

```php
// In controller or service
$pdf = app(InvoicePdfGenerator::class)->generate($invoice);
return $pdf->download("invoice-{$invoice->number}.pdf");
```

Template: `resources/views/pdf/invoice.blade.php`

### Activity logging

`InvoiceObserver` + `LogInvoiceActivity` subscriber record all invoice state changes to the `activity_log` table.

---

## 15. Appointment Booking System

### Booking flow (frontend)

Multi-step wizard in `resources/js/pages/appointments/`:

1. **ServiceStep** — choose service
2. **DateTimeStep** — pick date using `AvailabilityCalendar`
3. **DetailsStep** — vehicle info, notes
4. **ReviewStep** — confirm and submit

### Availability logic

`AppointmentController@slots` and `@availability` query the team's `Schedule` and `SchedulePeriod` models to determine bookable time slots. Booked slots are excluded from the available set.

### Cancellation rules

`AppointmentPolicy@cancel`: user must:
- Own the appointment
- Appointment status must be cancellable
- Start time must be in the future
- Start time must be more than 2 hours away

### Calendar download

`/appointments/{appointment}/calendar` returns an `.ics` file via `CalendarSyncService` (Spatie Calendar Links).

---

## 16. Real-time (Reverb)

Laravel Reverb handles WebSocket connections.

### Starting Reverb

```bash
php artisan reverb:start
```

Or it starts automatically with `composer run dev`.

### Broadcast channels

Defined in `routes/channels.php`. Frontend subscribes via `@laravel/echo-react`:

```typescript
import { useEcho } from '@laravel/echo-react';

useEcho(`appointments.${teamId}`, 'AppointmentBooked', (e) => {
    // handle real-time event
});
```

### Adding a new broadcast event

```bash
php artisan make:event YourEvent --no-interaction
```

Implement `ShouldBroadcast`, define `broadcastOn()` returning a channel.

---

## 17. Caching Strategy

Cache driver: `database` (local) — switch to Redis in production.

### Cache keys (with auto-busting)

| Key | Content | Busted by |
|-----|---------|-----------|
| `featured_services` | Active featured services | Service observer |
| `all` | All active services | Service observer |
| `featured_brands` | Active featured brands | Brand observer |
| `home.testimonials` | Featured testimonials | Testimonial observer |
| `faqs.grouped` | FAQs grouped by category | Faq observer |

### Cache invalidation

Observers in `AppServiceProvider::boot()` bust caches automatically on model save/delete. No manual cache clearing needed for content changes.

### Cache commands

```bash
php artisan cache:clear       # clear all cache
php artisan config:clear      # clear config cache
php artisan view:clear        # clear view cache
php artisan route:clear       # clear route cache
```

---

## 18. Queue & Jobs

Queue driver: `database` locally. Use Redis + Horizon in production.

### Running the queue worker

```bash
php artisan queue:listen      # dev (auto-restart on changes)
php artisan queue:work        # production
```

### Horizon (production)

```bash
php artisan horizon           # start Horizon
```

Dashboard at `/admin` → Horizon link, or `/horizon` directly (Admin role gate).

### Queued work includes

- Email sending (all notifications)
- PDF generation for large invoices
- Activity log writes

---

## 19. Code Quality Toolchain

### Pre-commit hooks (Lefthook)

All hooks run **automatically on `git commit`**:

| Hook | Scope | Action |
|------|-------|--------|
| `eslint` | `resources/js/**/*.{ts,tsx}` | ESLint --fix, then re-stages |
| `prettier` | `resources/**/*.{ts,tsx,css,json,md}` | Prettier --write, then re-stages |
| `pint` | `*.php` | Laravel Pint --dirty |
| `phpstan` | `*.php` | PHPStan level 8 full analysis |

### Manual quality commands

```bash
# PHP
composer run lint           # Pint (fix in parallel)
composer run analyze        # PHPStan (2G memory)
composer run rector         # Rector refactoring
composer run rector:dry     # Rector dry-run (preview only)
composer run quality        # PHPStan + Rector dry + Pint check

# JavaScript
npm run lint                # ESLint --fix
npm run lint:check          # ESLint (no fix, for CI)
npm run format              # Prettier --write
npm run format:check        # Prettier check (for CI)
npm run types:check         # TypeScript type checking
```

### PHPStan

- Level 8 (near-maximum strictness)
- Paths: `app/`, `database/`, `routes/`, `tests/`
- Larastan extensions included for Laravel-aware analysis

### Rector

Configured for Laravel-specific modernization. Run `composer run rector:dry` before applying changes.

---

## 20. Testing

### Running tests

```bash
# All tests
php artisan test --compact

# Filter by name
php artisan test --compact --filter=AppointmentTest

# Specific file
php artisan test --compact tests/Feature/AppointmentPolicyTest.php

# Full CI check (lint + types + test)
composer run ci:check
```

### Test structure

```
tests/
├── Browser/                   # Playwright end-to-end tests
│   └── DashboardNotificationBrowserTest.php
└── Feature/
    ├── AppointmentPolicyTest.php
    ├── ReverbBroadcastNotificationTest.php
    └── ...
```

### Writing tests

Use Pest PHP 4. Feature tests use the database:

```php
it('user can cancel own appointment', function () {
    $user = User::factory()->create();
    $appointment = Appointment::factory()->for($user)->create([
        'start_at' => now()->addHours(5),
        'status' => AppointmentStatus::Confirmed,
    ]);

    $this->actingAs($user)
        ->delete(route('appointments.cancel', $appointment))
        ->assertRedirect();

    expect($appointment->fresh()->status)->toBe(AppointmentStatus::Cancelled);
});
```

**Factory conventions:**
- Use factories for all test model creation
- Check for existing factory states before building custom data manually
- Prefer `::factory()->state()` chains over setting attributes inline

---

## 21. Seeding & Development Data

### Full fresh seed

```bash
php artisan migrate:fresh --seed
```

This runs all migrations and calls `DatabaseSeeder`, which runs:

1. `RolesAndPermissionsSeeder` — Spatie roles and permissions
2. `AdminUserSeeder` — admin user (email: `admin@garage-keypro.com`, password: `Admin@1234!`)
3. `SiteSettingsSeeder` — all 54 site settings with French defaults
4. `EmailTemplateSettingsSeeder` — email template configuration
5. `ServiceSeeder` — 6 services (Programmation Clé, Duplication Clé, etc.)
6. `BrandSeeder` — all car brands from `car-list.json`, 12 featured
7. `FaqSeeder` — FAQs in `general` and `pricing` categories
8. `TestimonialSeeder` — customer testimonials
9. `GalleryItemSeeder` — 6 premium car showcase items + 18 factory items

### Running a single seeder

```bash
php artisan db:seed --class=SiteSettingsSeeder
```

### All seeders are idempotent

Re-running `php artisan db:seed` will not create duplicate records. All seeders use `updateOrCreate` on their natural unique key (slug, question, email, etc.).

### Adding new settings

Add the key to `SiteSettingsSeeder::run()` with its default value. It will be created on next seed and updated if re-seeded.

---

## 22. Deployment

The project is designed for [Laravel Cloud](https://cloud.laravel.com/). Refer to the Boost guidelines in `CLAUDE.md` for Cloud-specific configuration.

### Production checklist

- [ ] Set `APP_ENV=production`, `APP_DEBUG=false`
- [ ] Configure PostgreSQL connection
- [ ] Set `QUEUE_CONNECTION=redis`
- [ ] Set `CACHE_STORE=redis`
- [ ] Set `BROADCAST_CONNECTION=reverb` with production Reverb credentials
- [ ] Configure mail driver (not Mailpit)
- [ ] Set `SENTRY_LARAVEL_DSN`
- [ ] Run `npm run build` (generates `public/build/` manifest)
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan db:seed --force` (idempotent)
- [ ] Run `php artisan config:cache && php artisan route:cache && php artisan view:cache`
- [ ] Start Horizon: `php artisan horizon`
- [ ] Start Reverb: `php artisan reverb:start`

### Build assets

```bash
npm run build          # Production build (output to public/build/)
npm run build:ssr      # SSR build (not used — SSR is disabled)
```

---

## 23. Common Tasks & Recipes

### Add a new public page

1. Create controller method in `PublicController`
2. Add route in `routes/web.php`
3. Create Inertia page in `resources/js/pages/your-page.tsx`
4. Use `PublicLayout` as the layout wrapper
5. Run `php artisan wayfinder:generate` to generate typed route helper

### Add a new admin resource

```bash
php artisan make:filament-resource ModelName --generate --no-interaction
```

Then refactor into the per-resource folder structure: `Resources/ModelName/ModelNameResource.php` with separate `Schemas/`, `Tables/`, `Pages/` directories.

### Add a new model + migration + seeder

```bash
php artisan make:model ModelName -mfs --no-interaction
# -m: migration, -f: factory, -s: seeder
```

Then:
- Add `updateOrCreate` logic in the seeder
- Register the seeder in `DatabaseSeeder`
- Add cache busting observer in `AppServiceProvider` if needed

### Clear everything in development

```bash
php artisan optimize:clear    # config + route + view + cache
php artisan queue:clear       # clear pending queue jobs
```

### Generate Wayfinder routes after adding routes

```bash
php artisan wayfinder:generate
```

### Check what's running in the queue

Open `https://garage-keypro-service.test/horizon` (admin only).

### View real-time application logs

```bash
php artisan pail              # tail logs with pretty formatting
```

### Run Rector on a specific path

```bash
vendor/bin/rector process app/Models/ --dry-run
```

### Check application health

```bash
curl https://garage-keypro-service.test/up
# Or visit /admin (Pulse dashboard shows health checks)
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Fresh DB + seed | `php artisan migrate:fresh --seed` |
| Dev server | `composer run dev` |
| Run tests | `php artisan test --compact` |
| PHP linting | `composer run lint` |
| PHP analysis | `composer run analyze` |
| JS linting | `npm run lint` |
| TS type check | `npm run types:check` |
| Build assets | `npm run build` |
| Seed settings | `php artisan db:seed --class=SiteSettingsSeeder` |
| Generate routes | `php artisan wayfinder:generate` |
| View logs | `php artisan pail` |
| Clear all cache | `php artisan optimize:clear` |
| Admin URL | `https://garage-keypro-service.test/admin` |
| Admin email | `admin@garage-keypro.com` |
| Admin password | `Admin@1234!` |
