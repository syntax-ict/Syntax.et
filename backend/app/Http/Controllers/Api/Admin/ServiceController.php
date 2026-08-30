<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\Admin\ServiceResource;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class ServiceController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Service::class;
    }

    protected function resourceClass(): string
    {
        return ServiceResource::class;
    }

    protected function with(): array
    {
        return ['category', 'faqs'];
    }

    protected function rules(?Model $existing): array
    {
        return [
            'solution_category_id' => ['required', 'integer', 'exists:solution_categories,id'],
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/', Rule::unique('services', 'slug')->ignore($existing?->id)],
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'icon' => ['required', 'string', 'max:60'],
            'benefits' => ['sometimes', 'array'],
            'benefits.*' => ['string'],
            'is_featured' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
