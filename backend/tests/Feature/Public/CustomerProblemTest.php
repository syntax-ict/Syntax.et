<?php

namespace Tests\Feature\Public;

use App\Models\CustomerProblem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerProblemTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_active_problems(): void
    {
        CustomerProblem::factory()->create(['problem' => 'Visible problem']);
        CustomerProblem::factory()->create(['problem' => 'Hidden problem', 'is_active' => false]);

        $response = $this->getJson('/api/customer-problems');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('Visible problem', $response->json('data.0.problem'));
    }
}
