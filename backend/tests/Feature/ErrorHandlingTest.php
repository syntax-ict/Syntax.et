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
}
