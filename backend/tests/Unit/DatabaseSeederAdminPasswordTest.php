<?php

namespace Tests\Unit;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use ReflectionMethod;
use RuntimeException;
use Tests\TestCase;

/**
 * Security audit finding C2: the seeder must refuse to create the admin
 * account with a missing, too-short, or previously-shipped
 * default/placeholder password, rather than silently falling back to one
 * (the historical bug — `env('ADMIN_PASSWORD', 'password')`).
 *
 * Exercises the guard method directly via reflection rather than running
 * the full seeder (which also seeds all site content) — the concern under
 * test is purely the password-safety check.
 */
class DatabaseSeederAdminPasswordTest extends TestCase
{
    use RefreshDatabase;

    private function assertPasswordSafe(string $password): void
    {
        $method = new ReflectionMethod(DatabaseSeeder::class, 'assertAdminPasswordIsSafe');
        $method->invoke(new DatabaseSeeder, $password);
    }

    public function test_rejects_empty_password(): void
    {
        $this->expectException(RuntimeException::class);
        $this->assertPasswordSafe('');
    }

    public function test_rejects_short_password(): void
    {
        $this->expectException(RuntimeException::class);
        $this->assertPasswordSafe('Short1!');
    }

    #[DataProvider('knownDefaultPasswords')]
    public function test_rejects_known_default_passwords(string $default): void
    {
        $this->expectException(RuntimeException::class);
        $this->assertPasswordSafe($default);
    }

    /**
     * @return array<string, array{0: string}>
     */
    public static function knownDefaultPasswords(): array
    {
        return [
            'the old code fallback' => ['password'],
            'the old .env.example value' => ['change-me-immediately'],
            'uppercased variant is still caught' => ['PASSWORD'],
            'mixed-case variant is still caught' => ['Change-Me-Immediately'],
        ];
    }

    public function test_accepts_a_real_password(): void
    {
        $this->assertPasswordSafe('Correct-Horse-Battery-Staple-42');
        $this->addToAssertionCount(1); // no exception thrown = pass
    }
}
