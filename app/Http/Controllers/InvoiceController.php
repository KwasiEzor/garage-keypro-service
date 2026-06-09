<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the user's invoices.
     */
    public function index(Request $request): Response
    {
        $invoices = $request->user()
            ->client_invoices()
            ->with(['team'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Display the specified invoice.
     *
     * @param  string  $identifier  Invoice UUID or ID
     */
    public function show(Request $request, string $identifier): Response
    {
        // Try to find by UUID first (public or auth)
        $invoice = Invoice::where('uuid', $identifier)
            ->with(['team', 'client', 'items.service'])
            ->first();

        // If not found by UUID, try by ID (if numeric and authenticated)
        if (! $invoice && is_numeric($identifier) && $request->user()) {
            $invoice = $request->user()
                ->client_invoices()
                ->with(['team', 'client', 'items.service'])
                ->find($identifier);
        }

        if (! $invoice) {
            abort(404);
        }

        // Check authorization if not public
        if ($request->routeIs('dashboard.invoices.show')) {
            $this->authorize('view', $invoice);
        }

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }
}
