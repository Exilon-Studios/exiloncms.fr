<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->string('color')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index('order');
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('document_categories')->onDelete('set null');
            $table->foreignId('parent_id')->nullable()->constrained('documents')->onDelete('cascade');
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('icon')->nullable();
            $table->string('version')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index('category_id');
            $table->index('parent_id');
            $table->index('is_published');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('document_categories');
    }
};
