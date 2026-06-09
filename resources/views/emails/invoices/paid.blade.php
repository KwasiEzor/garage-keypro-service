@component('emails.layouts.branded')

<p class="email-greeting">Hello {{ $invoice->customer_name ?? 'Valued Customer' }},</p>

<div class="email-content">
    <p>Thank you for your payment! This email confirms that we have received your payment for invoice #{{ $invoice->number }}.</p>
</div>

<div class="info-box">
    <div class="info-box-title">✅ Payment Received</div>
    <table class="detail-table">
        <tr>
            <td>Invoice Number</td>
            <td><strong>{{ $invoice->number }}</strong></td>
        </tr>
        <tr>
            <td>Payment Date</td>
            <td>{{ now()->format('F j, Y') }}</td>
        </tr>
        <tr>
            <td>Amount Paid</td>
            <td><strong>${{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}</strong></td>
        </tr>
        <tr>
            <td>Payment Method</td>
            <td>{{ $paymentMethod ?? 'Online Payment' }}</td>
        </tr>
    </table>
</div>

<div class="text-center">
    <a href="{{ config('app.url') }}/invoices/{{ $invoice->uuid }}" class="button-primary">
        Download Receipt
    </a>
</div>

<div class="email-content mt-20">
    <p class="text-muted">
        A receipt has been attached to this email for your records. If you have any questions about this payment, please don't hesitate to contact us.
    </p>
</div>

@endcomponent
