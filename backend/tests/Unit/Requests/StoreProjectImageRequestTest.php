<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\Admin\StoreProjectImageRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

/**
 * Validation-only tests for the file-upload rules (architecture §10) — no
 * route/controller exists yet to exercise this through HTTP; that's built
 * with the admin upload endpoint in Phase 5.
 */
class StoreProjectImageRequestTest extends TestCase
{
    private function rules(): array
    {
        return (new StoreProjectImageRequest)->rules();
    }

    public function test_valid_image_passes(): void
    {
        $validator = Validator::make([
            'image' => UploadedFile::fake()->image('front-gate.jpg', 1000, 800),
            'alt_text' => 'Front gate biometric turnstile installation',
        ], $this->rules());

        $this->assertTrue($validator->passes());
    }

    public function test_missing_image_fails(): void
    {
        $validator = Validator::make(['alt_text' => 'Some description'], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('image', $validator->errors()->toArray());
    }

    public function test_oversized_image_fails(): void
    {
        $validator = Validator::make([
            'image' => UploadedFile::fake()->create('huge.jpg', 6000, 'image/jpeg'),
            'alt_text' => 'Description',
        ], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('image', $validator->errors()->toArray());
    }

    public function test_disallowed_mime_type_fails(): void
    {
        $validator = Validator::make([
            'image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
            'alt_text' => 'Description',
        ], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('image', $validator->errors()->toArray());
    }

    public function test_image_below_minimum_dimensions_fails(): void
    {
        $validator = Validator::make([
            'image' => UploadedFile::fake()->image('tiny.jpg', 100, 100),
            'alt_text' => 'Description',
        ], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('image', $validator->errors()->toArray());
    }

    public function test_missing_alt_text_fails(): void
    {
        $validator = Validator::make([
            'image' => UploadedFile::fake()->image('front-gate.jpg', 1000, 800),
        ], $this->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('alt_text', $validator->errors()->toArray());
    }
}
