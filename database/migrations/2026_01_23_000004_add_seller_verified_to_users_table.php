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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_seller')->default(false)->after('money');
            $table->timestamp('seller_verified_at')->nullable()->after('is_seller');
            $table->foreignId('seller_verified_by')->nullable()->constrained('users')->nullOnDelete()->after('seller_verified_at');
            $table->string('stripe_account_id')->nullable()->after('access_token');
            $table->string('paypal_email')->nullable()->after('stripe_account_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_seller', 'seller_verified_at', 'seller_verified_by', 'stripe_account_id', 'paypal_email']);
        });
    }
};
