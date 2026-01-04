<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LandingSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Hero Section
            [
                'key' => 'hero.title.main',
                'value' => 'OUTLAND',
                'type' => 'text',
                'group' => 'hero',
                'order' => 1,
            ],
            [
                'key' => 'hero.title.highlight',
                'value' => 'SERVEUR',
                'type' => 'text',
                'group' => 'hero',
                'order' => 2,
            ],
            [
                'key' => 'hero.subtitle',
                'value' => 'Rejoignez la meilleure communauté Minecraft francophone',
                'type' => 'text',
                'group' => 'hero',
                'order' => 3,
            ],
            [
                'key' => 'hero.cta.text',
                'value' => 'REJOINDRE MAINTENANT',
                'type' => 'text',
                'group' => 'hero',
                'order' => 4,
            ],
            [
                'key' => 'hero.cta.url',
                'value' => '/register',
                'type' => 'text',
                'group' => 'hero',
                'order' => 5,
            ],

            // Features Section
            [
                'key' => 'features.section.badge',
                'value' => 'Pourquoi nous rejoindre',
                'type' => 'text',
                'group' => 'features',
                'order' => 1,
            ],
            [
                'key' => 'features.section.title.main',
                'value' => 'L\'EXPÉRIENCE',
                'type' => 'text',
                'group' => 'features',
                'order' => 2,
            ],
            [
                'key' => 'features.section.title.highlight',
                'value' => 'ULTIME',
                'type' => 'text',
                'group' => 'features',
                'order' => 3,
            ],
            [
                'key' => 'features.section.subtitle',
                'value' => 'Des plugins exclusifs, une communauté passionnée et des performances optimales',
                'type' => 'text',
                'group' => 'features',
                'order' => 4,
            ],
            [
                'key' => 'features.items',
                'value' => json_encode([
                    [
                        'icon' => 'Sword',
                        'title' => 'PvP Compétitif',
                        'description' => 'Arènes PvP équilibrées avec système de ranking et tournois réguliers.',
                    ],
                    [
                        'icon' => 'Shield',
                        'title' => 'Anti-Cheat Avancé',
                        'description' => 'Protection maximale pour une expérience de jeu 100% équitable.',
                    ],
                    [
                        'icon' => 'Users',
                        'title' => 'Communauté Active',
                        'description' => 'Plus de 2,500 joueurs passionnés et une équipe de modération 24/7.',
                    ],
                    [
                        'icon' => 'Zap',
                        'title' => 'Serveur Optimisé',
                        'description' => '20 TPS constant, latence minimale, infrastructure haute performance.',
                    ],
                    [
                        'icon' => 'Server',
                        'title' => '5 Serveurs',
                        'description' => 'Survie, Créatif, PvP, Mini-jeux et événements spéciaux.',
                    ],
                    [
                        'icon' => 'Trophy',
                        'title' => 'Événements',
                        'description' => 'Tournois hebdomadaires avec récompenses réelles et items exclusifs.',
                    ],
                ]),
                'type' => 'json',
                'group' => 'features',
                'order' => 5,
            ],

            // How It Works Section
            [
                'key' => 'howitworks.section.badge',
                'value' => 'Guide de démarrage',
                'type' => 'text',
                'group' => 'howitworks',
                'order' => 1,
            ],
            [
                'key' => 'howitworks.section.title.main',
                'value' => 'Comment',
                'type' => 'text',
                'group' => 'howitworks',
                'order' => 2,
            ],
            [
                'key' => 'howitworks.section.title.highlight',
                'value' => 'ça fonctionne ?',
                'type' => 'text',
                'group' => 'howitworks',
                'order' => 3,
            ],
            [
                'key' => 'howitworks.section.subtitle',
                'value' => 'Rejoins notre serveur en quelques étapes simples et commence ton aventure dès maintenant',
                'type' => 'text',
                'group' => 'howitworks',
                'order' => 4,
            ],
            [
                'key' => 'howitworks.server_address',
                'value' => 'play.outland.fr',
                'type' => 'text',
                'group' => 'howitworks',
                'order' => 5,
            ],
            [
                'key' => 'howitworks.steps',
                'value' => json_encode([
                    [
                        'icon' => 'UserPlus',
                        'number' => '01',
                        'title' => 'Avoir un compte Minecraft Premium',
                        'description' => 'Assure-toi d\'avoir un compte Minecraft Java Edition premium.',
                    ],
                    [
                        'icon' => 'Download',
                        'number' => '02',
                        'title' => 'Lancer le jeu en 1.21.4',
                        'description' => 'Lance Minecraft et sélectionne la version 1.21.4.',
                    ],
                    [
                        'icon' => 'Server',
                        'number' => '03',
                        'title' => 'Ajouter le serveur',
                        'description' => 'Dans le menu multijoueur, clique sur \'Ajouter un serveur\' et entre l\'IP: play.outlandmc.fr',
                    ],
                    [
                        'icon' => 'Play',
                        'number' => '04',
                        'title' => 'Commence à jouer',
                        'description' => 'Connecte-toi et découvre notre univers unique avec des milliers de joueurs !',
                    ],
                ]),
                'type' => 'json',
                'group' => 'howitworks',
                'order' => 6,
            ],

            // Social Links
            [
                'key' => 'social.links',
                'value' => json_encode([
                    [
                        'name' => 'Discord',
                        'url' => 'https://discord.gg/outland',
                        'color' => 'hover:text-primary',
                    ],
                    [
                        'name' => 'Twitter',
                        'url' => 'https://twitter.com/outland',
                        'color' => 'hover:text-primary',
                    ],
                    [
                        'name' => 'YouTube',
                        'url' => 'https://youtube.com/@outland',
                        'color' => 'hover:text-primary',
                    ],
                    [
                        'name' => 'Instagram',
                        'url' => 'https://instagram.com/outland',
                        'color' => 'hover:text-primary',
                    ],
                    [
                        'name' => 'TikTok',
                        'url' => 'https://tiktok.com/@outland',
                        'color' => 'hover:text-primary',
                    ],
                ]),
                'type' => 'json',
                'group' => 'social',
                'order' => 1,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('landing_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
