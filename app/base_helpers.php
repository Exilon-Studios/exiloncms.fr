<?php

use ExilonCMS\ExilonCMS;

/*
|--------------------------------------------------------------------------
| Base helpers
|--------------------------------------------------------------------------
|
| Here is where are registered the helpers that should override a Laravel
| helper because this file is load before the entire framework.
|
*/

if (! function_exists('asset')) {
    /**
     * Generate an asset path for the application.
     */
    function asset(string $path, ?bool $secure = null): string
    {
        // For Vite build assets, don't add prefix or version (Vite handles it)
        if (str_starts_with($path, 'build/')) {
            return app('url')->asset($path, $secure);
        }

        // For other assets, add version cache busting
        $query = str_contains($path, '?') ? '' : '?v'.ExilonCMS::version();

        return app('url')->asset($path.$query, $secure);
    }
}
