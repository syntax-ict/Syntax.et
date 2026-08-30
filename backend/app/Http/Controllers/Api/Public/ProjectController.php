<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ProjectResource;
use App\Models\Project;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $projects = Project::query()
            ->active()
            ->ordered()
            ->with(['category', 'images'])
            ->get();

        return $this->ok(ProjectResource::collection($projects));
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::query()
            ->active()
            ->where('slug', $slug)
            ->with(['category', 'images'])
            ->firstOrFail();

        return $this->ok(new ProjectResource($project));
    }
}
