<?php

return [
    'default_locale' => [
        'type' => 'select',
        'label' => 'Default Locale',
        'description' => 'Default language for the documentation',
        'default' => 'fr',
        'options' => [
            'fr' => 'Français',
            'en' => 'English',
        ],
    ],

    'cache_enabled' => [
        'type' => 'boolean',
        'label' => 'Enable Cache',
        'description' => 'Cache documentation pages for better performance',
        'default' => true,
    ],

    'cache_duration' => [
        'type' => 'number',
        'label' => 'Cache Duration (seconds)',
        'description' => 'How long to cache documentation pages',
        'default' => 3600,
        'min' => 60,
        'max' => 86400,
    ],

    'comments_enabled' => [
        'type' => 'boolean',
        'label' => 'Enable Comments',
        'description' => 'Allow users to comment on documentation pages',
        'default' => false,
    ],

    'search_enabled' => [
        'type' => 'boolean',
        'label' => 'Enable Search',
        'description' => 'Enable documentation search functionality',
        'default' => true,
    ],

    'edit_button_enabled' => [
        'type' => 'boolean',
        'label' => 'Show Edit Button',
        'description' => 'Show "Edit this page" button on documentation pages (links to GitHub)',
        'default' => true,
    ],

    'github_repository' => [
        'type' => 'text',
        'label' => 'GitHub Repository',
        'description' => 'GitHub repository URL for "Edit this page" links (e.g., https://github.com/user/repo)',
        'default' => 'https://github.com/ExilonStudios/ExilonCMS',
    ],

    'github_branch' => [
        'type' => 'text',
        'label' => 'GitHub Branch',
        'description' => 'Branch to use for edit links',
        'default' => 'main',
    ],

    'table_of_contents_enabled' => [
        'type' => 'boolean',
        'label' => 'Show Table of Contents',
        'description' => 'Display table of contents on documentation pages',
        'default' => true,
    ],

    'reading_time_enabled' => [
        'type' => 'boolean',
        'label' => 'Show Reading Time',
        'description' => 'Display estimated reading time on documentation pages',
        'default' => true,
    ],

    'last_updated_enabled' => [
        'type' => 'boolean',
        'label' => 'Show Last Updated',
        'description' => 'Display last modified date on documentation pages',
        'default' => true,
    ],

    'public_access' => [
        'type' => 'boolean',
        'label' => 'Public Access',
        'description' => 'Allow unauthenticated users to view documentation',
        'default' => true,
    ],
];
