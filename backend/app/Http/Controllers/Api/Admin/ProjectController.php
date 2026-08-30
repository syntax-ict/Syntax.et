<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\Admin\ProjectResource;
use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class ProjectController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Project::class;
    }

    protected function resourceClass(): string
    {
        return ProjectResource::class;
    }

    protected function with(): array
    {
        return ['images'];
    }

    protected function rules(?Model $existing): array
    {
        return [
            'solution_category_id' => ['nullable', 'integer', 'exists:solution_categories,id'],
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('projects', 'slug')->ignore($existing?->id)],
            'title' => ['required', 'string', 'max:255'],
            'client_type' => ['required', Rule::in(['government', 'private_enterprise', 'retail_hub', 'corporate_office'])],
            'industry' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'challenge' => ['nullable', 'string'],
            'solution_detail' => ['nullable', 'string'],
            'outcome' => ['nullable', 'string'],
            'scope_of_implementation' => ['nullable', 'array'],
            'technologies_involved' => ['nullable', 'array'],
            'deliverables' => ['required', 'array', 'min:1'],
            'deliverables.*' => ['string'],
            'results' => ['required', 'array', 'min:1'],
            'results.*' => ['string'],
            'is_featured' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
