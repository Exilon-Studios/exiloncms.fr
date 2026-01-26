<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plugins_installed', function (Blueprint $table) {
            $table->id();
            $table->string('plugin_id')->unique();
            $table->string('name');
            $table->string('version')->default('1.0.0');
            $table->enum('type', ['plugin', 'theme'])->default('plugin');
            $table->boolean('is_enabled')->default(true);
            $table->string('source')->default('local');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('is_enabled');
            $table->index('plugin_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plugins_installed');
    }
};
