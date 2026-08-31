<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PageResource;
use App\Models\Page;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    use ApiResponse;

    public function show(string $slug): JsonResponse
    {
        $page = Page::query()->where('slug', $slug)->where('is_published', true)->firstOrFail();

        return $this->ok(new PageResource($page));
    }
}
