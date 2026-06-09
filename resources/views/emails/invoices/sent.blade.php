@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $invoice->customer_name ?? 'Valued Customer' }},</p>

<div class="email-content">
    <p>Thank you for choosing GarageKeyPro. Please find your invoice details below.</p>
</div>

<div class="info-box">
    <div class="info-box-title">Invoice #{{ $invoice->number }}</div>
    <table class="detail-table">
        <tr>
            <td>Invoice Number</td>
            <td><strong>{{ $invoice->number }}</strong></td>
        </tr>
        <tr>
            <td>Issue Date</td>
            <td>{{ $invoice->issue_date->format('F j, Y') }}</td>
        </tr>
        <tr>
            <td>Due Date</td>
            <td><strong>{{ $invoice->due_date->format('F j, Y') }}</strong></td>
        </tr>
        <tr>
            <td>Status</td>
            <td>{{ ucfirst($invoice->status) }}</td>
        </tr>
    </table>
</div>

<div class="email-content">
    <p><strong>Amount Due:</strong></p>
    <h2 style="color: {{ Setting::get('email_primary_color', '#4C8BF5') }}; font-size: 32px; margin: 10px 0;">
        ${{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}
    </h2>
</div>

<div class="text-center">
    <a href="{{ config('app.url') }}/invoices/{{ $invoice->uuid }}" class="button-primary">
        View & Pay Invoice
    </a>
</div>

<div class="email-divider"></div>

<div class="email-content">
    <p class="text-muted">
        Payment is due by {{ $invoice->due_date->format('F j, Y') }}. You can view and pay your invoice online using the button above.
    </p>
</div>

@endcomponent
