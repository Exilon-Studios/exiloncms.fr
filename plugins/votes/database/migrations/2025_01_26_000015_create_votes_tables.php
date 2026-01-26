<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vote_sites', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url'); // API URL
            $table->string('vote_url'); // URL users are redirected to
            $table->string('vote_key'); // API key for verification
            $table->integer('priority')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->index('is_enabled');
            $table->index('priority');
        });

        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('vote_site_id')->constrained('vote_sites')->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'vote_site_id']);
            $table->index('is_verified');
            $table->index('created_at');
        });

        Schema::create('vote_rewards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('reward_type', ['money', 'items', 'role', 'command'])->default('money');
            $table->string('reward_amount');
            $table->integer('required_votes')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
            $table->index('required_votes');
        });

        Schema::create('user_vote_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vote_id')->constrained()->onDelete('cascade');
            $table->foreignId('vote_reward_id')->constrained()->onDelete('cascade');
            $table->timestamp('received_at')->useCurrent();

            $table->index('user_id');
            $table->unique(['user_id', 'vote_reward_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_vote_rewards');
        Schema::dropIfExists('vote_rewards');
        Schema::dropIfExists('votes');
        Schema::dropIfExists('vote_sites');
    }
};
