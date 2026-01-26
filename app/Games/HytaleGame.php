<?php

namespace ExilonCMS\Games;

use ExilonCMS\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class HytaleGame extends Game
{
    public const PLAYER_LOOKUP = 'https://playerdb.co/api/player/hytale/';

    protected UserAttribute $userPrimaryAttribute = UserAttribute::NAME;

    public function id(): string
    {
        return 'hytale';
    }

    public function name(): string
    {
        return 'Hytale';
    }

    public function getAvatarUrl(User $user, int $size = 64): string
    {
        return "https://crafthead.net/hytale/avatar/{$user->name}/{$size}.png";
    }

    public function getUserUniqueId(string $name): ?string
    {
        return Cache::remember('games.hytale.uuid.'.$name, now()->addMinutes(30), function () use ($name) {
            return Http::get(self::PLAYER_LOOKUP.$name)
                ->throw()
                ->json('data.player.id');
        });
    }

    public function getUserName(User $user): ?string
    {
        if ($user->game_id === null) {
            return $user->name;
        }

        $cacheKey = 'games.hytale.profile.'.$user->game_id;

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($user) {
            return Http::get(self::PLAYER_LOOKUP.$user->game_id)
                ->throw()
                ->json('data.player.username');
        });
    }

    public function getSupportedServers(): array
    {
        // Hytale doesn't have server bridges yet, using AzLink as placeholder
        // This will need to be updated when Hytale releases server APIs
        return [
            'azlink' => \ExilonCMS\Games\Minecraft\Servers\AzLink::class,
        ];
    }

    public function trans(string $key, array $placeholders = []): string
    {
        return trans('game.hytale.'.$key, $placeholders);
    }
}
