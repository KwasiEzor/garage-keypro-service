<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
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

Route::get('/invoices/{uuid}', [InvoiceController::class, 'show'])->name('invoices.show');

Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
Route::get('/appointments/slots', [AppointmentController::class, 'slots'])->name('appointments.slots');
Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth')->name('appointments.store');

Route::middleware('auth')->group(function (): void {
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments'])->name('appointments.my');
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'cancel'])->name('appointments.cancel');
    Route::get('/appointments/{appointment}/calendar', [AppointmentController::class, 'downloadCalendar'])->name('appointments.calendar');
});

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('/dashboard/invoices', [InvoiceController::class, 'index'])->name('dashboard.invoices.index');
    Route::get('/dashboard/invoices/{invoice}', [InvoiceController::class, 'show'])->name('dashboard.invoices.show');
});

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function (): void {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    });

Route::middleware(['auth'])->group(function (): void {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
