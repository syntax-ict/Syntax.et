<?php

namespace App\Policies;

use App\Models\User;

/**
 * User management is entirely admin-only (architecture §9) — staff cannot
 * even list other admin-panel accounts. `Gate::before` already grants an
 * admin everything, so every method here denies staff.
 *
 * The "an admin can't delete their own account" rule deliberately does not
 * live here: `Gate::before` short-circuits every ability for an admin
 * before this policy is ever consulted, so a check here could never
 * actually stop one. It's enforced directly in UserController::destroy().
 */
class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user): bool
    {
        return false;
    }

    public function delete(User $user): bool
    {
        return false;
    }
}
