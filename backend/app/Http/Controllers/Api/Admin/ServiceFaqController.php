<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ServiceFaqResource;
use App\Models\Service;
use App\Models\ServiceFaq;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * FAQs are a genuinely disposable child record of a service (architecture
 * §C) — unlike the six main content resources, destroy() here is a real
 * delete, not an is_active toggle.
 */
class ServiceFaqController extends Controller
{
    use ApiResponse;

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }

    public function store(Request $request, Service $service): JsonResponse
    {
        $this->authorize('update', $service);

        $faq = $service->faqs()->create($request->validate($this->rules()));

        return $this->created(new ServiceFaqResource($faq));
    }

    public function update(Request $request, Service $service, ServiceFaq $faq): JsonResponse
    {
        $this->authorize('update', $service);
        abort_unless($faq->service_id === $service->id, 404);

        $faq->update($request->validate($this->rules()));

        return $this->ok(new ServiceFaqResource($faq));
    }

    public function destroy(Service $service, ServiceFaq $faq): JsonResponse
    {
        $this->authorize('update', $service);
        abort_unless($faq->service_id === $service->id, 404);

        $faq->delete();

        return $this->noContent();
    }
}
