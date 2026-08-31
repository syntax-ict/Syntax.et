<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\Admin\CourseResource;
use App\Models\Course;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class CourseController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Course::class;
    }

    protected function resourceClass(): string
    {
        return CourseResource::class;
    }

    protected function orderBy(): string
    {
        return 'sort_order';
    }

    protected function rules(?Model $existing): array
    {
        return [
            'solution_category_id' => ['nullable', 'integer', 'exists:solution_categories,id'],
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('courses', 'slug')->ignore($existing?->id)],
            'title' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'string', 'max:255'],
            'level' => ['required', Rule::in(['beginner', 'intermediate', 'advanced', 'all_levels'])],
            'mode' => ['required', Rule::in(['online', 'face_to_face', 'corporate'])],
            'description' => ['required', 'string'],
            'syllabus' => ['required', 'array', 'min:1'],
            'syllabus.*' => ['string'],
            'skills_gained' => ['required', 'array', 'min:1'],
            'skills_gained.*' => ['string'],
            'target_audience' => ['nullable', 'array'],
            'requirements' => ['nullable', 'array'],
            'modules' => ['nullable', 'array'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'price_amount' => ['nullable', 'numeric', 'min:0'],
            'price_currency' => ['nullable', 'string', 'size:3'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
