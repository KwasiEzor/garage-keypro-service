<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── General ────────────────────────────────────────────────────
            'site_name' => 'KeyPro Service',
            'support_email' => 'contact@garage-keypro.com',
            'contact_phone' => '+228 72 11 44 44',
            'site_address' => 'Lomé, Togo',
            'opening_hours' => 'Lun–Sam : 08h–18h  |  Urgences 24h/7',
            'footer_text' => '© '.date('Y').' KeyPro Service. Tous droits réservés.',

            // ── SEO ────────────────────────────────────────────────────────
            'seo_title' => 'Expert Clés Auto & Diagnostic Automobile',
            'seo_description' => 'Spécialiste en reproduction de clés, programmation électronique et diagnostic automobile à Lomé. Assistance mobile rapide et fiable.',
            'seo_keywords' => 'clé auto, programmation clé, diagnostic automobile, Lomé, Togo, serrurerie auto',
            'seo_robots' => 'index, follow',

            // ── Social links ───────────────────────────────────────────────
            'social_facebook' => 'https://facebook.com/garagekeypro',
            'social_instagram' => 'https://instagram.com/garagekeypro',
            'social_twitter' => '',
            'social_youtube' => '',
            'social_tiktok' => '',

            // ── GDPR / Compliance ──────────────────────────────────────────
            'cookie_consent_enabled' => '1',
            'cookie_consent_message' => 'Nous utilisons des cookies pour améliorer votre expérience sur notre site.',
            'privacy_policy_url' => '/legal/politique-de-confidentialite',
            'terms_of_service_url' => '/legal/conditions-generales',

            // ── Legal pages content ────────────────────────────────────────
            'privacy_policy_content' => '<h2>Politique de Confidentialité</h2><p>KeyPro Service s\'engage à protéger vos données personnelles. Les informations collectées lors de vos demandes sont utilisées uniquement pour traiter vos demandes et améliorer nos services. Vos données ne sont jamais vendues à des tiers. Vous disposez d\'un droit d\'accès, de rectification et de suppression en nous contactant à contact@garage-keypro.com.</p>',
            'terms_of_service_content' => '<h2>Conditions Générales de Service</h2><p>En utilisant les services de KeyPro Service, vous acceptez les présentes conditions. Nos interventions sont garanties et réalisées par des techniciens certifiés. Les tarifs sont communiqués avant toute intervention. KeyPro Service se réserve le droit de refuser toute intervention ne pouvant être réalisée légalement.</p>',

            // ── WhatsApp ───────────────────────────────────────────────────
            'whatsapp_enabled' => '1',
            'whatsapp_number' => '+22872114444',
            'whatsapp_message' => "Bonjour, j'aimerais avoir des informations sur vos services de clés automobiles.",

            // ── Hero section ───────────────────────────────────────────────
            'hero_badge' => 'Protocoles de Sécurité Avancés',
            'hero_title' => 'Expert Clés Auto',
            'hero_subtitle' => 'Spécialiste en reproduction de clés, programmation électronique et diagnostic automobile. Assistance mobile rapide à Lomé et ses environs.',
            'hero_cta_primary_text' => 'Réserver un Rendez-vous',
            'hero_cta_primary_href' => '/appointments',
            'hero_cta_secondary_text' => "Appel d'Urgence",
            'hero_image_url' => '',

            // ── How It Works steps ─────────────────────────────────────────
            'how_step1_title' => 'Activation',
            'how_step1_desc' => 'Analyse rapide de votre besoin en clés ou diagnostic électronique par nos techniciens.',
            'how_step2_title' => 'Intervention',
            'how_step2_desc' => 'Déploiement immédiat de notre unité mobile à Lomé pour une solution sur site.',
            'how_step3_title' => 'Validation',
            'how_step3_desc' => 'Programmation, test de conformité et remise des clés avec garantie de fiabilité.',

            // ── Mission section ────────────────────────────────────────────
            'mission_badge' => 'Notre Mission à Lomé',
            'mission_heading' => "Innovation\net Expertise\nTechnique",
            'mission_quote' => 'Fournir des solutions rapides, fiables et accessibles pour tous les problèmes liés aux clés automobiles et aux systèmes électroniques des véhicules.',
            'mission_stat1_value' => '98%',
            'mission_stat1_label' => 'Clients Satisfaits',
            'mission_stat2_value' => '24h/7',
            'mission_stat2_label' => 'Assistance Urgente',
            'mission_image_url' => 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=90&auto=format&fit=crop',

            // ── Section labels ─────────────────────────────────────────────
            'section_services_badge' => 'Nos Spécialités',
            'section_services_heading' => 'Solutions Automobiles',
            'section_services_subtext' => 'Expertise technique multi-marques pour tous vos problèmes de clés et électronique embarquée.',
            'section_process_badge' => 'Notre Méthodologie',
            'section_process_heading' => "Protocole d'Exécution",
            'section_testimonials_badge' => 'Rapports Système',
            'section_testimonials_heading' => 'Intelligence Client',
            'section_contact_heading' => 'Demander une Intervention',
            'section_contact_subtext' => 'Établissez un statut technique prioritaire en soumettant vos besoins opérationnels.',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
