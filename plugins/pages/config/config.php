<?php

return [
    'enable_search' => [
        'type' => 'boolean',
        'label' => 'Enable Page Search',
        'description' => 'Enable search functionality for custom pages',
        'default' => true,
    ],

    'show_last_modified' => [
        'type' => 'boolean',
        'label' => 'Show Last Modified Date',
        'description' => 'Display the last modified date on pages',
        'default' => true,
    ],

    'show_author' => [
        'type' => 'boolean',
        'label' => 'Show Page Author',
        'description' => 'Display the author name on pages',
        'default' => false,
    ],

    'pages_per_page' => [
        'type' => 'number',
        'label' => 'Pages per Page',
        'description' => 'Number of pages to display per page in listings',
        'default' => 12,
        'min' => 6,
        'max' => 48,
    ],

    'allow_comments' => [
        'type' => 'boolean',
        'label' => 'Allow Comments on Pages',
        'description' => 'Allow users to comment on custom pages',
        'default' => false,
    ],
];
