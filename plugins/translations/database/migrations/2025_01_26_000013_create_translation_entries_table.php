<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translation_entries', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 10);
            $table->string('group', 50);
            $table->string('key');
            $table->text('value');
            $table->timestamps();

            $table->unique(['locale', 'group', 'key']);
            $table->index('locale');
            $table->index('group');
            $table->index('key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translation_entries');
    }
};
