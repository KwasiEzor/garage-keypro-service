<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class EmailTemplateSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Brand Settings
            'email_logo_url' => config('app.url').'/images/logo.png',
            'email_primary_color' => '#4C8BF5', // hsl(217, 91%, 60%)
            'email_accent_color' => '#FF6700', // hsl(24, 100%, 50%)
            'email_footer_text' => 'GarageKeyPro - Elite Automotive Engineering. Your trusted partner for professional car key replacement and locksmith services.',
            'email_company_name' => 'GarageKeyPro',
            'email_support_email' => 'support@garagekeypro.com',
            'email_support_phone' => '+1 (555) 123-4567',

            // Appointment Confirmation
            'email_appointment_confirmation_subject' => 'Appointment Confirmed - {service} on {date}',
            'email_appointment_confirmation_enabled' => 'true',

            // Appointment Reminder
            'email_appointment_reminder_subject' => 'Reminder: Your Appointment Tomorrow at {time}',
            'email_appointment_reminder_enabled' => 'true',
            'email_appointment_reminder_hours_before' => '24',

            // Appointment Cancellation
            'email_appointment_cancellation_subject' => 'Appointment Cancelled - {service}',
            'email_appointment_cancellation_enabled' => 'true',

            // Appointment Rescheduled
            'email_appointment_rescheduled_subject' => 'Appointment Rescheduled - New Time: {date}',
            'email_appointment_rescheduled_enabled' => 'true',

            // Invoice Sent
            'email_invoice_sent_subject' => 'Invoice #{number} from GarageKeyPro',
            'email_invoice_sent_enabled' => 'true',

            // Invoice Paid
            'email_invoice_paid_subject' => 'Payment Receipt - Invoice #{number}',
            'email_invoice_paid_enabled' => 'true',

            // Invoice Overdue
            'email_invoice_overdue_subject' => 'Payment Reminder - Invoice #{number} Overdue',
            'email_invoice_overdue_enabled' => 'true',

            // Welcome Email
            'email_welcome_subject' => 'Welcome to GarageKeyPro!',
            'email_welcome_enabled' => 'true',
            'email_welcome_message' => 'Thank you for choosing GarageKeyPro for your automotive locksmith needs. We\'re committed to providing you with exceptional service.',

            // Email Verification
            'email_verification_subject' => 'Verify Your Email Address',
            'email_verification_enabled' => 'true',

            // Password Reset
            'email_password_reset_subject' => 'Reset Your Password',
            'email_password_reset_enabled' => 'true',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
