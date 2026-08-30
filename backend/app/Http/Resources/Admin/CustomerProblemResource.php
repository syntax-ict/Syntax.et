<?php

namespace App\Http\Resources\Admin;

use App\Models\CustomerProblem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CustomerProblem
 */
class CustomerProblemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'solution_category_id' => $this->solution_category_id,
            'target_user' => $this->target_user,
            'problem' => $this->problem,
            'impact' => $this->impact,
            'solution_text' => $this->solution_text,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
