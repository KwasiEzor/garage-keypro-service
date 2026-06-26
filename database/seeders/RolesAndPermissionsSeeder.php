<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role as RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Permissions ─────────────────────────────────────────
        $permissions = [
            // Admin panel access
            'access admin panel',

            // User management
            'view users',
            'create users',
            'edit users',
            'delete users',
            'manage roles',

            // Appointments
            'view own appointments',
            'create appointments',
            'cancel own appointments',
            'reschedule own appointments',
            'view all appointments',
            'manage appointments',

            // Invoices
            'view own invoices',
            'view all invoices',
            'manage invoices',

            // Content management
            'manage services',
            'manage brands',
            'manage faqs',
            'manage testimonials',
            'manage gallery',
            'manage leads',

            // Settings & analytics
            'manage settings',
            'view analytics',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ── Roles ────────────────────────────────────────────────

        // Admin: everything
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        // Manager: all operational access except user/role management and settings
        $manager = Role::firstOrCreate(['name' => 'manager']);
        $manager->syncPermissions([
            'access admin panel',
            'view users',
            'view own appointments',
            'create appointments',
            'cancel own appointments',
            'reschedule own appointments',
            'view all appointments',
            'manage appointments',
            'view own invoices',
            'view all invoices',
            'manage invoices',
            'manage services',
            'manage brands',
            'manage faqs',
            'manage testimonials',
            'manage gallery',
            'manage leads',
            'view analytics',
        ]);

        // Member: own data only
        $member = Role::firstOrCreate(['name' => 'member']);
        $member->syncPermissions([
            'view own appointments',
            'create appointments',
            'cancel own appointments',
            'reschedule own appointments',
            'view own invoices',
        ]);

        // ── Sync existing users from role enum column ─────────────
        User::withTrashed()->each(function (User $user): void {
            $roleName = match ($user->role) {
                RoleEnum::Admin => 'admin',
                RoleEnum::Manager => 'manager',
                RoleEnum::Member => 'member',
            };

            if (! $user->hasRole($roleName)) {
                $user->assignRole($roleName);
            }
        });
    }
}
