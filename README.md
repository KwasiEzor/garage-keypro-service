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

- **Industrial Luxury Design:** A bespoke design system using `Racing Red`, `Luxury Black`, and `Chrome` accents with skewed UI elements and precision grids.
- **Technical Gallery:** A GSAP-animated portfolio featuring infinite scroll, category filtering, and a cinematic cinematic lightbox.
- **Filament Admin v5:** A comprehensive command center for managing services, brands, leads, and operational archives.
- **Inertia v3 Infinite Scroll:** High-performance data fetching with server-side `Inertia::scroll()` normalization.
- **Elite Lead Generation:** Sophisticated lead capture system with technical specification fields and automatic notifications.
- **Automated Quality:** 100% test coverage for critical paths using Pest PHP.

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

Run the test suite using Pest:

```bash
php artisan test
```

## 📄 License

The Laravel framework is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
