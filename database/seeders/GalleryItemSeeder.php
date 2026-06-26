<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GalleryItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Premium vehicle showcase items
        $premiumCars = [
            [
                'title' => 'Corvette 2026 Arctic White',
                'slug' => 'corvette-2026-arctic-white',
                'description' => 'Programmation de clé électronique pour Corvette 2026. Service de remplacement et duplication de clés pour cette voiture de sport américaine emblématique.',
                'image_path' => '/images/premium-cars/2026-Corvette-Arctic-White.avif',
                'category' => 'Key Programming',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'BMW X1 2026',
                'slug' => 'bmw-x1-2026',
                'description' => 'Diagnostic et programmation de clés intelligentes pour BMW X1 2026. Expertise certifiée sur systèmes de clés BMW avancés.',
                'image_path' => '/images/premium-cars/BMW-X1-2026.avif',
                'category' => 'Diagnostics',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Audi Premium 2026',
                'slug' => 'audi-premium-2026',
                'description' => 'Service spécialisé de programmation de clés pour Audi 2026. Duplication et remplacement de clés électroniques Audi avec garantie.',
                'image_path' => '/images/premium-cars/audi-2026.png',
                'category' => 'Key Programming',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Audi Q5 Premium 2026',
                'slug' => 'audi-q5-premium-2026',
                'description' => 'Programmation de système d\'accès sans clé pour Audi Q5 2026. Service mobile disponible pour intervention rapide.',
                'image_path' => '/images/premium-cars/audi-premium-Q5-2026.png',
                'category' => 'Key Programming',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Lamborghini Aventador',
                'slug' => 'lamborghini-aventador',
                'description' => 'Programmation de clés ultra-sophistiquées pour Lamborghini Aventador. Service premium pour supercars italiennes avec équipement de pointe.',
                'image_path' => '/images/premium-cars/pngtree-3d-red-lamborghini-aventado-png-image_15503537.png',
                'category' => 'Performance',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'Range Rover 2026',
                'slug' => 'range-rover-2026',
                'description' => 'Service expert de programmation de clés intelligentes pour Range Rover 2026. Diagnostic et remplacement de clés Land Rover premium.',
                'image_path' => '/images/premium-cars/ranger-rover-2026.png',
                'category' => 'Diagnostics',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        // Create premium car gallery items
        foreach ($premiumCars as $car) {
            GalleryItem::updateOrCreate(['slug' => $car['slug']], $car);
        }

        // Only seed factory items when the gallery has no extras yet
        if (GalleryItem::count() <= count($premiumCars)) {
            GalleryItem::factory()->count(18)->create();
        }
    }
}
