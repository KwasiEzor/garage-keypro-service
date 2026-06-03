<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            // Tax tracking
            $table->decimal('tax_rate', 5, 2)->default(0)->after('subtotal');

            // Status timestamps
            $table->timestamp('sent_at')->nullable()->after('status');
            $table->timestamp('paid_at')->nullable()->after('sent_at');

            // Payment tracking
            $table->string('payment_method')->nullable()->after('paid_at');
            $table->string('payment_reference')->nullable()->after('payment_method');
            $table->decimal('amount_paid', 15, 2)->default(0)->after('total_amount');

            // Performance indexes (status index already exists)
            $table->index('due_date');
            $table->index(['status', 'due_date'], 'idx_invoices_overdue');
        });

        Schema::table('invoice_items', function (Blueprint $table): void {
            // Per-item tax support
            $table->decimal('tax_rate', 5, 2)->nullable()->after('total_price');
            $table->decimal('tax_amount', 15, 2)->default(0)->after('tax_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropIndex(['idx_invoices_overdue']);
            $table->dropIndex(['invoices_due_date_index']);
            $table->dropColumn([
                'tax_rate',
                'sent_at',
                'paid_at',
                'payment_method',
                'payment_reference',
                'amount_paid',
            ]);
        });

        Schema::table('invoice_items', function (Blueprint $table): void {
            $table->dropColumn(['tax_rate', 'tax_amount']);
        });
    }
};
