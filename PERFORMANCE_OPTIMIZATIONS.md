# Performance Optimizations - June 10, 2026

## Issue

Lighthouse performance score: **28/100** (critical)

- Unused JavaScript: 5,597 KB
- Main thread work: 15.5s
- LCP (Largest Contentful Paint): 14.6s
- Total payload: 7 MB

## Changes Made

### 1. Lazy Load Heavy Components (`resources/js/app.tsx`)

**Before:** All layouts and components loaded eagerly on every page
**After:** Lazy load with React.lazy() and Suspense

- ✅ AppLayout, AuthLayout, SettingsLayout - lazy loaded
- ✅ CustomCursor (+ 68KB GSAP) - lazy loaded conditionally
- ✅ Only loads on pages that need fancy cursor (excludes public booking page)

### 2. Lazy Load Animations (`resources/js/layouts/public-layout.tsx`)

**Before:** BackgroundSpotlight (+ 68KB GSAP) loaded on all public pages
**After:** Wrapped in Suspense, lazy loaded

This removes 68KB GSAP from booking page initial bundle.

### 3. Better Vendor Code Splitting (`vite.config.ts`)

**Before:** Large monolithic vendor chunks
**After:** Granular splitting:

```javascript
- react-vendor: 445KB (React + React DOM)
- inertia: 100KB (Inertia.js)
- radix-ui: Separate chunk for UI primitives
- gsap: 68KB (only loads with animations)
- date-utils: 32KB (date-fns + react-day-picker)
- icons: Separate lucide-react chunk
- ui-utils: 28KB (clsx, tailwind-merge, cva)
```

### 4. Build Optimizations

- ✅ CSS code splitting enabled
- ✅ Source maps disabled for production
- ✅ Chunk size warnings at 600KB

## Results

### Bundle Size Improvements

| Bundle        | Before   | After | Savings        |
| ------------- | -------- | ----- | -------------- |
| **app.js**    | 112KB    | 45KB  | **67KB (60%)** |
| public-layout | 36KB     | 35KB  | 1KB            |
| custom-cursor | N/A      | 4KB   | (deferred)     |
| gsap          | (eager)  | 68KB  | (deferred)     |
| ui-utils      | (in app) | 28KB  | (split)        |

### Impact on Booking Page Load

**Removed from initial load:**

- GSAP: 68KB
- CustomCursor: 4KB
- Unused layouts: ~30KB
- **Total: ~102KB removed** from critical path

### Expected Lighthouse Improvements

- ✅ Reduce unused JavaScript by ~100KB
- ✅ Reduce main thread blocking time
- ✅ Improve Time to Interactive (TTI)
- ✅ Improve First Contentful Paint (FCP)

## How to Test

1. **Build for production:**

    ```bash
    npm run build
    ```

2. **Run Lighthouse again:**
    - Open booking page: https://garage-keypro-service.test/appointments
    - Run Lighthouse in Chrome DevTools
    - Expected score: **50-70+** (up from 28)

3. **Run performance tests:**
    ```bash
    php artisan test --filter=BookingPagePerformanceTest
    ```

## Further Optimizations (Future)

### High Impact

1. **Image Optimization**
    - Convert to WebP/AVIF
    - Add lazy loading with `loading="lazy"`
    - Use responsive images with `srcset`
    - Add blur placeholders

2. **Font Loading**
    - Use `font-display: swap` (already done via Bunny Fonts)
    - Consider font subsetting for French characters only

3. **API Route Optimization**
    - Add HTTP caching headers
    - Enable GZIP/Brotli compression on server
    - Consider Redis caching for getBookableSlots

### Medium Impact

4. **Radix UI Bundle (121KB)**
    - Currently hard to reduce without breaking components
    - Consider alternative lightweight components for public pages
    - Tree-shake unused Radix primitives

5. **Service Worker**
    - Add PWA service worker for asset caching
    - Precache critical CSS/JS

6. **Database Query Optimization**
    - Add indexes for frequently queried fields
    - Use eager loading to prevent N+1 queries
    - Cache service/team lists

## Monitoring

Add performance monitoring:

```bash
# Install Laravel Debugbar (dev only)
composer require barryvdh/laravel-debugbar --dev

# Or use Laravel Pulse for production monitoring
```

## Notes

- All changes are backward compatible
- No breaking changes to UI/UX
- Tests verify booking page still works correctly
- GSAP/animations still work when needed (gallery, etc.)
