<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ServiceResource;
use App\Models\Service;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $services = Service::query()
            ->active()
            ->ordered()
            ->with('category')
            ->get();

        return $this->ok(ServiceResource::collection($services));
    }

    public function show(string $slug): JsonResponse
    {
        $service = Service::query()
            ->active()
            ->where('slug', $slug)
            ->with(['category', 'faqs'])
            ->firstOrFail();

        return $this->ok(new ServiceResource($service));
    }
}
