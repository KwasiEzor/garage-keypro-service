<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@garagekeypro.com',
        ]);

        $this->call([
            ServiceSeeder::class,
            BrandSeeder::class,
            FaqSeeder::class,
            TestimonialSeeder::class,
        ]);
    }
}
