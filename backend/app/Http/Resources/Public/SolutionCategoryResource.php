<?php

namespace App\Http\Resources\Public;

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
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
