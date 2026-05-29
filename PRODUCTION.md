# Production Deployment Guide

## Overview
This document outlines the steps and configuration required to deploy the application to a production environment (e.g., Laravel Cloud, Laravel Forge, or manual server).

## 1. Environment Configuration (.env)

Ensure the following variables are set correctly for production:

### Application
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://your-production-domain.com`
- `APP_KEY=base64:YOUR_GENERTED_KEY`

### Database (PostgreSQL Recommended)
- `DB_CONNECTION=pgsql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=5432`
- `DB_DATABASE=your_db`
- `DB_USERNAME=your_user`
- `DB_PASSWORD=your_password`

### Cache & Session (Redis Recommended)
- `CACHE_STORE=redis`
- `SESSION_DRIVER=redis`
- `QUEUE_CONNECTION=redis`
- `REDIS_HOST=127.0.0.1`
- `REDIS_PASSWORD=null`
- `REDIS_PORT=6379`

### Authentication (Fortify)
- Ensure `FORTIFY_DOMAIN` and `FORTIFY_PREFIX` are set if necessary.
- Passkeys require HTTPS in production.

## 2. Deployment Steps

1. **Install Dependencies:**
   ```bash
   composer install --no-interaction --prefer-dist --optimize-autoloader
   npm install
   npm run build
   ```

2. **Run Migrations:**
   ```bash
   php artisan migrate --force
   ```

3. **Optimization:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan filament:cache-components
   ```

4. **Queue Worker:**
   Ensure a process monitor (like Supervisor) is running the queue worker:
   ```bash
   php artisan queue:work --tries=3 --timeout=90
   ```

## 3. Post-Deployment Verification
- Run `php artisan about` to check environment status.
- Verify the Filament admin panel at `/admin`.
- Test the Lead capture form on the home page.
- Verify that 2FA and Passkey flows work over HTTPS.

## 4. Maintenance
- Regularly update dependencies: `composer update`.
- Monitor logs via `storage/logs/laravel.log` or a service like Sentry.
