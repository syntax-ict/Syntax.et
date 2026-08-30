<?php

namespace Tests\Feature\Admin;

use App\Models\SolutionCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerProblemManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_cannot_create_a_customer_problem(): void
    {
        $staff = User::factory()->staff()->create();
        $category = SolutionCategory::factory()->create();

        $response = $this->actingAs($staff)->postJson('/api/admin/customer-problems', [
            'solution_category_id' => $category->id,
            'target_user' => 'Facility managers',
            'problem' => 'Unmonitored entry points',
            'impact' => 'Undetected unauthorized access.',
            'solution_text' => 'Integrated CCTV and access control.',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_a_customer_problem(): void
    {
        $admin = User::factory()->admin()->create();
        $category = SolutionCategory::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/customer-problems', [
            'solution_category_id' => $category->id,
            'target_user' => 'Facility managers',
            'problem' => 'Unmonitored entry points',
            'impact' => 'Undetected unauthorized access.',
            'solution_text' => 'Integrated CCTV and access control.',
        ]);

        $response->assertCreated()->assertJsonPath('data.problem', 'Unmonitored entry points');
    }
}
