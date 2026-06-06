# GarageKeyPro Service - Production Deployment Guide

**Last Updated:** 2026-06-06
**Laravel Version:** 13
**PHP Version:** 8.4
**Node Version:** 20+

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Application Deployment](#application-deployment)
5. [Queue Worker Configuration](#queue-worker-configuration)
6. [Scheduler Configuration](#scheduler-configuration)
7. [Web Server Configuration](#web-server-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring & Logging](#monitoring--logging)
10. [Rollback Procedure](#rollback-procedure)

---

## Prerequisites

### Required Services
- **Web Server:** Nginx 1.24+ or Apache 2.4+
- **PHP:** 8.4 with extensions: `bcmath`, `ctype`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`
- **Database:** PostgreSQL 15+ or MySQL 8.0+
- **Queue:** Redis 7.0+ (for queues and cache)
- **Node.js:** 20+ (for asset compilation)
- **Process Manager:** Supervisor 4.0+

### Optional Services
- **Monitoring:** Laravel Pulse (included)
- **Queue Dashboard:** Laravel Horizon (included)
- **Error Tracking:** Sentry, Bugsnag, or Flare

---

## Environment Setup

### 1. Clone Repository

```bash
cd /var/www
git clone git@github.com:KwasiEzor/garage-keypro-service.git
cd garage-keypro-service
```

### 2. Install Dependencies

```bash
# PHP dependencies
composer install --no-dev --optimize-autoloader

# Node dependencies
npm ci --production

# Build frontend assets
npm run build
```

### 3. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Edit `.env` File

```bash
# Application
APP_NAME="GarageKeyPro Service"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://garagekeypro.com
APP_TIMEZONE="Europe/Paris"
APP_LOCALE=fr

# Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=garagekeypro_prod
DB_USERNAME=garagekeypro_user
DB_PASSWORD=your_secure_password_here

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=your_redis_password
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@garagekeypro.com"
MAIL_FROM_NAME="${APP_NAME}"

# Zap Calendar API (REQUIRED)
ZAP_API_KEY=your_zap_api_key_here
ZAP_API_URL=https://api.zap.com

# Session & Security
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=garagekeypro.com

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_SLACK_WEBHOOK_URL=your_slack_webhook_for_errors

# Horizon
HORIZON_ENABLED=true

# Pulse
PULSE_ENABLED=true
```

---

## Database Setup

### 1. Create Database

```bash
# PostgreSQL
sudo -u postgres psql
CREATE DATABASE garagekeypro_prod;
CREATE USER garagekeypro_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE garagekeypro_prod TO garagekeypro_user;
\q
```

### 2. Run Migrations

```bash
php artisan migrate --force
```

### 3. Seed Default Data (Optional)

```bash
php artisan db:seed --force --class=TeamScheduleSeeder
```

---

## Application Deployment

### 1. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/garage-keypro-service
sudo chmod -R 755 /var/www/garage-keypro-service
sudo chmod -R 775 /var/www/garage-keypro-service/storage
sudo chmod -R 775 /var/www/garage-keypro-service/bootstrap/cache
```

### 2. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan optimize
```

### 3. Link Storage

```bash
php artisan storage:link
```

---

## Queue Worker Configuration

### 1. Install Supervisor

```bash
sudo apt-get install supervisor
```

### 2. Create Supervisor Config

**File:** `/etc/supervisor/conf.d/garagekeypro-worker.conf`

```ini
[program:garagekeypro-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/garage-keypro-service/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600 --timeout=300
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/garage-keypro-service/storage/logs/worker.log
stopwaitsecs=3600
```

### 3. Start Workers

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start garagekeypro-worker:*
```

### 4. Verify Workers Running

```bash
sudo supervisorctl status
```

---

## Scheduler Configuration

### 1. Add Cron Entry

```bash
crontab -e
```

Add:

```cron
* * * * * cd /var/www/garage-keypro-service && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Verify Scheduler

```bash
php artisan schedule:list
```

Expected tasks:
- `horizon:snapshot` (every 5 minutes)
- `pulse:check` (every minute)
- `queue:prune-batches` (daily)

---

## Web Server Configuration

### Nginx Configuration

**File:** `/etc/nginx/sites-available/garagekeypro.com`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name garagekeypro.com www.garagekeypro.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name garagekeypro.com www.garagekeypro.com;

    root /var/www/garage-keypro-service/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/garagekeypro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/garagekeypro.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/garagekeypro.access.log;
    error_log /var/log/nginx/garagekeypro.error.log;

    # Client Upload Limit
    client_max_body_size 20M;

    # Laravel Routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Deny .htaccess
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Static Asset Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/garagekeypro.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Post-Deployment Verification

### 1. Health Check

```bash
curl https://garagekeypro.com/health
# Expected: {"status":"healthy","services":{"database":"up","redis":"up","queue":"up"}}
```

### 2. Test Queue

```bash
php artisan tinker
>>> dispatch(new \App\Jobs\SyncAppointmentToCalendar($appointment));
>>> exit
```

Check queue dashboard:

```bash
open https://garagekeypro.com/admin/horizon
```

### 3. Test Appointment Booking

1. Navigate to `https://garagekeypro.com/appointments`
2. Select service and team
3. Choose date and time
4. Complete booking
5. Verify email sent
6. Check Zap calendar sync

### 4. Check Logs

```bash
tail -f storage/logs/laravel.log
```

---

## Monitoring & Logging

### 1. Laravel Pulse

Access at: `https://garagekeypro.com/admin/pulse`

Monitors:
- Request rates
- Slow queries
- Queue jobs
- Cache performance
- Exceptions

### 2. Laravel Horizon

Access at: `https://garagekeypro.com/admin/horizon`

Features:
- Queue throughput
- Job failures
- Worker load
- Failed jobs retry

### 3. Application Logs

```bash
# Real-time logs
php artisan pail

# Or traditional tail
tail -f storage/logs/laravel.log
```

---

## Rollback Procedure

### Quick Rollback

```bash
# 1. Stop queue workers
sudo supervisorctl stop garagekeypro-worker:*

# 2. Checkout previous release
git checkout <previous-commit-hash>

# 3. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci --production
npm run build

# 4. Migrate down if needed
php artisan migrate:rollback --step=1 --force

# 5. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 6. Restart workers
sudo supervisorctl start garagekeypro-worker:*

# 7. Verify
curl https://garagekeypro.com/health
```

---

## Common Issues

### Issue: Queue jobs not processing

**Solution:**
```bash
# Check supervisor status
sudo supervisorctl status

# Restart workers
sudo supervisorctl restart garagekeypro-worker:*

# Check queue connection
php artisan queue:monitor redis
```

### Issue: Zap calendar sync failing

**Solution:**
```bash
# Verify Zap API key
php artisan tinker
>>> config('services.zap.api_key')

# Test Zap connection
>>> \Zap\Facades\Zap::for($team)->ping()
```

### Issue: High memory usage

**Solution:**
```bash
# Check Horizon processes
php artisan horizon:status

# Reduce worker processes in supervisor config
# Restart Horizon
php artisan horizon:terminate
```

---

## Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] Strong `APP_KEY` generated
- [ ] Database credentials secured
- [ ] Redis password set
- [ ] SSL/TLS enabled
- [ ] Security headers configured
- [ ] File permissions correct (755/775)
- [ ] `.env` not committed to git
- [ ] CORS properly configured
- [ ] Rate limiting enabled on public routes
- [ ] Backup strategy in place

---

## Support

**Documentation:** https://github.com/KwasiEzor/garage-keypro-service/wiki
**Issues:** https://github.com/KwasiEzor/garage-keypro-service/issues
**Email:** support@garagekeypro.com
