<?php

return [
    'auto_detect_locale' => [
        'type' => 'boolean',
        'label' => 'Auto-Detect User Locale',
        'description' => 'Automatically detect user locale from browser settings',
        'default' => true,
    ],

    'show_language_switcher' => [
        'type' => 'boolean',
        'label' => 'Show Language Switcher',
        'description' => 'Display language switcher in navigation',
        'default' => true,
    ],

    'fallback_locale' => [
        'type' => 'text',
        'label' => 'Fallback Locale',
        'description' => 'Default locale when translation is not available',
        'default' => 'en',
    ],

    'allow_user_translations' => [
        'type' => 'boolean',
        'label' => 'Allow User Translations',
        'description' => 'Allow users to contribute translations',
        'default' => false,
    ],

    'translation_cache_ttl' => [
        'type' => 'number',
        'label' => 'Translation Cache TTL (minutes)',
        'description' => 'How long to cache translated content',
        'default' => 60,
        'min' => 0,
        'max' => 1440,
    ],
];
