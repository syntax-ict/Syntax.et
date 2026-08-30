<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\Admin\CustomerProblemResource;
use App\Models\CustomerProblem;
use Illuminate\Database\Eloquent\Model;

class CustomerProblemController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return CustomerProblem::class;
    }

    protected function resourceClass(): string
    {
        return CustomerProblemResource::class;
    }

    protected function rules(?Model $existing): array
    {
        return [
            'solution_category_id' => ['required', 'integer', 'exists:solution_categories,id'],
            'target_user' => ['required', 'string', 'max:255'],
            'problem' => ['required', 'string', 'max:255'],
            'impact' => ['required', 'string'],
            'solution_text' => ['required', 'string'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
