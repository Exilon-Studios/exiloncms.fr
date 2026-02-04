<?php

return [
    'posts_per_page' => [
        'type' => 'number',
        'label' => 'Posts per Page',
        'description' => 'Number of blog posts to display per page',
        'default' => 10,
        'min' => 5,
        'max' => 50,
    ],

    'enable_comments' => [
        'type' => 'boolean',
        'label' => 'Enable Comments',
        'description' => 'Allow users to comment on blog posts',
        'default' => true,
    ],

    'require_moderation' => [
        'type' => 'boolean',
        'label' => 'Require Comment Moderation',
        'description' => 'Comments must be approved before being published',
        'default' => false,
    ],

    'enable_rss' => [
        'type' => 'boolean',
        'label' => 'Enable RSS Feed',
        'description' => 'Generate RSS feed for blog posts',
        'default' => true,
    ],

    'share_buttons' => [
        'type' => 'checkbox',
        'label' => 'Social Share Buttons',
        'description' => 'Which social media share buttons to display',
        'options' => ['twitter', 'facebook', 'linkedin', 'reddit'],
        'default' => ['twitter', 'facebook'],
    ],
];
