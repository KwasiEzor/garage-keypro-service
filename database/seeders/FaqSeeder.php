<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Quels types de véhicules prenez-vous en charge?',
                'answer' => 'Nous travaillons sur toutes les marques et modèles de véhicules, des voitures européennes aux véhicules asiatiques et américains. Notre équipement professionnel nous permet d\'intervenir sur les systèmes les plus récents.',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'question' => 'Combien de temps prend la programmation d\'une clé?',
                'answer' => 'La durée varie selon le modèle du véhicule, généralement entre 30 minutes et 2 heures. Pour certains véhicules haut de gamme, cela peut prendre plus de temps. Nous vous donnons une estimation précise lors de votre demande.',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'question' => 'Quel est le coût d\'une programmation de clé?',
                'answer' => 'Les tarifs démarrent à 150€ selon la marque et le modèle. La complexité du système électronique et le type de clé influencent le prix final. Contactez-nous pour un devis précis.',
                'category' => 'pricing',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'question' => "Proposez-vous un service d'urgence?",
                'answer' => 'Oui, nous offrons un service d\'intervention rapide 24/7 pour les situations d\'urgence comme les véhicules verrouillés avec clés à l\'intérieur. Des frais supplémentaires s\'appliquent pour les interventions en dehors des heures normales.',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'question' => 'Puis-je programmer une clé sans l\'originale?',
                'answer' => 'Oui, dans la plupart des cas nous pouvons programmer une nouvelle clé même sans avoir l\'originale. Cependant, cela peut nécessiter un accès au véhicule et à ses systèmes électroniques, ce qui peut augmenter le temps et le coût de l\'intervention.',
                'category' => 'technical',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'question' => 'Intervenez-vous à domicile?',
                'answer' => 'Oui, nous nous déplaçons à votre domicile, bureau ou tout autre lieu dans notre zone d\'intervention. Le déplacement est inclus dans nos tarifs pour la zone locale, des frais peuvent s\'appliquer pour les zones plus éloignées.',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'question' => "Quelle est votre zone d'intervention?",
                'answer' => 'Nous intervenons principalement dans toute la région. Pour des interventions en dehors de notre zone habituelle, contactez-nous pour vérifier notre disponibilité et les conditions.',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'question' => 'Offrez-vous une garantie sur vos services?',
                'answer' => 'Oui, tous nos services sont garantis. La durée de garantie varie selon le type d\'intervention. Nous garantissons la qualité de notre travail et le bon fonctionnement des clés programmées.',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}
