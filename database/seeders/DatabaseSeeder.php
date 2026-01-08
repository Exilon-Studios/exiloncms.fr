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
        // Call individual seeders
        $this->call([
            AdminUserSeeder::class,
            CompanySettingsSeeder::class,
            LandingSettingsSeeder::class,
            PuckPermissionSeeder::class,
            ShopSeeder::class,
        ]);
    }
}
