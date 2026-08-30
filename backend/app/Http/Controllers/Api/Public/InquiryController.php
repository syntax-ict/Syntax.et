<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreInquiryRequest;
use App\Http\Resources\Public\InquiryResource;
use App\Models\Inquiry;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Consultation, quote, and support requests (architecture §6/§7/§9).
 */
class InquiryController extends Controller
{
    use ApiResponse;

    public function store(StoreInquiryRequest $request): JsonResponse
    {
        $data = $request->validated();

        $inquiry = Inquiry::query()->create([
            'reference' => Inquiry::generateReference($data['type']),
            'type' => $data['type'],
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'organization' => $data['organization'] ?? null,
            'subject' => $data['subject'] ?? null,
            'priority' => $data['priority'] ?? 'medium',
            // Set explicitly rather than relying on the migration's DB
            // column default: Eloquent's create() returns the in-memory
            // model with only the attributes it was given, it does not
            // re-fetch column defaults for the rest.
            'status' => 'pending_review',
            'details' => $data['details'],
            'meta' => $data['meta'] ?? null,
        ]);

        return $this->created(new InquiryResource($inquiry));
    }

    /**
     * Public status lookup by reference. Deliberately returns only
     * reference/type/status via InquiryResource — never contact details,
     * `meta`, or assignment (architecture §7: anyone who knows their own
     * reference can check progress, without exposing enough to make
     * enumerating references worthwhile).
     */
    public function show(string $reference): JsonResponse
    {
        $inquiry = Inquiry::query()->where('reference', $reference)->firstOrFail();

        return $this->ok(new InquiryResource($inquiry));
    }
}
