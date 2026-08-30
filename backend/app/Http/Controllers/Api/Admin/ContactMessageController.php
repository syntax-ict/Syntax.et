<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactMessageRequest;
use App\Http\Resources\Admin\ContactMessageResource;
use App\Models\ContactMessage;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Support management for contact messages (architecture §8) — an inbox,
 * not a ticket workflow: mark read, mark responded.
 */
class ContactMessageController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', ContactMessage::class);

        $messages = ContactMessage::query()
            ->when($request->filled('is_read'), fn ($q) => $q->where('is_read', $request->boolean('is_read')))
            ->latest('created_at')
            ->paginate(20);

        return $this->ok(ContactMessageResource::collection($messages));
    }

    public function show(ContactMessage $contact_message): JsonResponse
    {
        $this->authorize('view', $contact_message);

        return $this->ok(new ContactMessageResource($contact_message));
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $contact_message): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('is_read', $data)) {
            $contact_message->is_read = $data['is_read'];
        }

        if (($data['responded'] ?? null) === true) {
            $contact_message->responded_at = now();
        }

        $contact_message->save();

        return $this->ok(new ContactMessageResource($contact_message));
    }

    public function destroy(ContactMessage $contact_message): JsonResponse
    {
        $this->authorize('delete', $contact_message);

        $contact_message->delete();

        return $this->noContent();
    }
}
