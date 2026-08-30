<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\CourseResource;
use App\Models\Course;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $courses = Course::query()
            ->active()
            ->ordered()
            ->with('category')
            ->get();

        return $this->ok(CourseResource::collection($courses));
    }

    public function show(string $slug): JsonResponse
    {
        $course = Course::query()
            ->active()
            ->where('slug', $slug)
            ->with('category')
            ->firstOrFail();

        return $this->ok(new CourseResource($course));
    }
}
