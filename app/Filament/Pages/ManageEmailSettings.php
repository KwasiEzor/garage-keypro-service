<?php

declare(strict_types=1);

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ManageEmailSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-envelope';

    protected static string|\UnitEnum|null $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Email Templates';

    protected static ?int $navigationSort = 20;

    protected string $view = 'filament.pages.manage-email-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill($this->getSettingsData());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('Email Settings')
                    ->tabs([
                        Tabs\Tab::make('Brand Settings')
                            ->icon('heroicon-o-paint-brush')
                            ->schema([
                                Section::make('Email Branding')
                                    ->description('Customize the look and feel of your email templates')
                                    ->schema([
                                        TextInput::make('email_company_name')
                                            ->label('Company Name')
                                            ->default('GarageKeyPro')
                                            ->required(),

                                        TextInput::make('email_logo_url')
                                            ->label('Logo URL')
                                            ->url()
                                            ->placeholder('https://example.com/logo.png')
                                            ->helperText('URL to your company logo (180px wide recommended)'),

                                        ColorPicker::make('email_primary_color')
                                            ->label('Primary Color')
                                            ->default('#4C8BF5')
                                            ->helperText('Main brand color used in headers'),

                                        ColorPicker::make('email_accent_color')
                                            ->label('Accent Color')
                                            ->default('#FF6700')
                                            ->helperText('Color used for buttons and CTAs'),

                                        Textarea::make('email_footer_text')
                                            ->label('Footer Text')
                                            ->rows(3)
                                            ->default('GarageKeyPro - Elite Automotive Engineering')
                                            ->helperText('Text displayed at the bottom of all emails'),

                                        TextInput::make('email_support_email')
                                            ->label('Support Email')
                                            ->email()
                                            ->default('support@garagekeypro.com'),

                                        TextInput::make('email_support_phone')
                                            ->label('Support Phone')
                                            ->tel()
                                            ->default('+1 (555) 123-4567'),
                                    ])->columns(2),
                            ]),

                        Tabs\Tab::make('Appointments')
                            ->icon('heroicon-o-calendar')
                            ->schema([
                                Section::make('Appointment Confirmation')
                                    ->schema([
                                        Toggle::make('email_appointment_confirmation_enabled')
                                            ->label('Enable Confirmation Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_appointment_confirmation_subject')
                                            ->label('Subject Line')
                                            ->default('Appointment Confirmed - {service} on {date}')
                                            ->helperText('Variables: {service}, {date}, {time}')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Appointment Reminder')
                                    ->schema([
                                        Toggle::make('email_appointment_reminder_enabled')
                                            ->label('Enable Reminder Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_appointment_reminder_subject')
                                            ->label('Subject Line')
                                            ->default('Reminder: Your Appointment Tomorrow at {time}')
                                            ->helperText('Variables: {time}, {date}')
                                            ->required(),

                                        TextInput::make('email_appointment_reminder_hours_before')
                                            ->label('Send Reminder (hours before)')
                                            ->numeric()
                                            ->default(24)
                                            ->suffix('hours')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Appointment Cancellation')
                                    ->schema([
                                        Toggle::make('email_appointment_cancellation_enabled')
                                            ->label('Enable Cancellation Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_appointment_cancellation_subject')
                                            ->label('Subject Line')
                                            ->default('Appointment Cancelled - {service}')
                                            ->helperText('Variables: {service}')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Appointment Rescheduled')
                                    ->schema([
                                        Toggle::make('email_appointment_rescheduled_enabled')
                                            ->label('Enable Rescheduled Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_appointment_rescheduled_subject')
                                            ->label('Subject Line')
                                            ->default('Appointment Rescheduled - New Time: {date}')
                                            ->helperText('Variables: {date}, {time}')
                                            ->required(),
                                    ])->columns(1),
                            ]),

                        Tabs\Tab::make('Invoices')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Section::make('Invoice Sent')
                                    ->schema([
                                        Toggle::make('email_invoice_sent_enabled')
                                            ->label('Enable Invoice Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_invoice_sent_subject')
                                            ->label('Subject Line')
                                            ->default('Invoice #{number} from GarageKeyPro')
                                            ->helperText('Variable: {number}')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Invoice Paid')
                                    ->schema([
                                        Toggle::make('email_invoice_paid_enabled')
                                            ->label('Enable Payment Receipt Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_invoice_paid_subject')
                                            ->label('Subject Line')
                                            ->default('Payment Receipt - Invoice #{number}')
                                            ->helperText('Variable: {number}')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Invoice Overdue')
                                    ->schema([
                                        Toggle::make('email_invoice_overdue_enabled')
                                            ->label('Enable Overdue Reminder Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_invoice_overdue_subject')
                                            ->label('Subject Line')
                                            ->default('Payment Reminder - Invoice #{number} Overdue')
                                            ->helperText('Variable: {number}')
                                            ->required(),
                                    ])->columns(1),
                            ]),

                        Tabs\Tab::make('Authentication')
                            ->icon('heroicon-o-shield-check')
                            ->schema([
                                Section::make('Welcome Email')
                                    ->schema([
                                        Toggle::make('email_welcome_enabled')
                                            ->label('Enable Welcome Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_welcome_subject')
                                            ->label('Subject Line')
                                            ->default('Welcome to GarageKeyPro!')
                                            ->required(),

                                        Textarea::make('email_welcome_message')
                                            ->label('Welcome Message')
                                            ->rows(3)
                                            ->default('Thank you for choosing GarageKeyPro for your automotive locksmith needs.')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Email Verification')
                                    ->schema([
                                        Toggle::make('email_verification_enabled')
                                            ->label('Enable Email Verification')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_verification_subject')
                                            ->label('Subject Line')
                                            ->default('Verify Your Email Address')
                                            ->required(),
                                    ])->columns(1),

                                Section::make('Password Reset')
                                    ->schema([
                                        Toggle::make('email_password_reset_enabled')
                                            ->label('Enable Password Reset Emails')
                                            ->default(true)
                                            ->inline(false),

                                        TextInput::make('email_password_reset_subject')
                                            ->label('Subject Line')
                                            ->default('Reset Your Password')
                                            ->required(),
                                    ])->columns(1),
                            ]),
                    ])->columnSpanFull(),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        Notification::make()
            ->success()
            ->title('Email settings saved')
            ->body('Your email template settings have been updated successfully.')
            ->send();
    }

    protected function getSettingsData(): array
    {
        $keys = [
            'email_company_name',
            'email_logo_url',
            'email_primary_color',
            'email_accent_color',
            'email_footer_text',
            'email_support_email',
            'email_support_phone',
            'email_appointment_confirmation_enabled',
            'email_appointment_confirmation_subject',
            'email_appointment_reminder_enabled',
            'email_appointment_reminder_subject',
            'email_appointment_reminder_hours_before',
            'email_appointment_cancellation_enabled',
            'email_appointment_cancellation_subject',
            'email_appointment_rescheduled_enabled',
            'email_appointment_rescheduled_subject',
            'email_invoice_sent_enabled',
            'email_invoice_sent_subject',
            'email_invoice_paid_enabled',
            'email_invoice_paid_subject',
            'email_invoice_overdue_enabled',
            'email_invoice_overdue_subject',
            'email_welcome_enabled',
            'email_welcome_subject',
            'email_welcome_message',
            'email_verification_enabled',
            'email_verification_subject',
            'email_password_reset_enabled',
            'email_password_reset_subject',
        ];

        $data = [];
        foreach ($keys as $key) {
            $data[$key] = Setting::get($key);
        }

        return $data;
    }
}
