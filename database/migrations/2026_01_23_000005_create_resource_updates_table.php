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
        Schema::create('resource_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->cascadeOnDelete();
            $table->string('version');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('download_url');
            $table->unsignedInteger('downloads')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index('resource_id');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_updates');
    }
};
