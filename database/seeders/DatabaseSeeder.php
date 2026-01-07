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
        // ExilonCMS - Seeders will be run manually via php artisan user:create
        // This prevents automatic seeding during fresh migrations
    }
}
