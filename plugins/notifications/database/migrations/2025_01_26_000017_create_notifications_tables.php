<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Notification channels (email, SMS, push, webhook)
        Schema::create('notification_channels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['email', 'sms', 'push', 'webhook']);
            $table->json('config')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->index('type');
            $table->index('is_enabled');
        });

        // Notification templates
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('subject')->nullable();
            $table->text('content');
            $table->enum('type', ['email', 'sms', 'push'])->default('email');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->index('type');
            $table->index('slug');
        });

        // Notification logs
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('channel_id')->constrained('notification_channels')->onDelete('cascade');
            $table->string('type'); // e.g., 'welcome', 'password_reset', 'purchase_confirmation'
            $table->string('subject')->nullable();
            $table->text('content');
            $table->json('data')->nullable();
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('channel_id');
            $table->index('type');
            $table->index('created_at');
        });

        // User notification preferences
        Schema::create('user_notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('preferences'); // {"email": true, "sms": false, "push": true}
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_notification_preferences');
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('notification_templates');
        Schema::dropIfExists('notification_channels');
    }
};
