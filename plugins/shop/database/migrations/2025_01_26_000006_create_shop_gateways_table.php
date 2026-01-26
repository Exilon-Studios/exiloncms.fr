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
        Schema::create('shop_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // tebex, paypal, stripe, etc.
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->json('config')->nullable();
            $table->boolean('test_mode')->default(false);
            $table->timestamps();

            $table->index('type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_gateways');
    }
};
