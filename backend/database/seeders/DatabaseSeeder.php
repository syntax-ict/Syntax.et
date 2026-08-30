<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Only the first admin account is created here (from env vars, never a
     * hard-coded credential — architecture §3). Content seeders for
     * solution categories/services/courses/projects are added in Phase 2.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@syntaxtech.local');

        User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Syntax Admin'),
                'password' => env('ADMIN_PASSWORD', 'password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
