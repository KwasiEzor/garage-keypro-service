<?php

declare(strict_types=1);

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ManageSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string|\UnitEnum|null $navigationGroup = 'Administration';

    protected string $view = 'filament.pages.manage-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $this->form->fill($settings);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General Settings')
                    ->description('Manage global site configuration.')
                    ->components([
                        TextInput::make('site_name')
                            ->label('Site Name')
                            ->required(),
                        TextInput::make('support_email')
                            ->label('Support Email')
                            ->email()
                            ->required(),
                        TextInput::make('contact_phone')
                            ->label('Contact Phone Number'),
                        TextInput::make('site_address')
                            ->label('Site Address'),
                        TextInput::make('opening_hours')
                            ->label('Opening Hours'),
                        Textarea::make('footer_text')
                            ->label('Footer Copyright Text')
                            ->rows(3),
                    ]),

                Section::make('SEO Settings')
                    ->description('Manage search engine optimization.')
                    ->components([
                        TextInput::make('seo_title')
                            ->label('Default SEO Title')
                            ->helperText('Used when a specific page title is not set.'),
                        Textarea::make('seo_description')
                            ->label('Default SEO Description')
                            ->rows(3),
                        TextInput::make('seo_keywords')
                            ->label('SEO Keywords')
                            ->helperText('Comma separated keywords.'),
                        Select::make('seo_robots')
                            ->label('Robots Meta Tag')
                            ->options([
                                'index, follow' => 'Index, Follow',
                                'noindex, follow' => 'No Index, Follow',
                                'index, nofollow' => 'Index, No Follow',
                                'noindex, nofollow' => 'No Index, No Follow',
                            ])
                            ->default('index, follow'),
                        TextInput::make('google_analytics_id')
                            ->label('Google Analytics (G-XXXXX)'),
                        TextInput::make('facebook_pixel_id')
                            ->label('Facebook Pixel ID'),
                    ]),

                Section::make('GDPR & Compliance')
                    ->description('Manage cookie consent and privacy settings.')
                    ->components([
                        Toggle::make('cookie_consent_enabled')
                            ->label('Enable Cookie Consent Banner'),
                        Textarea::make('cookie_consent_message')
                            ->label('Cookie Consent Message')
                            ->rows(2)
                            ->default('Nous utilisons des cookies pour améliorer votre expérience sur notre site.'),
                        TextInput::make('privacy_policy_url')
                            ->label('Privacy Policy URL')
                            ->placeholder('/privacy-policy'),
                        TextInput::make('terms_of_service_url')
                            ->label('Terms of Service URL')
                            ->placeholder('/terms-of-service'),
                    ]),

                Section::make('Legal Pages Content')
                    ->description('Manage the content for your legal pages.')
                    ->components([
                        RichEditor::make('privacy_policy_content')
                            ->label('Privacy Policy Content'),
                        RichEditor::make('terms_of_service_content')
                            ->label('Terms of Service Content'),
                    ]),

                Section::make('WhatsApp Configuration')
                    ->description('Manage WhatsApp floating button.')
                    ->components([
                        Toggle::make('whatsapp_enabled')
                            ->label('Enable WhatsApp Button'),
                        TextInput::make('whatsapp_number')
                            ->label('WhatsApp Number')
                            ->placeholder('+22890956935')
                            ->helperText('Include country code, e.g., +22890956935'),
                        TextInput::make('whatsapp_message')
                            ->label('Default WhatsApp Message')
                            ->placeholder("Bonjour, j'aimerais avoir des informations sur vos services."),
                    ]),

                Section::make('Social Media Links')
                    ->description('Links shown in the footer and navigation.')
                    ->components([
                        TextInput::make('social_facebook')->label('Facebook URL')->placeholder('https://facebook.com/yourpage'),
                        TextInput::make('social_instagram')->label('Instagram URL')->placeholder('https://instagram.com/yourpage'),
                        TextInput::make('social_twitter')->label('Twitter / X URL')->placeholder('https://twitter.com/yourpage'),
                        TextInput::make('social_youtube')->label('YouTube URL')->placeholder('https://youtube.com/yourchannel'),
                        TextInput::make('social_tiktok')->label('TikTok URL')->placeholder('https://tiktok.com/@yourpage'),
                    ]),

                Section::make('Hero Section')
                    ->description('Content for the full-width hero at the top of the home page.')
                    ->components([
                        TextInput::make('hero_badge')->label('Badge Text')->placeholder('Protocoles de Sécurité Avancés'),
                        TextInput::make('hero_title')->label('Hero Title')->placeholder('Expert Clés Auto'),
                        Textarea::make('hero_subtitle')->label('Hero Subtitle')->rows(2)
                            ->placeholder('Spécialiste en reproduction de clés, programmation électronique…'),
                        TextInput::make('hero_cta_primary_text')->label('Primary CTA Text')->placeholder('Réserver un Rendez-vous'),
                        TextInput::make('hero_cta_primary_href')->label('Primary CTA URL')->placeholder('/appointments'),
                        TextInput::make('hero_cta_secondary_text')->label('Secondary CTA Text')->placeholder("Appel d'Urgence"),
                        TextInput::make('hero_image_url')->label('Hero Background Image URL')
                            ->placeholder('https://images.unsplash.com/…')
                            ->helperText('Leave empty to use the default image.'),
                    ]),

                Section::make('How It Works — Steps')
                    ->description('The 3-step process shown on the home page.')
                    ->columns(3)
                    ->components([
                        TextInput::make('how_step1_title')->label('Step 1 Title')->placeholder('Activation'),
                        TextInput::make('how_step2_title')->label('Step 2 Title')->placeholder('Intervention'),
                        TextInput::make('how_step3_title')->label('Step 3 Title')->placeholder('Validation'),
                        Textarea::make('how_step1_desc')->label('Step 1 Description')->rows(3)
                            ->placeholder('Analyse rapide de votre besoin…'),
                        Textarea::make('how_step2_desc')->label('Step 2 Description')->rows(3)
                            ->placeholder('Déploiement immédiat…'),
                        Textarea::make('how_step3_desc')->label('Step 3 Description')->rows(3)
                            ->placeholder('Programmation, test de conformité…'),
                    ]),

                Section::make('Mission Section')
                    ->description('The full-width mission block on the home page.')
                    ->components([
                        TextInput::make('mission_badge')->label('Badge Label')->placeholder('Notre Mission à Lomé'),
                        TextInput::make('mission_heading')->label('Heading (supports \\n for line breaks)')
                            ->placeholder('Innovation\net Expertise\nTechnique'),
                        Textarea::make('mission_quote')->label('Quote / Tagline')->rows(3)
                            ->placeholder('Fournir des solutions rapides, fiables…'),
                        TextInput::make('mission_stat1_value')->label('Stat 1 Value')->placeholder('98%'),
                        TextInput::make('mission_stat1_label')->label('Stat 1 Label')->placeholder('Clients Satisfaits'),
                        TextInput::make('mission_stat2_value')->label('Stat 2 Value')->placeholder('24h/7'),
                        TextInput::make('mission_stat2_label')->label('Stat 2 Label')->placeholder('Assistance Urgente'),
                        TextInput::make('mission_image_url')->label('Mission Image URL')
                            ->placeholder('https://images.unsplash.com/…'),
                    ]),

                Section::make('Home Page — Section Labels')
                    ->description('Section headings and subtexts across the home page.')
                    ->components([
                        TextInput::make('section_services_badge')->label('Services Badge')->placeholder('Nos Spécialités'),
                        TextInput::make('section_services_heading')->label('Services Heading')->placeholder('Solutions Automobiles'),
                        TextInput::make('section_services_subtext')->label('Services Sub-text')
                            ->placeholder('Expertise technique multi-marques…'),
                        TextInput::make('section_process_badge')->label('Process Badge')->placeholder('Notre Méthodologie'),
                        TextInput::make('section_process_heading')->label('Process Heading')->placeholder("Protocole d'Exécution"),
                        TextInput::make('section_testimonials_badge')->label('Testimonials Badge')->placeholder('Rapports Système'),
                        TextInput::make('section_testimonials_heading')->label('Testimonials Heading')->placeholder('Intelligence Client'),
                        TextInput::make('section_contact_heading')->label('Contact Heading')->placeholder('Demander une Intervention'),
                        TextInput::make('section_contact_subtext')->label('Contact Sub-text')
                            ->placeholder('Établissez un statut technique prioritaire…'),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }
}
