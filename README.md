# GarageKeyPro - Elite Automotive Engineering

GarageKeyPro is a high-end service platform for elite automotive diagnostics, advanced key programming, and precision engineering. Built with an "Industrial Luxury" aesthetic, it combines cutting-edge security protocols with a seamless, high-performance user experience.

![GarageKeyPro Banner](public/images/og-image.png)

## 🛠 Tech Stack

- **Framework:** [Laravel 13](https://laravel.com)
- **Frontend:** [Inertia.js v3](https://inertiajs.com) with [React 19](https://react.dev)
- **Admin Panel:** [Filament v5](https://filamentphp.com)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Animations:** [GSAP](https://gsap.com) (GreenSock Animation Platform)
- **Testing:** [Pest PHP v4](https://pestphp.com)
- **Route Generation:** [Laravel Wayfinder](https://github.com/KwasiEzor/wayfinder)

## ✨ Features

### Design & UX
- **Industrial Luxury Design:** A bespoke design system using `Racing Red`, `Luxury Black`, and `Chrome` accents with skewed UI elements and precision grids.
- **Technical Gallery:** A GSAP-animated portfolio featuring infinite scroll, category filtering, and a cinematic lightbox.
- **Inertia v3 Infinite Scroll:** High-performance data fetching with server-side `Inertia::scroll()` normalization.

### Security & Authorization
- **Role-Based Access Control (RBAC):** Admin, Manager, and Member roles with policy-based authorization
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Rate Limiting:** Login (5/min), 2FA (5/min), Password Reset (3/min), Passkeys (10/min)
- **Audit Logging:** Activity log for sensitive operations (role changes, invoices, team membership)
- **Form Request Validation:** Centralized validation with authorization checks

### Admin & Management
- **Filament Admin v5:** A comprehensive command center for managing services, brands, leads, and operational archives.
- **Elite Lead Generation:** Sophisticated lead capture system with technical specification fields and automatic notifications.
- **Queue Jobs:** Background processing for emails and image optimization

### Performance
- **Database Indexes:** Optimized queries on frequently filtered columns
- **Cache Warming:** Pre-cache services, brands, and settings with `php artisan cache:warm`
- **Queue Workers:** Async processing for heavy tasks

### Quality Assurance
- **114 Tests:** Feature, unit, architecture, and smoke tests
- **Architecture Tests:** Enforce code quality rules and security patterns
- **Smoke Tests:** Verify all public routes load correctly
- **100% Coverage:** Critical paths fully tested with Pest PHP

## 🚀 Getting Started

### Prerequisites

- PHP 8.4+
- Node.js 20+
- Composer
- A database (SQLite, MySQL, or PostgreSQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KwasiEzor/garage-keypro-service.git
   cd garage-keypro-service
   ```

2. **Install dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Configuration:**
   Create your database and run migrations & seeders:
   ```bash
   php artisan migrate --seed
   ```

5. **Storage Link:**
   ```bash
   php artisan storage:link
   ```

6. **Development:**
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the full test suite (114 tests):

```bash
php artisan test
```

Run specific test suites:

```bash
# Feature tests (business logic)
php artisan test --testsuite=Feature

# Architecture tests (code quality)
php artisan test --testsuite=Architecture

# Unit tests
php artisan test --testsuite=Unit
```

Run tests with coverage:

```bash
php artisan test --coverage
```

## 🔒 Security

### User Roles

- **Admin:** Full access to all resources and users
- **Manager:** Can access admin panel and manage team resources
- **Member:** Standard user access, team member

### Rate Limiting

All authentication endpoints are rate-limited:
- Login: 5 attempts per minute
- Password Reset: 3 attempts per minute
- 2FA: 5 attempts per minute
- Passkeys: 10 attempts per minute

### Audit Logging

Sensitive operations are logged to the `activity_log` table:
- User role changes
- Invoice creation/updates
- Team membership changes

## 📦 Queue Jobs

Run queue workers for background processing:

```bash
php artisan queue:work
```

Available jobs:
- `SendInvoiceEmail` - Send invoice emails asynchronously
- `ProcessGalleryImage` - Optimize and process gallery images

## 🎯 Artisan Commands

```bash
# Warm application cache
php artisan cache:warm

# Create admin user
php artisan db:seed --class=AdminUserSeeder
```

## 📄 License

The Laravel framework is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
