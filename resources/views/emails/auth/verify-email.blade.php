@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $user->name }},</p>

<div class="email-content">
    <p>Thank you for creating an account with GarageKeyPro. Please verify your email address to complete your registration.</p>
</div>

<div class="text-center">
    <a href="{{ $verificationUrl }}" class="button-primary">
        Verify Email Address
    </a>
</div>

<div class="email-content mt-20">
    <p class="text-muted">
        If you did not create an account, no further action is required.
    </p>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p class="text-muted" style="font-size: 13px;">
        If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:<br>
        <span style="color: #A0AEC0; word-break: break-all;">{{ $verificationUrl }}</span>
    </p>
</div>

@endcomponent
