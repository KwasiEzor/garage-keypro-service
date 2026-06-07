<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class)->name('health');

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/services', [PublicController::class, 'services'])->name('services.index');
Route::get('/services/{service:slug}', [PublicController::class, 'serviceShow'])->name('services.show');
Route::get('/brands', [PublicController::class, 'brands'])->name('brands.index');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::inertia('/testimonials-demo', 'testimonials-demo')->name('testimonials-demo');
Route::get('/faq', [PublicController::class, 'faq'])->name('faq');
Route::get('/privacy-policy', [PublicController::class, 'privacyPolicy'])->name('privacy-policy');
Route::get('/terms-of-service', [PublicController::class, 'termsOfService'])->name('terms-of-service');
Route::post('/leads', [LeadController::class, 'store'])
    ->middleware(['throttle:3,1'])
    ->name('leads.store');

Route::get('/invoices/{uuid}', [InvoiceController::class, 'show'])
    ->middleware('throttle:30,1')
    ->name('invoices.show');

Route::middleware('auth')->group(function (): void {
    Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('throttle:60,1')->name('appointments.index');
    Route::get('/appointments/slots', [AppointmentController::class, 'slots'])->name('appointments.slots');
    Route::get('/appointments/availability', [AppointmentController::class, 'availability'])->name('appointments.availability');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments'])->name('appointments.my');
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])->name('appointments.cancel');
    Route::get('/appointments/{appointment}/reschedule', [AppointmentController::class, 'reschedule'])->name('appointments.reschedule');
    Route::post('/appointments/{appointment}/reschedule', [AppointmentController::class, 'processReschedule'])->name('appointments.reschedule.process');
    Route::get('/appointments/{appointment}/calendar', [AppointmentController::class, 'downloadCalendar'])->name('appointments.calendar');
});

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();

        if (! $user instanceof User) {
            return redirect()->route('login');
        }

        $team = $user->currentTeam;

        if (! $team) {
            $team = $user->personalTeam() ?: $user->teams()->first();

            if ($team) {
                $user->switchTeam($team);
            }
        }

        if ($team instanceof Team) {
            return redirect()->route('dashboard', ['current_team' => $team->slug]);
        }

        return redirect()->route('home');
    })->name('dashboard.root');

    Route::get('/dashboard/invoices', [InvoiceController::class, 'index'])->name('dashboard.invoices.index');
    Route::get('/dashboard/invoices/{invoice}', [InvoiceController::class, 'show'])->name('dashboard.invoices.show');
});

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function (): void {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

Route::middleware(['auth'])->group(function (): void {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
