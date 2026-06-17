@component('emails.layouts.branded')

<p class="email-greeting">Welcome to GarageKeyPro, {{ $user->name }}!</p>

<div class="email-content">
    <p>{{ \App\Models\Setting::get('email_welcome_message', 'Thank you for choosing GarageKeyPro for your automotive locksmith needs. We\'re committed to providing you with exceptional service.') }}</p>

    <p>With your new account, you can:</p>
    <ul>
        <li>Book and manage appointments online</li>
        <li>Track your service history</li>
        <li>View and pay invoices</li>
        <li>Save vehicle information for faster booking</li>
        <li>Receive appointment reminders and updates</li>
    </ul>
</div>

<div class="text-center">
    <a href="{{ config('app.url') }}/dashboard" class="button-primary">
        Go to Dashboard
    </a>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p><strong>Need help getting started?</strong></p>
    <p>Our team is here to assist you. Feel free to reach out if you have any questions about our services.</p>
</div>

@endcomponent
