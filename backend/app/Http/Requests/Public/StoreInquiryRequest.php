<?php

namespace App\Http\Requests\Public;

use App\Http\Requests\Public\Concerns\HasHoneypot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Backs consultation, quote, and support submissions (architecture §6).
 * Fields shared by all three are top-level; type-specific extras live under
 * `meta` and are validated conditionally on `type`.
 */
class StoreInquiryRequest extends FormRequest
{
    use HasHoneypot;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...$this->honeypotRules(),
            'type' => ['required', Rule::in(['consultation', 'quote', 'support'])],
            'full_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9 ()\-]{7,20}$/'],
            'organization' => ['nullable', 'string', 'max:150'],
            'details' => ['required', 'string', 'max:3000'],
            'subject' => ['required_if:type,support', 'nullable', 'string', 'max:200'],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high', 'urgent'])],

            'meta' => ['sometimes', 'array'],
            'meta.problem_area' => ['required_if:type,consultation', 'nullable', 'string', 'max:150'],
            'meta.budget' => ['nullable', 'string', 'max:100'],
            'meta.selected_services' => ['required_if:type,quote', 'nullable', 'array', 'min:1'],
            'meta.selected_services.*' => ['string', 'exists:services,slug'],
            'meta.quantity' => ['nullable', 'integer', 'min:1', 'max:500'],
            'meta.timeline' => ['nullable', 'string', 'max:100'],
            'meta.is_priority' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'meta.problem_area.required_if' => 'Please select a problem area for your consultation request.',
            'meta.selected_services.required_if' => 'Please select at least one service for your quote request.',
            'subject.required_if' => 'Please provide a subject for your support request.',
        ];
    }
}
