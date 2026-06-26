<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role as SpatieRole;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@garage-keypro.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Admin@1234!'),
                'email_verified_at' => now(),
                'role' => Role::Admin,
            ]
        );

        $spatieRole = SpatieRole::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        if (! $admin->hasRole('admin')) {
            $admin->assignRole($spatieRole);
        }

        // Ensure the admin has a personal team
        if ($admin->ownedTeams()->count() === 0) {
            $team = Team::factory()->personal()->create([
                'name' => $admin->name."'s Team",
            ]);
            $team->members()->attach($admin, ['role' => TeamRole::Owner->value]);
            $admin->switchTeam($team);
        }
    }
}
