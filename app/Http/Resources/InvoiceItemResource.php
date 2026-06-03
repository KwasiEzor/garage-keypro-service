<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InvoiceItem
 */
class InvoiceItemResource extends JsonResource
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
            'invoice_id' => $this->invoice_id,
            'service_id' => $this->service_id,
            'description' => $this->description,

            'service' => [
                'id' => $this->service_id,
                'name' => $this->whenLoaded('service', fn () => $this->service?->name),
            ],

            'pricing' => [
                'quantity' => (float) $this->quantity,
                'unit_price' => (float) $this->unit_price,
                'total_price' => (float) $this->total_price,
                'tax_rate' => $this->tax_rate ? (float) $this->tax_rate : null,
                'tax_amount' => (float) $this->tax_amount,
            ],

            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
