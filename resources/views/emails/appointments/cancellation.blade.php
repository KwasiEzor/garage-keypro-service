@component('emails.layouts.branded')

<p class="email-greeting">Appointment Cancelled</p>

<div class="email-content">
    <p>Hello,</p>
    <p>This email is to confirm that your appointment for <strong>{{ $appointment->service->name }}</strong> has been cancelled.</p>
</div>

<table class="detail-table">
    <tr>
        <td>Service</td>
        <td>{{ $appointment->service->name ?? 'N/A' }}</td>
    </tr>
    <tr>
        <td>Original Date & Time</td>
        <td>{{ $appointment->start_at->format('l, F j, Y') }} at {{ $appointment->start_at->format('g:i A') }}</td>
    </tr>
    @if($cancellationReason ?? null)
    <tr>
        <td>Reason for Cancellation</td>
        <td>{{ $cancellationReason }}</td>
    </tr>
    @endif
</table>

<div class="info-box">
    <div class="info-box-title">Need to Book Again?</div>
    <div class="info-box-content">
        If this was a mistake or you'd like to choose a different time, you can easily book a new appointment on our website.
    </div>
</div>

<div class="text-center">
    <a href="{{ url('/appointments') }}" class="button-primary">Book New Appointment</a>
</div>

<p class="text-muted text-center mt-20">
    If you have any questions, please contact our support team.
</p>

@endcomponent
