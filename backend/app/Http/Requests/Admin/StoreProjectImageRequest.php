<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation rules for uploading a project photo (architecture §10).
 * Prepared in Phase 4 alongside the rest of this application's validation
 * hardening; the admin upload route/controller that uses it (storing via
 * `Storage::disk('public')` with a server-generated filename) is built in
 * Phase 5's content management work — there is nothing to upload to yet.
 */
class StoreProjectImageRequest extends FormRequest
{
    /**
     * Real authorization (admin role) is added when Phase 5 wires this to
     * a route — there is no route to protect yet, so this stays neutral
     * rather than silently granting or guessing an access rule.
     */
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
            'image' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120', // 5MB, in kilobytes (architecture §10)
                'dimensions:min_width=800,min_height=600',
            ],
            'alt_text' => ['required', 'string', 'max:200'],
        ];
    }
}
