<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * The one place the API's success/error envelope shape is defined
 * (architecture §11). Controllers call these instead of returning raw
 * arrays, so every endpoint is guaranteed to agree on the shape.
 */
trait ApiResponse
{
    protected function ok(JsonResource|ResourceCollection|array $data = [], int $status = 200): JsonResponse
    {
        if ($data instanceof ResourceCollection) {
            // Preserve pagination meta/links already produced by the collection.
            return $data->additional(['success' => true])->response()->setStatusCode($status);
        }

        if ($data instanceof JsonResource) {
            return new JsonResponse(['success' => true, 'data' => $data], $status);
        }

        return response()->json(['success' => true, 'data' => $data], $status);
    }

    protected function created(JsonResource|array $data = []): JsonResponse
    {
        return $this->ok($data, 201);
    }

    protected function noContent(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => null], 200);
    }

    protected function fail(string $message, int $status = 400, array $errors = []): JsonResponse
    {
        $payload = ['success' => false, 'message' => $message];

        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
