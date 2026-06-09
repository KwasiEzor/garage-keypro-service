@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $user->name }},</p>

<div class="email-content">
    <p>You are receiving this email because we received a password reset request for your account.</p>
</div>

<div class="text-center">
    <a href="{{ $resetUrl }}" class="button-primary">
        Reset Password
    </a>
</div>

<div class="email-content mt-20">
    <p>This password reset link will expire in {{ $expirationMinutes ?? 60 }} minutes.</p>

    <p class="text-muted">
        If you did not request a password reset, no further action is required. Your account remains secure.
    </p>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p class="text-muted" style="font-size: 13px;">
        If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:<br>
        <span style="color: #A0AEC0; word-break: break-all;">{{ $resetUrl }}</span>
    </p>
</div>

@endcomponent
