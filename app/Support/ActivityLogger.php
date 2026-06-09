<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    /**
     * Log an activity.
     */
    public static function log(
        string $description,
        ?Model $subject = null,
        ?Model $causer = null,
        ?string $logName = null,
        ?string $event = null,
        array $properties = []
    ): Activity {
        $causer = $causer ?? Auth::user();

        return Activity::create([
            'log_name' => $logName,
            'description' => $description,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'causer_type' => $causer?->getMorphClass(),
            'causer_id' => $causer?->getKey(),
            'properties' => $properties,
            'event' => $event,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Log a role change.
     */
    public static function logRoleChange(Model $user, string $oldRole, string $newRole, ?Model $causer = null): Activity
    {
        return self::log(
            description: "User role changed from {$oldRole} to {$newRole}",
            subject: $user,
            causer: $causer,
            logName: 'role_change',
            event: 'updated',
            properties: ['old_role' => $oldRole, 'new_role' => $newRole]
        );
    }

    /**
     * Log invoice creation.
     */
    public static function logInvoiceCreated(Model $invoice, ?Model $causer = null): Activity
    {
        return self::log(
            description: "Invoice #{$invoice->id} created",
            subject: $invoice,
            causer: $causer,
            logName: 'invoice',
            event: 'created'
        );
    }

    /**
     * Log team membership change.
     */
    public static function logTeamMembershipChange(string $action, Model $user, Model $team, ?Model $causer = null): Activity
    {
        return self::log(
            description: "User {$action} team {$team->name}",
            subject: $team,
            causer: $causer,
            logName: 'team_membership',
            event: $action,
            properties: ['user_id' => $user->id, 'user_name' => $user->name]
        );
    }
}
