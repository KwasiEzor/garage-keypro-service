<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use App\Notifications\NewLeadNotification;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'vehicle_make' => 'nullable|string|max:100',
            'vehicle_model' => 'nullable|string|max:100',
            'vehicle_year' => 'nullable|digits:4|integer|min:1900|max:'.(date('Y') + 1),
            'service_id' => 'nullable|exists:services,id',
            'message' => 'nullable|string|max:2000',
            'utm_source' => 'nullable|string|max:100',
            'utm_medium' => 'nullable|string|max:100',
            'utm_campaign' => 'nullable|string|max:100',
        ]);

        $lead = Lead::create([
            ...$validated,
            'status' => 'new',
            'source' => 'website',
        ]);

        User::first()?->notify(new NewLeadNotification($lead));

        return back()->with('success', 'Merci! Nous vous contacterons sous peu.');
    }
}
