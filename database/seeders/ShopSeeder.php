<?php

namespace Database\Seeders;

use ExilonCMS\Plugins\Shop\Models\Category;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les catégories
        $categories = [
            [
                'name' => 'Articles',
                'slug' => 'items',
                'description' => 'Objets et consommables pour vos aventures',
                'icon' => 'package',
                'position' => 1,
            ],
            [
                'name' => 'Packs',
                'slug' => 'packages',
                'description' => 'Packs d\'articles à prix réduits',
                'icon' => 'star',
                'position' => 2,
            ],
            [
                'name' => 'Prestiges',
                'slug' => 'prestiges',
                'description' => 'Rangs et privilèges exclusifs',
                'icon' => 'crown',
                'position' => 3,
            ],
            [
                'name' => 'Boosters',
                'slug' => 'boosters',
                'description' => 'Améliorations temporaires',
                'icon' => 'zap',
                'position' => 4,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Créer les items
        $itemsCategory = Category::where('slug', 'items')->first();
        $packagesCategory = Category::where('slug', 'packages')->first();
        $prestigesCategory = Category::where('slug', 'prestiges')->first();
        $boostersCategory = Category::where('slug', 'boosters')->first();

        $items = [
            // Articles
            [
                'category_id' => $itemsCategory->id,
                'name' => 'Pierre de l\'Ender',
                'slug' => 'ender-pearl',
                'description' => 'Téléportez-vous instantanément',
                'price' => 50,
                'type' => 'item',
                'stock' => 100,
                'is_featured' => true,
                'position' => 1,
                'metadata' => ['command' => 'give {player} ender_pearl 16'],
            ],
            [
                'category_id' => $itemsCategory->id,
                'name' => 'Pomme d\'Or Enchantée',
                'slug' => 'golden-apple',
                'description' => 'Régénération instantanée',
                'price' => 100,
                'type' => 'item',
                'stock' => 50,
                'is_featured' => true,
                'position' => 2,
                'metadata' => ['command' => 'give {player} golden_apple 4'],
            ],
            [
                'category_id' => $itemsCategory->id,
                'name' => 'Diamants x32',
                'slug' => 'diamonds-32',
                'description' => '32 diamants pour vos constructions',
                'price' => 200,
                'type' => 'item',
                'stock' => 25,
                'position' => 3,
                'metadata' => ['command' => 'give {player} diamond 32'],
            ],
            // Packs
            [
                'category_id' => $packagesCategory->id,
                'name' => 'Pack Débutant',
                'slug' => 'starter-pack',
                'description' => 'Idéal pour commencer votre aventure',
                'price' => 500,
                'type' => 'package',
                'stock' => -1,
                'is_featured' => true,
                'position' => 1,
                'metadata' => ['commands' => [
                    'give {player} diamond 64',
                    'give {player} iron_ingot 64',
                    'give {player} golden_apple 10',
                ]],
            ],
            [
                'category_id' => $packagesCategory->id,
                'name' => 'Pack VIP',
                'slug' => 'vip-pack',
                'description' => 'Tout ce dont vous avez besoin',
                'price' => 1500,
                'type' => 'package',
                'stock' => -1,
                'is_featured' => true,
                'position' => 2,
                'metadata' => ['commands' => [
                    'give {player} netherite_ingot 32',
                    'give {player} golden_apple 64',
                    'give {player} elytra 1',
                ]],
            ],
            // Prestiges
            [
                'category_id' => $prestigesCategory->id,
                'name' => 'VIP',
                'slug' => 'vip-rank',
                'description' => 'Rang VIP pendant 30 jours',
                'price' => 1000,
                'type' => 'prestige',
                'stock' => -1,
                'is_featured' => true,
                'position' => 1,
                'metadata' => ['rank' => 'vip', 'duration' => 30],
            ],
            [
                'category_id' => $prestigesCategory->id,
                'name' => 'VIP+',
                'slug' => 'vip-plus-rank',
                'description' => 'Rang VIP+ pendant 30 jours',
                'price' => 2000,
                'type' => 'prestige',
                'stock' => -1,
                'is_featured' => false,
                'position' => 2,
                'metadata' => ['rank' => 'vip_plus', 'duration' => 30],
            ],
            [
                'category_id' => $prestigesCategory->id,
                'name' => 'MVP',
                'slug' => 'mvp-rank',
                'description' => 'Rang MVP pendant 30 jours',
                'price' => 5000,
                'type' => 'prestige',
                'stock' => -1,
                'is_featured' => true,
                'position' => 3,
                'metadata' => ['rank' => 'mvp', 'duration' => 30],
            ],
            // Boosters
            [
                'category_id' => $boostersCategory->id,
                'name' => 'Double XP 24h',
                'slug' => 'double-xp-24h',
                'description' => 'Gagnez 2x plus d\'XP pendant 24 heures',
                'price' => 300,
                'type' => 'item',
                'stock' => -1,
                'is_featured' => false,
                'position' => 1,
                'metadata' => ['boost' => 'xp_multiplier', 'value' => 2, 'duration' => 86400],
            ],
            [
                'category_id' => $boostersCategory->id,
                'name' => 'Double XP 7 jours',
                'slug' => 'double-xp-7d',
                'description' => 'Gagnez 2x plus d\'XP pendant 7 jours',
                'price' => 1500,
                'type' => 'item',
                'stock' => -1,
                'is_featured' => true,
                'position' => 2,
                'metadata' => ['boost' => 'xp_multiplier', 'value' => 2, 'duration' => 604800],
            ],
        ];

        foreach ($items as $itemData) {
            Item::create($itemData);
        }

        $this->command->info('Shop data seeded successfully!');
    }
}
