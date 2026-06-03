<?php

namespace App\Console\Commands;

use App\Events\InvoiceOverdue;
use App\Jobs\SendInvoiceEmail;
use App\Models\Invoice;
use Illuminate\Console\Command;

class SendOverdueReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:send-overdue-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders for overdue invoices';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $overdueInvoices = Invoice::overdue()->with(['client', 'team'])->get();

        if ($overdueInvoices->isEmpty()) {
            $this->info('No overdue invoices found.');

            return;
        }

        $this->info("Found {$overdueInvoices->count()} overdue invoices. Sending reminders...");

        foreach ($overdueInvoices as $invoice) {
            // Dispatch event for logging/other listeners
            InvoiceOverdue::dispatch($invoice);

            // Queue the email
            SendInvoiceEmail::dispatch($invoice, $invoice->client, 'overdue');

            $this->line("- Sent reminder for Invoice #{$invoice->number} to {$invoice->client->email}");
        }

        $this->info('All reminders have been queued.');
    }
}
