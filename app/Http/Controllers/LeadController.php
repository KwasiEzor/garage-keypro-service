<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use App\Models\User;
use App\Notifications\NewLeadNotification;
use Illuminate\Http\RedirectResponse;

class LeadController extends Controller
{
    /**
     * Store a new lead submission from the website contact form.
     *
     * @return RedirectResponse
     */
    public function store(StoreLeadRequest $request)
    {
        $lead = Lead::create([
            ...$request->validated(),
            'status' => 'new',
            'source' => 'website',
        ]);

        User::first()?->notify(new NewLeadNotification($lead));

        return back()->with('success', 'Merci! Nous vous contacterons sous peu.');
    }
}
