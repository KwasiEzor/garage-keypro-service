<?php

namespace App\Http\Requests;

use App\Models\Service;
use App\Models\Team;
use App\Services\AppointmentService;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'team_id' => ['required', 'integer', 'exists:teams,id'],
            'service_id' => ['required', 'integer', 'exists:services,id,is_active,1'],
            'date' => ['required', 'date', 'after_or_equal:today', 'before:'.now()->addDays(90)->format('Y-m-d')],
            'slot' => ['required', 'string', 'regex:/^\d{2}:\d{2}$/'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            // Check if slot is actually available
            $team = Team::find($this->team_id);
            $service = Service::find($this->service_id);
            $date = Carbon::parse($this->date);

            if (! $team || ! $service) {
                return;
            }

            $appointmentService = app(AppointmentService::class);
            $slots = $appointmentService->getAvailableSlots($team, $date, $service);

            $slotExists = $slots->contains('start_time', $this->slot);

            if (! $slotExists) {
                $validator->errors()->add('slot', 'The selected time slot is no longer available.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'service_id.exists' => 'The selected service is not available.',
            'date.before' => 'Appointments can only be booked up to 90 days in advance.',
            'slot.regex' => 'The time slot must be in HH:MM format.',
        ];
    }
}
