<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInquiryNoteRequest;
use App\Http\Requests\Admin\UpdateInquiryRequest;
use App\Http\Resources\Admin\InquiryNoteResource;
use App\Http\Resources\Admin\InquiryResource;
use App\Models\Inquiry;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Lead management (architecture §6/§7/§9): staff work consultation, quote,
 * and support requests through one shared ticket workflow.
 */
class InquiryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Inquiry::class);

        $inquiries = Inquiry::query()
            ->with('assignee')
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('assigned_to'), fn ($q) => $q->where('assigned_to', $request->integer('assigned_to')))
            ->latest()
            ->paginate(20);

        return $this->ok(InquiryResource::collection($inquiries));
    }

    public function show(Inquiry $inquiry): JsonResponse
    {
        $this->authorize('view', $inquiry);

        $inquiry->load(['assignee', 'notes.author']);

        return $this->ok(new InquiryResource($inquiry));
    }

    public function update(UpdateInquiryRequest $request, Inquiry $inquiry): JsonResponse
    {
        $inquiry->update($request->validated());
        $inquiry->load(['assignee', 'notes.author']);

        return $this->ok(new InquiryResource($inquiry));
    }

    public function storeNote(StoreInquiryNoteRequest $request, Inquiry $inquiry): JsonResponse
    {
        $note = $inquiry->notes()->create([
            'author_id' => $request->user()->id,
            'body' => $request->validated('body'),
        ]);
        $note->load('author');

        return $this->created(new InquiryNoteResource($note));
    }
}
