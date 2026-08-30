<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_category_id')
                ->constrained('solution_categories')
                ->restrictOnDelete();
            $table->string('target_user');
            $table->string('problem');
            $table->text('impact');
            $table->text('solution_text');
            $table->smallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_problems');
    }
};
