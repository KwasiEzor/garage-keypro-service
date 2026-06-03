<?php

namespace App\Http\Requests;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvoiceStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $invoice = $this->route('invoice');

        if (! $invoice instanceof Invoice) {
            return false;
        }

        return $this->user()?->can('update', $invoice) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::enum(InvoiceStatus::class),
            ],
            'payment_method' => [
                Rule::requiredIf($this->input('status') === InvoiceStatus::Paid->value),
                'nullable',
                'string',
                'max:255',
            ],
            'payment_reference' => ['nullable', 'string', 'max:255'],
            'amount_paid' => [
                Rule::requiredIf($this->input('status') === InvoiceStatus::Paid->value),
                'nullable',
                'numeric',
                'min:0',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'payment_method.required' => 'Payment method is required when marking invoice as paid.',
            'amount_paid.required' => 'Payment amount is required when marking invoice as paid.',
        ];
    }
}
