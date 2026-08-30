<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactMessageRequest;
use App\Http\Resources\Public\ContactMessageResource;
use App\Models\ContactMessage;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    use ApiResponse;

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Explicitly whitelisted rather than spreading $data wholesale, so
        // a validation-only field (the honeypot) can never reach create()
        // even incidentally.
        $message = ContactMessage::query()->create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'],
            'message' => $data['message'],
        ]);

        return $this->created(new ContactMessageResource($message));
    }
}
