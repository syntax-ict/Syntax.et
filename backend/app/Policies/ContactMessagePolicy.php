<?php

namespace App\Policies;

use App\Models\User;

/**
 * Staff can view and mark read/responded on any contact message; only
 * admin can delete (architecture §8).
 */
class ContactMessagePolicy
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
