<?php

namespace App\Http\Resources\Admin;

use App\Models\SolutionCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SolutionCategory
 */
class SolutionCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'detailed_description' => $this->detailed_description,
            'icon' => $this->icon,
            'color_theme' => [
                'primary' => $this->color_primary,
                'bg' => $this->color_bg,
                'border' => $this->color_border,
                'accent' => $this->color_accent,
            ],
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
