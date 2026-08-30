<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreCourseRegistrationRequest;
use App\Http\Resources\Public\CourseRegistrationResource;
use App\Models\CourseRegistration;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class CourseRegistrationController extends Controller
{
    use ApiResponse;

    public function store(StoreCourseRegistrationRequest $request): JsonResponse
    {
        // `status` is set explicitly rather than relying on the migration's
        // DB column default: Eloquent's create() returns the in-memory
        // model with only the attributes it was given.
        $registration = CourseRegistration::query()->create([
            ...$request->validated(),
            'status' => 'pending',
        ]);
        $registration->load('course');

        return $this->created(new CourseRegistrationResource($registration));
    }
}
