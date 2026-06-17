@component('emails.layouts.branded')

<p class="email-greeting">New Invoice #{{ $invoice->number }}</p>

<div class="email-content">
    <p>Hello,</p>
    <p>A new invoice has been generated for your recent service with <strong>{{ $invoice->team->name }}</strong>. Please find the summary below.</p>
</div>

<div class="info-box" style="text-align: center;">
    <div class="info-box-title">Amount Due</div>
    <div class="info-box-content" style="font-size: 28px; font-weight: 700; color: {{ \App\Models\Setting::get('email_primary_color', '#4C8BF5') }};">
        ${{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}
    </div>
</div>

<table class="detail-table">
    <tr>
        <td>Invoice Number</td>
        <td>#{{ $invoice->number }}</td>
    </tr>
    <tr>
        <td>Issue Date</td>
        <td>{{ $invoice->issue_date->format('M j, Y') }}</td>
    </tr>
    <tr>
        <td>Due Date</td>
        <td><strong>{{ $invoice->due_date->format('M j, Y') }}</strong></td>
    </tr>
    <tr>
        <td>Status</td>
        <td><span style="color: {{ $invoice->status->value === 'overdue' ? '#E53E3E' : '#D69E2E' }}; font-weight: 600;">{{ strtoupper($invoice->status->value) }}</span></td>
    </tr>
</table>

<div class="text-center">
    <a href="{{ route('invoices.show', $invoice->uuid) }}" class="button-primary">Review & Pay Invoice</a>
</div>

<div class="email-divider"></div>

<p class="text-muted text-center">
    For your convenience, a PDF copy of this invoice is attached to this email.
</p>

@endcomponent
