<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'customer_name' => 'Marie Dubois',
                'customer_location' => 'Paris',
                'vehicle_info' => 'Renault Clio 2019',
                'content' => 'Service impeccable! J\'avais perdu mes clés et ils sont intervenus en moins d\'une heure. Programmation rapide et professionnelle. Je recommande vivement!',
                'rating' => 5,
                'avatar_path' => null,
                'is_featured' => true,
                'is_active' => true,
                'service_date' => now()->subDays(15),
            ],
            [
                'customer_name' => 'Thomas Martin',
                'customer_location' => 'Lyon',
                'vehicle_info' => 'BMW 320d 2020',
                'content' => 'Excellent travail sur la programmation de ma clé BMW. Le technicien était très compétent et a pris le temps de m\'expliquer le processus. Prix correct.',
                'rating' => 5,
                'avatar_path' => null,
                'is_featured' => true,
                'is_active' => true,
                'service_date' => now()->subDays(30),
            ],
            [
                'customer_name' => 'Sophie Laurent',
                'customer_location' => 'Marseille',
                'vehicle_info' => 'Peugeot 308 2021',
                'content' => 'Intervention rapide pour un problème de clé. Le technicien est arrivé à l\'heure convenue et a résolu le problème en 30 minutes. Très satisfaite du service!',
                'rating' => 5,
                'avatar_path' => null,
                'is_featured' => true,
                'is_active' => true,
                'service_date' => now()->subDays(45),
            ],
            [
                'customer_name' => 'Jean-Pierre Rousseau',
                'customer_location' => 'Toulouse',
                'vehicle_info' => 'Mercedes C-Class 2018',
                'content' => 'Service professionnel pour ma Mercedes. La programmation de la clé a été faite dans les règles de l\'art. Prix un peu élevé mais justifié par la qualité.',
                'rating' => 4,
                'avatar_path' => null,
                'is_featured' => false,
                'is_active' => true,
                'service_date' => now()->subDays(60),
            ],
            [
                'customer_name' => 'Isabelle Bernard',
                'customer_location' => 'Nice',
                'vehicle_info' => 'Toyota Yaris 2020',
                'content' => 'Très bon service! J\'ai appelé pour une urgence et ils ont pu intervenir le jour même. Le technicien était sympathique et professionnel.',
                'rating' => 5,
                'avatar_path' => null,
                'is_featured' => false,
                'is_active' => true,
                'service_date' => now()->subDays(20),
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(['customer_name' => $testimonial['customer_name'], 'vehicle_info' => $testimonial['vehicle_info'] ?? null], $testimonial);
        }
    }
}
