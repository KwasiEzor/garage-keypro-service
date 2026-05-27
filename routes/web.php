<?php

use App\Http\Controllers\LeadController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/services', [PublicController::class, 'services'])->name('services.index');
Route::get('/services/{service:slug}', [PublicController::class, 'serviceShow'])->name('services.show');
Route::get('/brands', [PublicController::class, 'brands'])->name('brands.index');
Route::get('/faq', [PublicController::class, 'faq'])->name('faq');
Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
