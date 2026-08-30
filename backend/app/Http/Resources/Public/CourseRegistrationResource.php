<?php

namespace App\Http\Resources\Public;

use App\Models\CourseRegistration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CourseRegistration
 */
class CourseRegistrationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'course' => $this->whenLoaded('course', fn () => [
                'title' => $this->course->title,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
