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
        Schema::create('shop_payment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('shop_payments')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('shop_items')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->timestamps();

            $table->index('payment_id');
            $table->index('item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_payment_items');
    }
};
