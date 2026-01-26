<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Only create pages table if it doesn't exist
        if (! Schema::hasTable('pages')) {
            Schema::create('pages', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('content');
                $table->text('excerpt')->nullable();
                $table->boolean('is_enabled')->default(true);
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->timestamps();

                $table->index('is_enabled');
                $table->index('slug');
            });
        }

        // Only create page_roles table if it doesn't exist
        if (! Schema::hasTable('page_roles')) {
            Schema::create('page_roles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('page_id')->constrained('pages')->onDelete('cascade');
                $table->foreignId('role_id')->constrained()->onDelete('cascade');
                $table->unique(['page_id', 'role_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('page_roles');
        Schema::dropIfExists('pages');
    }
};
