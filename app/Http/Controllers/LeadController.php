<?php

namespace App\Http\Controllers;

use App\Actions\CreateLead;
use App\Http\Requests\StoreLeadRequest;
use Illuminate\Http\RedirectResponse;

class LeadController extends Controller
{
    /**
     * Store a new lead submission from the website contact form.
     */
    public function store(StoreLeadRequest $request, CreateLead $createLead): RedirectResponse
    {
        $createLead->execute($request->validated());

        return back()->with('success', 'Merci! Nous vous contacterons sous peu.');
    }
}
