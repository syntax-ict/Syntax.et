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
        $message = ContactMessage::query()->create($request->validated());

        return $this->created(new ContactMessageResource($message));
    }
}
