<?php

namespace ExilonCMS;

use ExilonCMS\Games\Game as GameGame;
use ExilonCMS\Support\SettingsRepository;
use Illuminate\Support\Str;

class ExilonCMS
{
    /**
     * The ExilonCMS version.
     *
     * @var string
     */
    private const VERSION = '0.2.2';

    /**
     * Get the current version of ExilonCMS.
     */
    public static function version(): string
    {
        return static::VERSION;
    }

    /**
     * Get the current API version, for extensions, of ExilonCMS.
     */
    public static function apiVersion(): string
    {
        return Str::beforeLast(static::VERSION, '.');
    }

    /**
     * Get a setting value.
     *
     * @param  string|null  $name  Setting name (null to get all settings)
     * @param  mixed  $default  Default value if setting doesn't exist
     * @return mixed
     */
    public static function setting(?string $name = null, mixed $default = null): mixed
    {
        /** @var SettingsRepository $settings */
        $settings = app(SettingsRepository::class);

        if ($name === null) {
            return $settings;
        }

        return $settings->get($name, $default);
    }

    /**
     * Get the current game instance.
     */
    public static function game(): GameGame
    {
        return app(GameGame::class);
    }

    /**
     * Get the site name.
     */
    public static function siteName(): string
    {
        return static::setting('name', config('app.name'));
    }

    /**
     * Get the money name/label.
     */
    public static function moneyName(): string
    {
        return static::setting('money', 'Points');
    }

    /**
     * Get the site URL.
     */
    public static function url(): string
    {
        return config('app.url');
    }
}
