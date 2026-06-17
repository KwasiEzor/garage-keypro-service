@component('emails.layouts.branded')

<p class="email-greeting">Appointment Rescheduled</p>

<div class="email-content">
    <p>Hello,</p>
    <p>Your appointment has been successfully moved to a new time. Please review the updated details below.</p>
</div>

<table class="detail-table">
    <tr>
        <td>Service</td>
        <td><strong>{{ $appointment->service->name ?? 'N/A' }}</strong></td>
    </tr>
    <tr>
        <td>New Date & Time</td>
        <td><strong>{{ $appointment->start_at->format('l, F j, Y') }} at {{ $appointment->start_at->format('g:i A') }}</strong></td>
    </tr>
    @if($oldDate ?? null)
    <tr>
        <td>Previous Date</td>
        <td style="text-decoration: line-through; color: #A0AEC0;">{{ $oldDate->format('l, F j, Y') }} at {{ $oldDate->format('g:i A') }}</td>
    </tr>
    @endif
    <tr>
        <td>Location</td>
        <td>{{ $appointment->team->name }}</td>
    </tr>
</table>

<div class="info-box">
    <div class="info-box-title">Sync Your Calendar</div>
    <div class="info-box-content">
        Don't forget to update your calendar! A new calendar invite (.ics) is attached to this email.
    </div>
</div>

<div class="text-center">
    <a href="{{ url('/my-appointments') }}" class="button-primary">View My Appointments</a>
</div>

@endcomponent
