<?php

namespace ExilonCMS\Plugins\Votes;

use ExilonCMS\Models\Permission;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class VotesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/votes.php',
            'votes'
        );
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/admin.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'votes');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/votes.php' => config_path('votes.php'),
            ], 'votes-config');

            $this->commands([
                \ExilonCMS\Plugins\Votes\Console\ProcessPendingVotes::class,
            ]);
        }

        Permission::registerPermissions([
            'votes.manage' => 'Manage voting sites and rewards',
            'votes.rewards.manage' => 'Manage vote rewards',
        ]);

        Route::bind('vote', function ($value) {
            return \ExilonCMS\Plugins\Votes\Models\Vote::findOrFail($value);
        });

        Route::bind('voteReward', function ($value) {
            return \ExilonCMS\Plugins\Votes\Models\VoteReward::findOrFail($value);
        });
    }
}
