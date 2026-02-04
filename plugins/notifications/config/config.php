<?php

return [
    'email_notifications' => [
        'type' => 'boolean',
        'label' => 'Email Notifications',
        'description' => 'Enable email notifications for users',
        'default' => true,
    ],

    'notification_types' => [
        'type' => 'checkbox',
        'label' => 'Notification Types',
        'description' => 'Which notification types to enable',
        'options' => ['new_post', 'new_comment', 'profile_update', 'purchase'],
        'default' => ['new_post', 'purchase'],
    ],

    'batch_notifications' => [
        'type' => 'boolean',
        'label' => 'Batch Notifications',
        'description' => 'Combine multiple notifications into one email',
        'default' => false,
    ],
];
