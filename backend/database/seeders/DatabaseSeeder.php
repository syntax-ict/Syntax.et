<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Known-guessable values that must never become the live admin
     * password: every previous default this codebase has ever shipped
     * (security audit finding C2 — `env('ADMIN_PASSWORD', 'password')`
     * meant an unset env var silently created an admin account with the
     * password "password", and this project's own .env.example shipped
     * the equally-guessable "change-me-immediately" in plain text in the
     * repository). Checked case-insensitively so trivial variants don't
     * slip through either.
     *
     * @var list<string>
     */
    private const REJECTED_PASSWORDS = [
        'password', 'change-me-immediately', 'changeme', 'admin', 'secret',
    ];

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
        $password = (string) env('ADMIN_PASSWORD', '');

        $this->assertAdminPasswordIsSafe($password);

        User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Syntax Admin'),
                'password' => $password,
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->call(ContentSeeder::class);
    }

    /**
     * Refuses to seed the admin account with a missing, too-weak, or
     * previously-shipped default password (security audit finding C2) —
     * fails the deploy loudly instead of silently succeeding with a
     * credential an attacker can guess or read straight out of source
     * control.
     */
    private function assertAdminPasswordIsSafe(string $password): void
    {
        if (in_array(strtolower($password), self::REJECTED_PASSWORDS, true)) {
            throw new RuntimeException(
                'ADMIN_PASSWORD is set to a known default/placeholder value. '
                .'Set a real, unique password in your .env before seeding.'
            );
        }

        $validator = Validator::make(
            ['password' => $password],
            ['password' => ['required', Password::min(12)]],
        );

        if ($validator->fails()) {
            throw new RuntimeException(
                'ADMIN_PASSWORD is missing or does not meet the minimum security bar '
                .'(at least 12 characters). Set a real password in your .env before seeding: '
                .implode(' ', $validator->errors()->get('password'))
            );
        }
    }
}
