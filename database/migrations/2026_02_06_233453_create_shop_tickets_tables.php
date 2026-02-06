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
        // Drop existing shop tables if they exist
        Schema::dropIfExists('shop_items');
        Schema::dropIfExists('shop_categories');
        Schema::dropIfExists('shop_orders');
        Schema::dropIfExists('shop_order_items');

        // Shop tables
        Schema::create('shop_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->integer('stock')->default(0);
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('shop_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        Schema::create('shop_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->string('status')->default('pending');
            $table->string('gateway')->nullable();
            $table->text('gateway_data')->nullable();
            $table->timestamps();
        });

        Schema::create('shop_order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('item_id');
            $table->integer('quantity');
            $table->decimal('price', 8, 2);
            $table->timestamps();
        });

        // Tickets tables
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('subject');
            $table->string('status')->default('open');
            $table->string('priority')->default('normal');
            $table->text('message')->nullable();
            $table->timestamps();
        });

        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('color')->nullable()->default('#666666');
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        Schema::create('ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ticket_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('message');
            $table->boolean('is_admin')->default(false);
            $table->timestamps();
        });

        Schema::create('ticket_status', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->nullable();
            $table->integer('position')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_tickets_tables');
    }
};
