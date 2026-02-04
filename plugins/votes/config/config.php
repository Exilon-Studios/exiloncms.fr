<?php

return [
    'vote_cooldown_minutes' => [
        'type' => 'number',
        'label' => 'Vote Cooldown (minutes)',
        'description' => 'Minimum time between votes for the same server',
        'default' => 1440,
        'min' => 0,
        'max' => 10080,
    ],

    'reward_enabled' => [
        'type' => 'boolean',
        'label' => 'Enable Voting Rewards',
        'description' => 'Give virtual currency to users when they vote',
        'default' => true,
    ],

    'reward_amount' => [
        'type' => 'number',
        'label' => 'Reward Amount',
        'description' => 'Amount of virtual currency to give per vote',
        'default' => 100,
        'min' => 0,
        'max' => 10000,
    ],

    'enable_vote_reminders' => [
        'type' => 'boolean',
        'label' => 'Enable Vote Reminders',
        'description' => 'Notify users when they can vote again',
        'default' => true,
    ],

    'top_sites_enabled' => [
        'type' => 'checkbox',
        'label' => 'Enabled Voting Sites',
        'description' => 'Which voting sites to enable',
        'options' => ['minecraft-mp', 'planetminecraft', 'topg', 'vote-rank'],
        'default' => ['minecraft-mp', 'planetminecraft'],
    ],
];
