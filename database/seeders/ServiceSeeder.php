<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Programmation Clé',
                'slug' => 'programmation-cle',
                'description' => 'Programmation complète de clé électronique pour tous les véhicules',
                'long_description' => 'Service professionnel de programmation de clés électroniques avec diagnostic complet. Compatible avec toutes les marques de véhicules.',
                'icon' => 'Cpu',
                'starting_price' => 150.00,
                'estimated_duration' => 45,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Duplication Clé',
                'slug' => 'duplication-cle',
                'description' => 'Duplication rapide de clés mécaniques et électroniques',
                'long_description' => 'Service de duplication pour tous types de clés automobiles. Travail rapide et précis avec garantie.',
                'icon' => 'Copy',
                'starting_price' => 80.00,
                'estimated_duration' => 30,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Ouverture Véhicule',
                'slug' => 'ouverture-vehicule',
                'description' => 'Service d\'urgence pour ouverture de véhicule sans dommage',
                'long_description' => 'Intervention rapide 24/7 pour déblocage de véhicule. Méthode professionnelle sans détérioration.',
                'icon' => 'Unlock',
                'starting_price' => 100.00,
                'estimated_duration' => 20,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Réparation Neiman',
                'slug' => 'reparation-neiman',
                'description' => 'Réparation et remplacement de contacteur d\'allumage',
                'long_description' => 'Diagnostic et réparation complète du système d\'allumage. Remplacement de neiman usé ou défectueux.',
                'icon' => 'Wrench',
                'starting_price' => 200.00,
                'estimated_duration' => 90,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Programmation ECU',
                'slug' => 'programmation-ecu',
                'description' => 'Programmation calculateur moteur et modules électroniques',
                'long_description' => 'Service spécialisé de programmation ECU. Clonage et configuration de modules électroniques.',
                'icon' => 'Settings',
                'starting_price' => 250.00,
                'estimated_duration' => 120,
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Diagnostic Électronique',
                'slug' => 'diagnostic-electronique',
                'description' => 'Diagnostic complet des systèmes électroniques du véhicule',
                'long_description' => 'Analyse approfondie avec outils professionnels. Identification précise des pannes électroniques.',
                'icon' => 'Activity',
                'starting_price' => 80.00,
                'estimated_duration' => 45,
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
