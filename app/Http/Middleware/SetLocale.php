<?php

namespace ExilonCMS\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get locale from settings, fallback to config
        $locale = setting('locale', config('app.locale', 'en'));

        // Set the application locale
        App::setLocale($locale);

        // Also set the timezone from settings
        $timezone = setting('timezone', config('app.timezone', 'UTC'));
        config(['app.timezone' => $timezone]);
        date_default_timezone_set($timezone);

        return $next($request);
    }
}
