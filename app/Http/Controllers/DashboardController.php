<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotificationCollection;
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

        // Fetch upcoming appointments (next 3)
        $upcomingAppointments = $user->appointments()
            ->with(['team', 'service'])
            ->where('start_at', '>=', now())
            ->where('status', 'confirmed')
            ->orderBy('start_at', 'asc')
            ->take(3)
            ->get();

        // Fetch recent invoices (last 5)
        $recentInvoices = $user->client_invoices()
            ->with(['team'])
            ->latest()
            ->take(5)
            ->get();

        // Fetch unread notifications
        /** @var DatabaseNotificationCollection $notifications */
        $notifications = $user->unreadNotifications;
        $notifications = $notifications->take(10);

        // Aggregate unique vehicles from past appointments
        $vehicles = $user->appointments()
            ->select('vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_license_plate')
            ->whereNotNull('vehicle_make')
            ->groupBy('vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_license_plate')
            ->get();

        return Inertia::render('dashboard', [
            'upcomingAppointments' => $upcomingAppointments,
            'recentInvoices' => $recentInvoices,
            'notifications' => $notifications,
            'vehicles' => $vehicles,
            'stats' => [
                'totalAppointments' => $user->appointments()->count(),
                'pendingInvoices' => $user->client_invoices()->where('status', 'pending')->count(),
                'totalSpent' => (float) $user->client_invoices()->where('status', 'paid')->sum('total_amount'),
            ],
        ]);
    }
}
