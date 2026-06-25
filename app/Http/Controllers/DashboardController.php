<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use function now;

class DashboardController extends Controller
{
    /**
     * Display the customer dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return redirect()->route('login');
        }

        $upcomingAppointments = $user->appointments()
            ->with(['team', 'service'])
            ->where('start_at', '>=', now())
            ->where('status', AppointmentStatus::Confirmed)
            ->orderBy('start_at', 'asc')
            ->take(3)
            ->get();

        $recentInvoices = $user->client_invoices()
            ->with(['team'])
            ->latest()
            ->take(5)
            ->get();

        $notifications = $user->unreadNotifications->take(10);

        return Inertia::render('dashboard', [
            'upcomingAppointments' => $upcomingAppointments,
            'recentInvoices' => $recentInvoices,
            'notifications' => $notifications,
            'vehicles' => Inertia::defer(fn () => $user->appointments()
                ->select('vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_license_plate')
                ->whereNotNull('vehicle_make')
                ->orderBy('vehicle_make')
                ->groupBy('vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_license_plate')
                ->get()),
            'stats' => Inertia::defer(fn () => [
                'totalAppointments' => $user->appointments()->count(),
                'pendingInvoices' => $user->client_invoices()->where('status', 'pending')->count(),
                'totalSpent' => (float) $user->client_invoices()->where('status', 'paid')->sum('total_amount'),
            ]),
        ]);
    }
}
