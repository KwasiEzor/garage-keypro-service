<?php

declare(strict_types=1);

namespace App\Providers;

use App\Listeners\LogInvoiceActivity;
use App\Listeners\SendInvoiceNotification;
use App\Models\Brand;
use App\Models\Faq;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use App\Observers\InvoiceItemObserver;
use App\Observers\InvoiceObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\EnvironmentCheck;
use Spatie\Health\Checks\Checks\OptimizedAppCheck;
use Spatie\Health\Facades\Health;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[\Override]
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureCommands();
        $this->configureDefaults();
        $this->configureMonitoring();
        $this->registerObservers();
        $this->registerEventListeners();
    }

    /**
     * Register model observers.
     */
    protected function registerObservers(): void
    {
        Invoice::observe(InvoiceObserver::class);
        InvoiceItem::observe(InvoiceItemObserver::class);

        $bustServiceCache = static function (Service $service): void {
            Cache::forget('home.featured_services');
            Cache::forget('services.all');
            Cache::forget("service.{$service->slug}");
            Cache::forget("service.{$service->slug}.related");
            Cache::forget('sitemap.xml');
        };
        Service::saved($bustServiceCache);
        Service::deleted($bustServiceCache);

        $bustBrandCache = static function (): void {
            Cache::forget('home.featured_brands');
            Cache::forget('brands.all');
        };
        Brand::saved($bustBrandCache);
        Brand::deleted($bustBrandCache);

        $bustTestimonialCache = static function (): void {
            Cache::forget('home.testimonials');
        };
        Testimonial::saved($bustTestimonialCache);
        Testimonial::deleted($bustTestimonialCache);

        $bustFaqCache = static function (): void {
            Cache::forget('faqs.grouped');
        };
        Faq::saved($bustFaqCache);
        Faq::deleted($bustFaqCache);
    }

    /**
     * Register event listeners and subscribers.
     */
    protected function registerEventListeners(): void
    {
        Event::subscribe(LogInvoiceActivity::class);
        Event::subscribe(SendInvoiceNotification::class);
    }

    /**
     * Configure database commands.
     */
    protected function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(app()->isProduction());
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null,
        );
    }

    /**
     * Configure monitoring for Pulse and Health.
     */
    protected function configureMonitoring(): void
    {
        Gate::define('viewPulse', fn (User $user) => $user->isAdmin());
        Gate::define('viewHorizon', fn (User $user) => $user->isAdmin());

        Health::checks([
            OptimizedAppCheck::new(),
            DebugModeCheck::new(),
            EnvironmentCheck::new(),
            DatabaseCheck::new(),
            CacheCheck::new(),
        ]);
    }
}
