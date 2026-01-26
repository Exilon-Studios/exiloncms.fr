<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legal_pages', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['privacy', 'terms', 'cookies', 'refund']);
            $table->string('locale', 10)->default('en');
            $table->string('title');
            $table->text('content');
            $table->boolean('is_enabled')->default(true);
            $table->string('last_modified_by')->nullable();
            $table->timestamps();

            $table->unique(['type', 'locale']);
            $table->index('type');
            $table->index('locale');
            $table->index('is_enabled');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_pages');
    }
};
