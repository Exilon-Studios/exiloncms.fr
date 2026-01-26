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
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('general')->index(); // Pour organiser par composant (puck, admin, etc.)
            $table->string('key')->index(); // La clé de traduction
            $table->string('locale', 10)->index(); // fr, en, etc.
            $table->text('value'); // La valeur traduite
            $table->timestamps();

            $table->unique(['group', 'key', 'locale'], 'translations_group_key_locale_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
