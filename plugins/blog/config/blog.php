<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Blog Settings
    |--------------------------------------------------------------------------
    |
    | Configuration options for the Blog plugin
    |
    */

    'posts_per_page' => env('BLOG_POSTS_PER_PAGE', 12),

    'allow_comments' => env('BLOG_ALLOW_COMMENTS', true),

    'require_moderation' => env('BLOG_REQUIRE_MODERATION', true),

    'show_author' => env('BLOG_SHOW_AUTHOR', true),

    'show_date' => env('BLOG_SHOW_DATE', true),

    'show_reading_time' => env('BLOG_SHOW_READING_TIME', true),

    'reading_time_wpm' => env('BLOG_READING_TIME_WPM', 200),

    'featured_image_width' => 1200,

    'featured_image_height' => 630,

    'excerpt_length' => 160,
];
