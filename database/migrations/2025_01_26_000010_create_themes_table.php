<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('version')->default('1.0.0');
            $table->string('author')->nullable();
            $table->string('thumbnail')->nullable();
            $table->boolean('is_active')->default(false);
            $table->boolean('is_enabled')->default(true);
            $table->enum('type', ['gaming', 'blog', 'ecommerce'])->default('gaming');
            $table->timestamps();

            $table->index('is_active');
            $table->index('is_enabled');
            $table->index('type');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
