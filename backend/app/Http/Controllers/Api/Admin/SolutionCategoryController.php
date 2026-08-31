<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\Admin\SolutionCategoryResource;
use App\Models\SolutionCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class SolutionCategoryController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return SolutionCategory::class;
    }

    protected function resourceClass(): string
    {
        return SolutionCategoryResource::class;
    }

    protected function rules(?Model $existing): array
    {
        return [
            'slug' => ['required', 'string', 'max:80', 'regex:/^[a-z0-9-]+$/', Rule::unique('solution_categories', 'slug')->ignore($existing?->id)],
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'detailed_description' => ['required', 'string'],
            'icon' => ['required', 'string', 'max:60'],
            'color_primary' => ['required', 'string', 'max:60'],
            'color_bg' => ['required', 'string', 'max:60'],
            'color_border' => ['required', 'string', 'max:60'],
            'color_accent' => ['required', 'string', 'max:60'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
