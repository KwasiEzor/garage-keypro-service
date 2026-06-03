<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Invoice
 */
class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'number' => $this->number,

            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->getLabel(),
                'color' => $this->status->getColor(),
            ],

            'client' => [
                'id' => $this->client_id,
                'name' => $this->whenLoaded('client', fn () => $this->client->name),
                'email' => $this->whenLoaded('client', fn () => $this->client->email),
            ],

            'team' => [
                'id' => $this->team_id,
                'name' => $this->whenLoaded('team', fn () => $this->team->name),
            ],

            'items' => InvoiceItemResource::collection($this->whenLoaded('items')),

            'dates' => [
                'issued' => $this->issue_date->toDateString(),
                'due' => $this->due_date->toDateString(),
                'sent' => $this->sent_at?->toDateTimeString(),
                'paid' => $this->paid_at?->toDateTimeString(),
                'created' => $this->created_at->toDateTimeString(),
                'updated' => $this->updated_at->toDateTimeString(),
            ],

            'amounts' => [
                'subtotal' => (float) $this->subtotal,
                'tax_rate' => (float) $this->tax_rate,
                'tax_total' => (float) $this->tax_total,
                'total' => (float) $this->total_amount,
                'paid' => (float) $this->amount_paid,
                'currency' => $this->currency,
            ],

            'payment' => [
                'method' => $this->payment_method,
                'reference' => $this->payment_reference,
            ],

            'notes' => $this->notes,

            'can' => [
                'view' => $request->user()?->can('view', $this->resource) ?? false,
                'update' => $request->user()?->can('update', $this->resource) ?? false,
                'delete' => $request->user()?->can('delete', $this->resource) ?? false,
                'send' => $request->user()?->can('send', $this->resource) ?? false,
                'markAsPaid' => $request->user()?->can('markAsPaid', $this->resource) ?? false,
                'cancel' => $request->user()?->can('cancel', $this->resource) ?? false,
                'download' => $request->user()?->can('download', $this->resource) ?? false,
            ],
        ];
    }
}
