<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCourseRegistrationRequest;
use App\Http\Resources\Admin\CourseRegistrationResource;
use App\Models\CourseRegistration;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Course management (registrations): architecture §5. Course catalog CRUD
 * itself lives in Api\Admin\CourseController (content management).
 */
class CourseRegistrationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CourseRegistration::class);

        $registrations = CourseRegistration::query()
            ->with('course')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('course_id'), fn ($q) => $q->where('course_id', $request->integer('course_id')))
            ->latest()
            ->paginate(20);

        return $this->ok(CourseRegistrationResource::collection($registrations));
    }

    public function show(CourseRegistration $course_registration): JsonResponse
    {
        $this->authorize('view', $course_registration);
        $course_registration->load('course');

        return $this->ok(new CourseRegistrationResource($course_registration));
    }

    public function update(UpdateCourseRegistrationRequest $request, CourseRegistration $course_registration): JsonResponse
    {
        $course_registration->update($request->validated());
        $course_registration->load('course');

        return $this->ok(new CourseRegistrationResource($course_registration));
    }
}
