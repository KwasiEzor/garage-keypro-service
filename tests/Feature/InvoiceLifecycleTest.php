<?php

declare(strict_types=1);

use App\Enums\InvoiceStatus;
use App\Events\InvoiceCancelled;
use App\Events\InvoiceCreated;
use App\Events\InvoicePaid;
use App\Events\InvoiceSent;
use App\Events\InvoiceStatusChanged;
use App\Exceptions\InvalidInvoiceStateException;
use App\Models\Activity;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Team;
use App\Models\User;
use App\Support\InvoiceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

test('complete invoice lifecycle: draft to sent to paid', function (): void {
    $service = app(InvoiceService::class);
    $team = Team::factory()->create();
    $client = User::factory()->create();

    // Create draft invoice
    Event::fake([InvoiceCreated::class]);

    $invoice = Invoice::factory()->create([
        'team_id' => $team->id,
        'client_id' => $client->id,
        'status' => InvoiceStatus::Draft,
    ]);

    InvoiceItem::factory()->create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit_price' => 100,
    ]);

    expect($invoice->status)->toBe(InvoiceStatus::Draft)
        ->and($invoice->sent_at)->toBeNull()
        ->and($invoice->paid_at)->toBeNull();

    Event::assertDispatched(InvoiceCreated::class);

    // Fake other events for state transitions
    Event::fake();

    // Mark as sent
    $service->markAsSent($invoice);
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Sent)
        ->and($invoice->sent_at)->not->toBeNull();

    Event::assertDispatched(InvoiceSent::class);
    Event::assertDispatched(InvoiceStatusChanged::class, function ($event) use ($invoice) {
        return $event->invoice->id === $invoice->id
            && $event->oldStatus === InvoiceStatus::Draft
            && $event->newStatus === InvoiceStatus::Sent;
    });

    // Mark as paid
    $service->markAsPaid($invoice, 'bank_transfer', null, 'REF-12345');
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice->paid_at)->not->toBeNull()
        ->and($invoice->payment_method)->toBe('bank_transfer')
        ->and($invoice->payment_reference)->toBe('REF-12345')
        ->and($invoice->amount_paid)->toBe('100.00');

    Event::assertDispatched(InvoicePaid::class);
    Event::assertDispatched(InvoiceStatusChanged::class, function ($event) use ($invoice) {
        return $event->invoice->id === $invoice->id
            && $event->oldStatus === InvoiceStatus::Sent
            && $event->newStatus === InvoiceStatus::Paid;
    });
});

test('invoice can be cancelled from draft status', function (): void {
    Event::fake();

    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Draft]);

    $service->markAsCancelled($invoice);
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Cancelled);

    Event::assertDispatched(InvoiceCancelled::class);
    Event::assertDispatched(InvoiceStatusChanged::class);
});

test('invoice status remains sent if partially paid', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'total_amount' => 1000.00,
        'amount_paid' => 0,
    ]);

    $service->markAsPaid($invoice, 'bank_transfer', 400.00);
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Sent)
        ->and($invoice->amount_paid)->toBe('400.00')
        ->and($invoice->payments)->toHaveCount(1)
        ->and($invoice->payments->first()->amount)->toBe('400.00');
});

test('invoice status becomes paid when fully paid via multiple payments', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'total_amount' => 1000.00,
        'amount_paid' => 0,
    ]);

    $service->markAsPaid($invoice, 'bank_transfer', 600.00);
    $invoice->refresh();
    expect($invoice->status)->toBe(InvoiceStatus::Sent);

    $service->markAsPaid($invoice, 'cash', 400.00);
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice->amount_paid)->toBe('1000.00')
        ->and($invoice->payments)->toHaveCount(2);
});

test('invoice can be cancelled from sent status', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Sent]);

    $service->markAsCancelled($invoice);
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Cancelled);
});

test('paid invoice cannot be cancelled', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Paid]);

    expect(fn () => $service->markAsCancelled($invoice))
        ->toThrow(InvalidInvoiceStateException::class);
});

test('sent invoice cannot be marked as sent again', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Sent]);

    expect(fn () => $service->markAsSent($invoice))
        ->toThrow(InvalidInvoiceStateException::class);
});

test('cancelled invoice cannot be sent', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Cancelled]);

    expect(fn () => $service->markAsSent($invoice))
        ->toThrow(InvalidInvoiceStateException::class);
});

test('cancelled invoice cannot be marked as paid', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Cancelled]);

    expect(fn () => $service->markAsPaid($invoice, 'cash'))
        ->toThrow(InvalidInvoiceStateException::class);
});

test('paid invoice cannot be marked as paid again', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Paid]);

    expect(fn () => $service->markAsPaid($invoice, 'cash'))
        ->toThrow(InvalidInvoiceStateException::class);
});

test('draft invoice can be marked as paid directly', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Draft]);

    $service->markAsPaid($invoice, 'cash', 50.00);
    $invoice->refresh();

    expect($invoice->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice->payment_method)->toBe('cash')
        ->and((float) $invoice->amount_paid)->toBe(50.00);
});

test('marking invoice as paid uses total_amount if amount_paid not provided', function (): void {
    $service = app(InvoiceService::class);
    $invoice = Invoice::factory()->create([
        'status' => InvoiceStatus::Sent,
        'total_amount' => 250.50,
    ]);

    $service->markAsPaid($invoice, 'card');
    $invoice->refresh();

    expect((float) $invoice->amount_paid)->toBe(250.50);
});

test('invoice events are logged to activity log', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $invoice = Invoice::factory()->create();

    $activities = Activity::where('subject_type', Invoice::class)
        ->where('subject_id', $invoice->id)
        ->get();

    expect($activities)->toHaveCount(2) // Created + StatusChanged
        ->and($activities->first()->description)->toContain('created');
});

test('user can only update draft invoices', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Draft,
    ]);

    expect($user->can('update', $invoice))->toBeTrue();

    $invoice->update(['status' => InvoiceStatus::Sent]);

    expect($user->can('update', $invoice))->toBeFalse();
});

test('user can send draft invoice if they belong to team', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Draft,
    ]);

    expect($user->can('send', $invoice))->toBeTrue();
});

test('user cannot send already sent invoice', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Sent,
    ]);

    expect($user->can('send', $invoice))->toBeFalse();
});

test('user can mark draft invoice as paid if they belong to team', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Draft,
    ]);

    expect($user->can('markAsPaid', $invoice))->toBeTrue();
});

test('user can cancel draft or sent invoice', function (): void {
    $user = User::factory()->create();
    $draftInvoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Draft,
    ]);
    $sentInvoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Sent,
    ]);

    expect($user->can('cancel', $draftInvoice))->toBeTrue()
        ->and($user->can('cancel', $sentInvoice))->toBeTrue();
});

test('user cannot cancel paid invoice', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'team_id' => $user->personalTeam()->id,
        'status' => InvoiceStatus::Paid,
    ]);

    expect($user->can('cancel', $invoice))->toBeFalse();
});

test('admin can perform all actions on any invoice', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $invoice = Invoice::factory()->create(['status' => InvoiceStatus::Sent]);

    expect($admin->can('view', $invoice))->toBeTrue()
        ->and($admin->can('update', $invoice))->toBeTrue()
        ->and($admin->can('delete', $invoice))->toBeTrue()
        ->and($admin->can('send', $invoice))->toBeTrue()
        ->and($admin->can('cancel', $invoice))->toBeTrue();
});
