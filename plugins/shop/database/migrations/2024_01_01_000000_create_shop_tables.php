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
        // Create categories table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Create items table
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->string('type')->default('item'); // item, rank, currency, command, custom
            $table->json('commands')->nullable();
            $table->boolean('give_item')->default(false);
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index(['category_id', 'is_active', 'order']);
        });

        // Create orders table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('pending'); // pending, completed, cancelled, refunded
            $table->decimal('total_price', 10, 2);
            $table->string('payment_method')->nullable();
            $table->string('payment_id')->nullable();
            $table->json('payment_data')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        // Create order_items table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->json('item_data')->nullable(); // Store item state at time of purchase
            $table->boolean('is_delivered')->default(false);
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'item_id']);
        });

        // Create payments table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null');
            $table->string('method'); // tebex, paypal, stripe, etc
            $table->string('status')->default('pending'); // pending, completed, failed, refunded
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('transaction_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status', 'method']);
        });

        // Create payment_items table (pivot for payments and items)
        Schema::create('payment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained()->onDelete('cascade');
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->json('item_data')->nullable();
            $table->timestamps();

            $table->index(['payment_id', 'item_id']);
        });

        // Create gateways table (payment gateway configurations)
        Schema::create('gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // tebex, paypal, stripe
            $table->string('display_name');
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable(); // API keys, secrets, etc
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gateways');
        Schema::dropIfExists('payment_items');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('items');
        Schema::dropIfExists('categories');
    }
};
