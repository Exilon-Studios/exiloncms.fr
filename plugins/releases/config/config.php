<?php

return [
    'enable_rss' => [
        'type' => 'boolean',
        'label' => 'Enable RSS Feed',
        'description' => 'Generate RSS feed for release notes',
        'default' => true,
    ],

    'show_download_count' => [
        'type' => 'boolean',
        'label' => 'Show Download Counts',
        'description' => 'Display download counts for releases',
        'default' => true,
    ],

    'releases_per_page' => [
        'type' => 'number',
        'label' => 'Releases per Page',
        'description' => 'Number of releases to display per page',
        'default' => 10,
        'min' => 5,
        'max' => 50,
    ],

    'auto_notify_updates' => [
        'type' => 'boolean',
        'label' => 'Auto-Notify on New Releases',
        'description' => 'Automatically notify users when new releases are published',
        'default' => true,
    ],

    'markdown_changelog' => [
        'type' => 'boolean',
        'label' => 'Enable Markdown in Changelogs',
        'description' => 'Allow Markdown formatting in changelog content',
        'default' => true,
    ],
];
