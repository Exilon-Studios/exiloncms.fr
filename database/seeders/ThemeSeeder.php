<?php

namespace Database\Seeders;

use ExilonCMS\Models\Theme;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            [
                'name' => 'Gaming Theme',
                'slug' => 'gaming',
                'description' => 'Dark, modern theme perfect for gaming websites and game server communities. Features bold colors, gaming-focused layouts, and immersive design.',
                'version' => '1.0.0',
                'author' => 'ExilonCMS',
                'thumbnail' => null,
                'is_active' => false,
                'is_enabled' => true,
                'type' => Theme::TYPE_GAMING,
            ],
            [
                'name' => 'Blog Theme',
                'slug' => 'blog',
                'description' => 'Clean, content-focused theme designed for bloggers and content creators. Minimal design with excellent typography and readability.',
                'version' => '1.0.0',
                'author' => 'ExilonCMS',
                'thumbnail' => null,
                'is_active' => true,
                'is_enabled' => true,
                'type' => Theme::TYPE_BLOG,
            ],
            [
                'name' => 'Ecommerce Theme',
                'slug' => 'ecommerce',
                'description' => 'Professional e-commerce theme for online stores. Product showcase, shopping cart, and checkout optimized for conversions.',
                'version' => '1.0.0',
                'author' => 'ExilonCMS',
                'thumbnail' => null,
                'is_active' => false,
                'is_enabled' => true,
                'type' => Theme::TYPE_ECOMMERCE,
            ],
        ];

        foreach ($themes as $theme) {
            Theme::firstOrCreate(
                ['slug' => $theme['slug']],
                $theme
            );
        }
    }
}
