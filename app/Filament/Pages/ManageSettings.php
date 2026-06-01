<?php

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
