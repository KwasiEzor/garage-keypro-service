<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ManageInvoiceSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-receipt-percent';

    protected static string|\UnitEnum|null $navigationGroup = 'Billing';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Invoice Settings';

    protected string $view = 'filament.pages.manage-invoice-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::where('key', 'like', 'invoice_%')->pluck('value', 'key')->toArray();
        $this->form->fill($settings);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Invoice Branding')
                    ->description('Manage invoice branding and headers.')
                    ->components([
                        TextInput::make('invoice_company_name')
                            ->label('Company Name')
                            ->placeholder('KeyPro Service Center'),
                        Textarea::make('invoice_company_address')
                            ->label('Company Address')
                            ->rows(2)
                            ->placeholder("123 Luxury Ave\nAutomotive District"),
                        TextInput::make('invoice_company_phone')
                            ->label('Company Phone')
                            ->placeholder('+1 234 567 890'),
                        TextInput::make('invoice_company_email')
                            ->label('Company Email')
                            ->placeholder('billing@keypro.service'),
                        TextInput::make('invoice_tax_id')
                            ->label('Tax ID / VAT Number')
                            ->placeholder('US123456789'),
                        Textarea::make('invoice_footer_notes')
                            ->label('Default Invoice Footer')
                            ->rows(2)
                            ->placeholder('Professional care for your vehicle. Thank you for your business.'),
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
            ->title('Invoice settings saved successfully')
            ->success()
            ->send();
    }
}
