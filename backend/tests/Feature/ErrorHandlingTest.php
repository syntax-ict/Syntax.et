<?php

namespace Tests\Feature;

use App\Models\SolutionCategory;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Phase 4: a duplicate-key write should surface as a client-fixable 409,
 * not fall through to the generic 500 (architecture §11/§12). There is no
 * admin write endpoint yet to trigger this naturally (that's Phase 5), so
 * this registers a throwaway route for the one thing being tested here:
 * that bootstrap/app.php's render() handler converts the exception
 * correctly when it reaches the HTTP kernel.
 */
class ErrorHandlingTest extends TestCase
{
    use RefreshDatabase;

    public function test_unique_constraint_violation_renders_as_409(): void
    {
        SolutionCategory::factory()->create(['slug' => 'duplicate-slug']);

        Route::post('/api/_test/duplicate-insert', function () {
            DB::table('solution_categories')->insert([
                'slug' => 'duplicate-slug',
                'name' => 'Another',
                'short_description' => 'x',
                'detailed_description' => 'x',
                'icon' => 'Cpu',
                'color_primary' => 'x',
                'color_bg' => 'x',
                'color_border' => 'x',
                'color_accent' => 'x',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        $response = $this->postJson('/api/_test/duplicate-insert');

        $response->assertStatus(409)->assertJson([
            'success' => false,
            'message' => 'A record with these details already exists.',
        ]);
    }

    public function test_the_underlying_exception_is_a_unique_constraint_violation(): void
    {
        SolutionCategory::factory()->create(['slug' => 'duplicate-slug']);

        $this->expectException(UniqueConstraintViolationException::class);

        DB::table('solution_categories')->insert([
            'slug' => 'duplicate-slug',
            'name' => 'Another',
            'short_description' => 'x',
            'detailed_description' => 'x',
            'icon' => 'Cpu',
            'color_primary' => 'x',
            'color_bg' => 'x',
            'color_border' => 'x',
            'color_accent' => 'x',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Security audit finding C1: an unhandled exception must never leak a
     * stack trace, exception class, file path, or the raw exception
     * message to an API client — regardless of APP_DEBUG. This is what
     * historically failed: the catch-all handler used to `return null`
     * when `config('app.debug')` was true, falling through to Laravel's
     * default renderer (which includes `exception`/`file`/`line`/`trace`
     * for a JSON-expecting request). config('app.debug') is forced true
     * here specifically to prove the fix isn't just "works because the
     * test suite runs with debug off".
     */
    public function test_unhandled_exception_does_not_leak_debug_info_even_with_debug_enabled(): void
    {
        config(['app.debug' => true]);

        Route::get('/api/_test/unhandled-throw', function () {
            throw new \RuntimeException('internal detail that must never reach a client');
        });

        $response = $this->getJson('/api/_test/unhandled-throw');

        $response->assertStatus(500)->assertExactJson([
            'success' => false,
            'message' => 'An unexpected error occurred.',
        ]);
    }

    /**
     * The safe path stays safe too — same assertion with debug off,
     * pinning the baseline this test class already relied on implicitly.
     */
    public function test_unhandled_exception_returns_generic_message_with_debug_disabled(): void
    {
        config(['app.debug' => false]);

        Route::get('/api/_test/unhandled-throw-safe', function () {
            throw new \RuntimeException('internal detail that must never reach a client');
        });

        $response = $this->getJson('/api/_test/unhandled-throw-safe');

        $response->assertStatus(500)->assertExactJson([
            'success' => false,
            'message' => 'An unexpected error occurred.',
        ]);
    }
}
