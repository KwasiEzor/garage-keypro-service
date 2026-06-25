<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\Role;
use App\Models\Lead;
use App\Models\User;
use App\Notifications\LeadSubmissionConfirmation;
use App\Notifications\NewLeadNotification;

class CreateLead
{
    /**
     * Create a new lead and notify the team.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): Lead
    {
        $existing = Lead::where('email', $data['email'])->first();

        if ($existing) {
            $existing->update(array_diff_key($data, array_flip(['status'])));

            return $existing;
        }

        $lead = Lead::create([
            ...$data,
            'status' => $data['status'] ?? 'new',
            'source' => $data['source'] ?? 'website',
        ]);

        $lead->notify(new LeadSubmissionConfirmation($lead));
        User::where('role', Role::Admin)->first()?->notify(new NewLeadNotification($lead));

        return $lead;
    }
}
