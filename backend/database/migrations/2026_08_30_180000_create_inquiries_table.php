<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            // Server-generated, e.g. ST-CONS-7F3A9K (architecture §1) — never
            // accepted from the client.
            $table->string('reference', 30)->unique();
            $table->enum('type', ['consultation', 'quote', 'support']);
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 30);
            $table->string('organization')->nullable();
            $table->string('subject')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['pending_review', 'in_contact', 'in_progress', 'resolved', 'completed'])
                ->default('pending_review');
            $table->text('details');
            // Type-specific extras only (architecture §1) — never a field
            // that needs to be queried/filtered/reported on directly.
            $table->json('meta')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
