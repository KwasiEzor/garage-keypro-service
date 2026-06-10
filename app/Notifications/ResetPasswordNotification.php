<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $token
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        $expirationMinutes = config('auth.passwords.'.config('auth.defaults.passwords').'.expire');

        $subject = Setting::get(
            'email_password_reset_subject',
            'Reset Your Password'
        );

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.auth.password-reset', [
                'user' => $notifiable,
                'resetUrl' => $resetUrl,
                'expirationMinutes' => $expirationMinutes,
            ]);
    }
}
