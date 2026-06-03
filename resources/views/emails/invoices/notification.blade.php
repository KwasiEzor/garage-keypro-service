<x-mail::message>
# {{ $type === 'paid' ? 'Payment Receipt' : 'Invoice Notification' }}

@if($type === 'created')
A new draft invoice **#{{ $invoice->number }}** has been created for your review.
@elseif($type === 'sent')
You have received a new invoice **#{{ $invoice->number }}** from **{{ $invoice->team->name }}**.
@elseif($type === 'paid')
Thank you for your payment for invoice **#{{ $invoice->number }}**.
@elseif($type === 'overdue')
This is a reminder that invoice **#{{ $invoice->number }}** is now overdue. Please arrange payment as soon as possible.
@endif

<x-mail::table>
| Description | Amount |
| :--- | :--- |
| **Invoice Number** | {{ $invoice->number }} |
| **Issue Date** | {{ $invoice->issue_date->toFormattedDateString() }} |
| **Due Date** | {{ $invoice->due_date->toFormattedDateString() }} |
| **Total Amount** | **{{ number_format($invoice->total_amount, 2) }} {{ $invoice->currency }}** |
</x-mail::table>

@if($type === 'sent' || $type === 'overdue')
<x-mail::button :url="config('app.url') . '/invoices/' . $invoice->uuid">
View Invoice
</x-mail::button>
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
