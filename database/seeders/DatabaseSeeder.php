<?php

namespace Database\Seeders;

use ExilonCMS\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core seeders
        $seeders = [
            AdminUserSeeder::class,
            CompanySettingsSeeder::class,
            LandingSettingsSeeder::class,
            PuckPermissionSeeder::class,
        ];

        // Only add ShopSeeder if the plugin is available
        if (class_exists('ExilonCMS\\Plugins\\Shop\\ShopServiceProvider')) {
            $seeders[] = ShopSeeder::class;
        }

        $this->call($seeders);
    }
}
