<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectImageRequest;
use App\Http\Resources\Admin\ProjectImageResource;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * The upload endpoint that consumes the file-validation rules prepared in
 * Phase 4 (architecture §10). Images are genuinely disposable child
 * records (like FAQs) — destroy() is a real delete, including the stored
 * file, not an is_active toggle.
 */
class ProjectImageController extends Controller
{
    use ApiResponse;

    public function store(StoreProjectImageRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        // Storage::putFile() generates a random filename itself — the
        // client's original filename is never trusted or stored
        // (architecture §10).
        $path = $request->file('image')->store('project-images', 'public');

        $image = $project->images()->create([
            'disk_path' => $path,
            'alt_text' => $request->validated('alt_text'),
            'sort_order' => $project->images()->count(),
        ]);

        return $this->created(new ProjectImageResource($image));
    }

    public function destroy(Project $project, ProjectImage $image): JsonResponse
    {
        $this->authorize('update', $project);
        abort_unless($image->project_id === $project->id, 404);

        Storage::disk('public')->delete($image->disk_path);
        $image->delete();

        return $this->noContent();
    }
}
