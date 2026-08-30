<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Admin management (architecture §9): user CRUD is entirely admin-only.
 */
class UserController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        return $this->ok(UserResource::collection(User::query()->orderBy('name')->get()));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'is_active' => true,
        ]);

        return $this->created(new UserResource($user));
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return $this->ok(new UserResource($user));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['password'])) {
            $user->password = $data['password'];
        }
        unset($data['password'], $data['password_confirmation']);

        $user->fill($data);
        $user->save();

        return $this->ok(new UserResource($user));
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        // Gate::before grants an admin every ability unconditionally, so a
        // Policy method can never be the thing that stops an admin from
        // deleting their own account — enforce that invariant here instead,
        // where it actually runs regardless of who's asking.
        abort_if($this->currentUserIsTarget($user), 403, 'You cannot delete your own account.');

        $user->delete();

        return $this->noContent();
    }

    private function currentUserIsTarget(User $user): bool
    {
        return request()->user()?->is($user) ?? false;
    }
}
