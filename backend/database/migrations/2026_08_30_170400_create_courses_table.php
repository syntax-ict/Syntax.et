<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_category_id')
                ->nullable()
                ->constrained('solution_categories')
                ->nullOnDelete();
            $table->string('slug', 100)->unique();
            $table->string('title');
            $table->string('duration');
            $table->enum('level', ['beginner', 'intermediate', 'advanced', 'all_levels']);
            $table->enum('mode', ['online', 'face_to_face', 'corporate']);
            $table->text('description');
            // Arrays of strings.
            $table->json('syllabus');
            $table->json('skills_gained');
            $table->json('target_audience')->nullable();
            $table->json('requirements')->nullable();
            // [{title, topics: []}]
            $table->json('modules')->nullable();
            $table->string('schedule')->nullable();
            $table->string('location')->nullable();
            $table->decimal('price_amount', 10, 2)->nullable();
            $table->string('price_currency', 3)->default('ETB');
            $table->smallInteger('capacity')->nullable();
            $table->smallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
