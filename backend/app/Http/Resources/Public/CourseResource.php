<?php

namespace App\Http\Resources\Public;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Course
 */
class CourseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'duration' => $this->duration,
            'level' => $this->level,
            'mode' => $this->mode,
            'description' => $this->description,
            'syllabus' => $this->syllabus,
            'skills_gained' => $this->skills_gained,
            'target_audience' => $this->target_audience,
            'requirements' => $this->requirements,
            'modules' => $this->modules,
            'schedule' => $this->schedule,
            'location' => $this->location,
            'price' => [
                'amount' => $this->price_amount,
                'currency' => $this->price_currency,
            ],
            // See ServiceResource for why this is one whenLoaded() around
            // the whole object rather than per-field.
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'slug' => $this->category->slug,
            ] : null),
        ];
    }
}
