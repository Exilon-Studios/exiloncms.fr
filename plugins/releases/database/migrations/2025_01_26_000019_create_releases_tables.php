<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('releases', function (Blueprint $table) {
            $table->id();
            $table->string('version'); // e.g., 1.0.0
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('content'); // Full release notes (Markdown)
            $table->enum('type', ['major', 'minor', 'patch', 'prerelease'])->default('patch');
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('github_tag')->nullable(); // e.g., v1.0.0
            $table->string('download_url')->nullable();
            $table->timestamps();

            $table->unique('version');
            $table->index('status');
            $table->index('published_at');
            $table->index('type');
        });

        Schema::create('release_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('release_id')->constrained()->onDelete('cascade');
            $table->enum('category', ['feature', 'fix', 'change', 'breaking', 'performance', 'security']);
            $table->string('type')->nullable(); // Sub-category
            $table->text('description');
            $table->integer('order')->default(0);
            $table->boolean('breaking')->default(false);
            $table->timestamps();

            $table->index('release_id');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('release_changes');
        Schema::dropIfExists('releases');
    }
};
