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
        // MC-CMS V2 - Seeders will be run manually via php artisan mccms:user
        // This prevents automatic seeding during fresh migrations
    }
}
