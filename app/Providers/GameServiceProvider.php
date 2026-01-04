<?php

namespace MCCMS\Providers;

use MCCMS\Games\FallbackGame;
use MCCMS\Games\FiveMGame;
use MCCMS\Games\Minecraft\MinecraftBedrockGame;
use MCCMS\Games\Minecraft\MinecraftOfflineGame;
use MCCMS\Games\Minecraft\MinecraftOnlineGame;
use MCCMS\Games\Steam\FiveMGame as FiveMGameLegacy;
use MCCMS\Games\Steam\RustGame;
use MCCMS\Games\Steam\SteamGame;
use MCCMS\Socialite\CfxProvider;
use MCCMS\Socialite\DiscordProvider;
use MCCMS\Socialite\EpicOnlineServiceProvider;
use MCCMS\Socialite\Minecraft\AzuriomMinecraftProvider;
use MCCMS\Socialite\Xbox\AzuriomXboxProvider;
use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Contracts\Factory;

class GameServiceProvider extends ServiceProvider
{
    protected static array $games = [];

    /**
     * Register services.
     */
    public function register(): void
    {
        self::registerGames([
            'mc-online' => MinecraftOnlineGame::class,
            'mc-offline' => MinecraftOfflineGame::class,
            'mc-bedrock' => MinecraftBedrockGame::class,
            'fivem-cfx' => FiveMGame::class,
            'gmod' => SteamGame::forName('gmod', 'Garry\'s Mod', true),
            'ark' => SteamGame::forName('ark', 'ARK: Survival Evolved'),
            'ark-sa' => SteamGame::forName('ark-sa', 'ARK: Survival Ascended'),
            'rust' => RustGame::class,
            'fivem' => FiveMGameLegacy::class,
            'csgo' => SteamGame::forName('csgo', 'Counter-Strike 2', true),
            'tf2' => SteamGame::forName('tf2', 'Team Fortress 2'),
            'unturned' => SteamGame::forName('unturned', 'Unturned'),
            '7dtd' => SteamGame::forName('7dtd', '7 Days to Die', true),
        ]);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerSocialiteProviders();

        $gameType = config('mccms.game') ?? '';
        $game = Arr::get(static::$games, $gameType, FallbackGame::class);

        if (is_string($game)) {
            $this->app->singleton('game', $game);

            return;
        }

        $this->app->instance('game', $game);
    }

    protected function registerSocialiteProviders(): void
    {
        $socialite = $this->app->make(Factory::class);

        $socialite->extend('xbox', function ($app) use ($socialite) {
            $config = $app['config']['services.microsoft'];

            return $socialite->buildProvider(AzuriomXboxProvider::class, $config);
        });

        $socialite->extend('minecraft', function ($app) use ($socialite) {
            $config = $app['config']['services.microsoft'];

            return $socialite->buildProvider(AzuriomMinecraftProvider::class, $config);
        });

        $socialite->extend('epic-online-services', function ($app) use ($socialite) {
            $config = $app['config']['services.epicgames'];

            return $socialite->buildProvider(EpicOnlineServiceProvider::class, $config);
        });

        $socialite->extend('cfx', function () use ($socialite) {
            return $socialite->buildProvider(CfxProvider::class, [
                'app_name' => site_name(),
                'client_id' => setting('cfx.id'),
                'client_secret' => '',
                'redirect' => '/user/login/callback',
            ]);
        });

        $socialite->extend('discord', function () use ($socialite) {
            return $socialite->buildProvider(DiscordProvider::class, [
                'client_id' => setting('discord.client_id'),
                'client_secret' => setting('discord.client_secret'),
                'redirect' => '/profile/discord/callback',
            ]);
        });
    }

    public static function registerGames(array $games): void
    {
        static::$games = array_merge(static::$games, $games);
    }
}
