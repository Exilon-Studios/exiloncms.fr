<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plugins_installed', function (Blueprint $table) {
            $table->string('source_url')->nullable()->after('version');
            $table->string('author_url')->nullable()->after('source_url');
            $table->timestamp('checked_at')->nullable()->after('updated_at');
            $table->string('latest_version')->nullable()->after('checked_at');
        });

        Schema::table('themes', function (Blueprint $table) {
            $table->string('source_url')->nullable()->after('screenshot');
            $table->string('author_url')->nullable()->after('source_url');
            $table->timestamp('checked_at')->nullable()->after('updated_at');
            $table->string('latest_version')->nullable()->after('checked_at');
        });
    }

    public function down(): void
    {
        Schema::table('plugins_installed', function (Blueprint $table) {
            $table->dropColumn(['source_url', 'author_url', 'checked_at', 'latest_version']);
        });

        Schema::table('themes', function (Blueprint $table) {
            $table->dropColumn(['source_url', 'author_url', 'checked_at', 'latest_version']);
        });
    }
};
