<?php

namespace App\Policies;

use App\Models\User;

/**
 * Staff can view and update registration status; only admin can delete
 * (architecture §5).
 */
class CourseRegistrationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user): bool
    {
        return true;
    }

    public function update(User $user): bool
    {
        return true;
    }

    public function delete(User $user): bool
    {
        return false;
    }
}
