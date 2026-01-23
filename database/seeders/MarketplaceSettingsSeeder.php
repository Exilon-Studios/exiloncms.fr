<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarketplaceSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Marketplace SSO settings
            'marketplace_sso_secret' => Str::random(64), // Unique secret for SSO with marketplace
            'marketplace_url' => 'https://marketplace.exiloncms.fr',

            // Resource Marketplace Settings
            'marketplace_enabled' => '1', // Enable/disable marketplace
            'seller_verification_required' => '1', // Require admin verification for sellers
            'auto_approve_verified_sellers' => '1', // Auto-approve from verified sellers
            'commission_rate' => '0', // Commission rate (0 = no commission - all money goes to sellers)
            'min_price' => '0', // Minimum price for paid resources
            'max_price' => '9999.99', // Maximum price for paid resources
            'allowed_file_types' => json_encode(['zip', 'rar', '7z']), // Allowed file types
            'max_file_size' => '100', // Max file size in MB
        ];

        foreach ($settings as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['name' => $key],
                ['value' => $value]
            );
        }

        $this->command->info('Marketplace settings seeded successfully!');
        $this->command->warn('SSO Secret: ' . $settings['marketplace_sso_secret']);
        $this->command->warn('Register this secret on the marketplace at /sso/register');
    }
}
