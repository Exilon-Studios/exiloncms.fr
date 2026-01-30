<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class EnableBlogPluginSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Enable blog plugin by default
        $enabledPlugins = ['blog'];
        DB::table('settings')->updateOrInsert(
            ['name' => 'enabled_plugins'],
            ['value' => json_encode($enabledPlugins)]
        );

        // Set blog theme as active (clear cache first)
        Cache::forget('active_theme');
        DB::table('settings')->updateOrInsert(
            ['name' => 'active_theme'],
            ['value' => 'blog']
        );

        $this->command->info('Blog plugin enabled and blog theme set as default.');
        $this->command->comment('Run: php artisan cache:clear to apply changes');
    }
}
