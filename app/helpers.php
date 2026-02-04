<?php

use Carbon\Carbon;
use ExilonCMS\Games\Game;
use ExilonCMS\Http\Controllers\InstallController;
use ExilonCMS\Models\SocialLink;
use ExilonCMS\Support\SettingsRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

if (! function_exists('add_active')) {
    /**
     * Return the active class if the current route match the given patterns, or
     * an empty string otherwise.
     */
    function add_active(string ...$patterns): string
    {
        return Route::is(...$patterns) ? 'active' : '';
    }
}

if (! function_exists('is_installed')) {
    /**
     * Determine whether the application is installed or not.
     * PRIMARY CHECK: Database 'installed_at' setting (column is 'name' NOT 'key'!!)
     */
    function is_installed(): bool
    {
        // ===== PRIMARY CHECK: Database (most reliable) =====
        try {
            // IMPORTANT: settings table uses 'name' column, NOT 'key' !!
            $installed = DB::table('settings')->where('name', 'installed_at')->first();
            if ($installed && ! empty($installed->value)) {
                return true;  // Installed!
            }
        } catch (\Exception $e) {
            // Continue to file checks
        }

        // ===== FALLBACK 1: public/installed.json =====
        if (file_exists(public_path('installed.json'))) {
            return true;
        }

        // ===== FALLBACK 2: bootstrap/cache/installed =====
        if (file_exists(base_path('bootstrap/cache/installed'))) {
            return true;
        }

        // ===== FALLBACK 3: storage/installed.json =====
        if (file_exists(storage_path('installed.json'))) {
            return true;
        }

        // ===== FALLBACK 4: .env flag =====
        if (config('app.installed') === true) {
            return true;
        }

        $key = config('app.key');

        // Check if app key is properly set
        if (empty($key) || $key === InstallController::TEMP_KEY) {
            return false;
        }

        // ===== LAST RESORT: Check if settings table exists =====
        try {
            $schemaManager = app('db.connection')->getSchemaBuilder();

            return $schemaManager->hasTable('settings');
        } catch (\Exception $e) {
            return false;
        }
    }
}

/*
 * Translation related helpers
 */

if (! function_exists('format_date')) {
    /**
     * Format a date using with the format corresponding to the current locale.
     */
    function format_date(Carbon $date, bool $fullTime = false): string
    {
        $format = trans('messages.date.'.($fullTime ? 'full' : 'default'));

        return $date->translatedFormat($format);
    }
}

if (! function_exists('format_date_compact')) {
    /**
     * Format a date using with the compact format corresponding to the current locale.
     */
    function format_date_compact(Carbon $date): string
    {
        return $date->format(trans('messages.date.compact'));
    }
}

if (! function_exists('trans_bool')) {
    /**
     * Translate a boolean value in the current locale.
     */
    function trans_bool(bool $bool): string
    {
        return trans('messages.'.($bool ? 'yes' : 'no'));
    }
}

if (! function_exists('money_name')) {
    /**
     * Return the money name for the given amount.
     */
    function money_name(float $money = 2): string
    {
        $moneyName = setting('money', 'points');

        return Lang::getSelector()->choose($moneyName, $money, app()->getLocale());
    }
}

if (! function_exists('format_money')) {
    /**
     * Format the given money amount with the money name.
     */
    function format_money(float $money)
    {
        return $money.' '.money_name($money);
    }
}

/*
 * Settings/Config helpers
 */
if (! function_exists('setting')) {
    /**
     * Return the value of the given setting name, or the default value if the
     * setting doesn't exist.
     */
    function setting(?string $name = null, mixed $default = null): mixed
    {
        /** @var \ExilonCMS\Support\SettingsRepository $settings */
        $settings = app(SettingsRepository::class);

        if ($name === null) {
            return $settings;
        }

        return $settings->get($name, $default);
    }
}

if (! function_exists('favicon')) {
    /**
     * Return the URL to configured favicon, or the default favicon.
     */
    function favicon(): string
    {
        $icon = setting('icon');

        return $icon !== null ? image_url($icon) : 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>';
    }
}

if (! function_exists('site_logo')) {
    /**
     * Return the URL to configured logo, or the default favicon.
     */
    function site_logo(): string
    {
        $logo = setting('logo');

        return $logo !== null ? image_url($logo) : 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎨</text></svg>';
    }
}

if (! function_exists('site_name')) {
    /**
     * Return the name of the website.
     */
    function site_name(): string
    {
        return setting('name', config('app.name'));
    }
}

if (! function_exists('image_url')) {
    /**
     * Get the URL of the given image, in the public storage.
     */
    function image_url(string $name = ''): string
    {
        return url(Storage::disk('public')->url(rtrim('img/'.$name, '/')));
    }
}

if (! function_exists('social_links')) {
    function social_links(): Collection
    {
        return Cache::remember(SocialLink::CACHE_KEY, now()->addDay(), function () {
            return SocialLink::orderBy('position')->get();
        });
    }
}

/*
 * Other helpers
 */
if (! function_exists('game')) {
    /**
     * Get the current game bridge implementation.
     */
    function game(): Game
    {
        return app('game');
    }
}

if (! function_exists('oauth_login')) {
    /**
     * Determine whether the app use OAuth login.
     */
    function oauth_login(): bool
    {
        return game()->loginWithOAuth();
    }
}

if (! function_exists('dark_theme')) {
    /**
     * Determine whether the user should have the dark theme.
     */
    function dark_theme(bool $defaultDark = false): bool
    {
        $defaultTheme = $defaultDark ? 'dark' : 'light';

        return request()?->cookie('theme', $defaultTheme) === 'dark';
    }
}

if (! function_exists('active_theme_css')) {
    /**
     * Get the CSS URL for the active theme (or preview theme).
     * Returns null if the theme doesn't have custom CSS.
     */
    function active_theme_css(): ?string
    {
        $themeLoader = app(\ExilonCMS\Extensions\Theme\ThemeLoader::class);
        $themeId = $themeLoader->getActiveThemeId();
        $theme = $themeLoader->getTheme($themeId);

        if (! $theme) {
            return null;
        }

        // Check if theme has a CSS file
        $cssPath = $theme['path'].'/resources/css/theme.css';

        if (! file_exists($cssPath)) {
            return null;
        }

        // Return the path to the theme CSS
        // In dev, Vite will handle it; in production, it's in the build manifest
        return '/themes/'.$themeId.'/resources/css/theme.css';
    }
}

if (! function_exists('scheduler_running')) {
    /**
     * Verify if the scheduler is configured and running.
     */
    function scheduler_running(): bool
    {
        $last = setting('schedule.last');

        return $last !== null && Carbon::parse($last)->diffInHours() < 1;
    }
}
