<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\CustomerProblemResource;
use App\Models\CustomerProblem;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class CustomerProblemController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $problems = CustomerProblem::query()
            ->active()
            ->ordered()
            ->with('category')
            ->get();

        return $this->ok(CustomerProblemResource::collection($problems));
    }
}
