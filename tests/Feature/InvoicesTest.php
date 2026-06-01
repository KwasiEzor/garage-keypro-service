<?php

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can view their own invoices in dashboard', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'client_id' => $user->id,
        'team_id' => $user->personalTeam()->id,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.invoices.index'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Invoices/Index')
            ->has('invoices.data', 1)
        );
});

test('user can view their own specific invoice', function (): void {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'client_id' => $user->id,
        'team_id' => $user->personalTeam()->id,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.invoices.show', $invoice->uuid))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Invoices/Show')
            ->where('invoice.number', $invoice->number)
        );
});

test('user cannot view others invoices in dashboard', function (): void {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $invoice = Invoice::factory()->create([
        'client_id' => $otherUser->id,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.invoices.show', $invoice->uuid))
        ->assertStatus(403);
});

test('anyone can view invoice via public uuid', function (): void {
    $invoice = Invoice::factory()->create();
    InvoiceItem::factory()->count(3)->create(['invoice_id' => $invoice->id]);

    $this->get(route('invoices.show', $invoice->uuid))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Invoices/Show')
            ->where('invoice.uuid', $invoice->uuid)
            ->has('invoice.items', 3)
        );
});
