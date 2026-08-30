<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 30);
            $table->string('organization')->nullable();
            $table->enum('training_mode', ['online', 'face_to_face', 'corporate']);
            $table->string('experience_level', 120);
            $table->text('goals');
            $table->enum('status', ['pending', 'confirmed', 'waitlisted', 'cancelled', 'completed'])
                ->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_registrations');
    }
};
