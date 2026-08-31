<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreInquiryNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('addNote', $this->route('inquiry'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:3000'],
        ];
    }
}
