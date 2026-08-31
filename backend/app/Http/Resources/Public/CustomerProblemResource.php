<?php

namespace App\Http\Resources\Public;

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
            'target_user' => $this->target_user,
            'problem' => $this->problem,
            'impact' => $this->impact,
            'solution' => $this->solution_text,
            // See ServiceResource for why this is one whenLoaded() around
            // the whole object rather than per-field.
            'category' => $this->whenLoaded('category', fn () => [
                'slug' => $this->category->slug,
            ]),
        ];
    }
}
