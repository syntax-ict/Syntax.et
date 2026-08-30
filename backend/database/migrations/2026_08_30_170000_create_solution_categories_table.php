<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solution_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 80)->unique();
            $table->string('name');
            $table->string('short_description');
            $table->text('detailed_description');
            // Lucide icon name, rendered client-side — not a file.
            $table->string('icon', 60);
            $table->string('color_primary', 60);
            $table->string('color_bg', 60);
            $table->string('color_border', 60);
            $table->string('color_accent', 60);
            $table->smallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solution_categories');
    }
};
