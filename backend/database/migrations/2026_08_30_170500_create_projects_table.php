<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_category_id')
                ->nullable()
                ->constrained('solution_categories')
                ->nullOnDelete();
            $table->string('slug', 100)->unique();
            $table->string('title');
            $table->enum('client_type', ['government', 'private_enterprise', 'retail_hub', 'corporate_office']);
            $table->string('industry')->nullable();
            $table->text('description');
            $table->text('challenge')->nullable();
            $table->text('solution_detail')->nullable();
            $table->text('outcome')->nullable();
            // Arrays of strings.
            $table->json('scope_of_implementation')->nullable();
            $table->json('technologies_involved')->nullable();
            $table->json('deliverables');
            $table->json('results');
            $table->boolean('is_featured')->default(false);
            $table->smallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
