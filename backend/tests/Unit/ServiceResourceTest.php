<?php

namespace Tests\Unit;

use App\Http\Resources\Public\ServiceResource;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class ServiceResourceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Regression test: a relation wrapped correctly in whenLoaded() must
     * disappear entirely when not eager-loaded, not render as a partial,
     * empty-looking object (the bug this guards against rendered
     * `"category": []` instead of omitting the key).
     *
     * whenLoaded()'s MissingValue is only stripped by JsonResource's
     * resolve()/filter() step, not by toArray() directly — so this has to
     * go through response() to actually exercise the behavior it's testing.
     */
    public function test_category_key_is_omitted_entirely_when_not_eager_loaded(): void
    {
        $service = Service::factory()->create();

        $data = (new ServiceResource($service))->response(Request::create('/'))->getData(true);

        $this->assertArrayNotHasKey('category', $data['data']);
    }

    public function test_category_key_is_present_in_full_when_eager_loaded(): void
    {
        $service = Service::factory()->create();
        $service->load('category');

        $data = (new ServiceResource($service))->response(Request::create('/'))->getData(true);

        $this->assertArrayHasKey('category', $data['data']);
        $this->assertSame($service->category->slug, $data['data']['category']['slug']);
    }
}
