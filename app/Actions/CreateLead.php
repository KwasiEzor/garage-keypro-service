<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\Role;
use App\Models\Lead;
use App\Models\User;
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
        $lead = Lead::create([
            ...$data,
            'status' => $data['status'] ?? 'new',
            'source' => $data['source'] ?? 'website',
        ]);

        // Notify first admin or all admins
        User::where('role', Role::Admin)->first()?->notify(new NewLeadNotification($lead));

        return $lead;
    }
}
