<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\SolutionCategoryResource;
use App\Models\SolutionCategory;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class SolutionCategoryController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $categories = SolutionCategory::query()
            ->active()
            ->ordered()
            ->with(['services' => fn ($q) => $q->active()->ordered()])
            ->get();

        return $this->ok(SolutionCategoryResource::collection($categories));
    }

    public function show(string $slug): JsonResponse
    {
        $category = SolutionCategory::query()
            ->active()
            ->where('slug', $slug)
            ->with(['services' => fn ($q) => $q->active()->ordered()->with('faqs')])
            ->firstOrFail();

        return $this->ok(new SolutionCategoryResource($category));
    }
}
