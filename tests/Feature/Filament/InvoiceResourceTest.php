<?php

namespace Tests\Feature\Filament;

use App\Filament\Resources\Invoices\Pages\CreateInvoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

it('can load the create invoice page', function () {
    $this->actingAs(User::factory()->create());

    Livewire::test(CreateInvoice::class)
        ->assertOk();
});
