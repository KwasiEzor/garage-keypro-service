<?php

namespace App\Filament\Pages;

use App\Models\Setting;
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
                            ->placeholder('Bonjour, j\'aimerais avoir des informations sur vos services.'),
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
