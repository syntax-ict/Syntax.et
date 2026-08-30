<?php

namespace App\Http\Requests\Public;

use App\Http\Requests\Public\Concerns\HasHoneypot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRegistrationRequest extends FormRequest
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
            'course_id' => ['required', 'integer', Rule::exists('courses', 'id')->where('is_active', true)],
            'full_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9 ()\-]{7,20}$/'],
            'organization' => ['nullable', 'string', 'max:150'],
            'training_mode' => ['required', Rule::in(['online', 'face_to_face', 'corporate'])],
            'experience_level' => ['required', 'string', 'max:120'],
            'goals' => ['required', 'string', 'max:1500'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function messages(): array
    {
        return [
            'course_id.exists' => 'The selected course is not available for registration.',
        ];
    }
}
