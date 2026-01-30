<?php

namespace ExilonCMS\Plugins\Blog;

use ExilonCMS\Attributes\PluginMeta;
use ExilonCMS\Classes\Plugin\Plugin;

#[PluginMeta(
    id: 'blog',
    name: 'Blog',
    description: 'Système de blog complet avec articles, catégories, tags et commentaires',
    version: '1.0.0',
    author: 'ExilonCMS',
    url: 'https://exiloncms.fr',
    dependencies: [
        'exiloncms' => '>=1.0.0',
    ],
    permissions: [
        'blog.posts.create',
        'blog.posts.edit',
        'blog.posts.delete',
        'blog.posts.publish',
        'blog.categories.manage',
        'blog.comments.moderate',
    ],
)]
class Blog extends Plugin
{
    /**
     * Get plugin configuration fields for admin panel
     */
    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'posts_per_page',
                'label' => 'Articles par page',
                'type' => 'number',
                'default' => 10,
                'description' => 'Nombre d\'articles affichés par page',
                'validation' => 'integer|min:1|max:50',
            ],
            [
                'name' => 'allow_comments',
                'label' => 'Autoriser les commentaires',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Permettre les commentaires sur les articles',
            ],
            [
                'name' => 'require_moderation',
                'label' => 'Modération requise',
                'type' => 'boolean',
                'default' => true,
                'description' => 'Les commentaires doivent être approuvés avant publication',
            ],
            [
                'name' => 'show_author',
                'label' => 'Afficher l\'auteur',
                'type' => 'boolean',
                'default' => true,
            ],
            [
                'name' => 'show_date',
                'label' => 'Afficher la date',
                'type' => 'boolean',
                'default' => true,
            ],
            [
                'name' => 'show_reading_time',
                'label' => 'Afficher le temps de lecture',
                'type' => 'boolean',
                'default' => true,
            ],
        ];
    }

    /**
     * Boot the plugin
     */
    public function boot(): void
    {
        // Routes, views, and migrations are auto-loaded by PluginLoader
        // Add custom boot logic here if needed
    }
}
