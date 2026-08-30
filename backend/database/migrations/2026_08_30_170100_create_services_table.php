<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_category_id')
                ->constrained('solution_categories')
                ->restrictOnDelete();
            $table->string('slug', 100)->unique();
            $table->string('name');
            $table->string('short_description');
            $table->longText('description');
            $table->string('icon', 60);
            // Array of benefit strings.
            $table->json('benefits');
            $table->boolean('is_featured')->default(false);
            $table->smallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
