<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Vote Cooldown
    |--------------------------------------------------------------------------
    |
    | Default cooldown period in hours before a user can vote again.
    |
    */
    'cooldown' => env('VOTES_COOLDOWN', 24),

    /*
    |--------------------------------------------------------------------------
    | Auto Reward
    |--------------------------------------------------------------------------
    |
    | Whether to automatically give rewards when a vote is verified.
    |
    */
    'auto_reward' => env('VOTES_AUTO_REWARD', true),

    /*
    |--------------------------------------------------------------------------
    | Reward Multiplier
    |--------------------------------------------------------------------------
    |
    | Multiplier for rewards (e.g., 2 = double rewards during events).
    |
    */
    'reward_multiplier' => env('VOTES_REWARD_MULTIPLIER', 1),
];
