<?php

namespace ExilonCMS\Http\Middleware;

use ExilonCMS\Http\Controllers\InstallController;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstalled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if already installed
        if ($this->isInstalled()) {
            // If accessing install routes while installed, redirect to home
            if ($request->is('install*')) {
                return Redirect::route('home');
            }

            return $next($request);
        }

        // Not installed - check if accessing install routes
        if ($request->is('install*')) {
            // ExilonCMS is not installed... yet !
            // Unregister view composers because database is not setup
            Event::forget('composing: *');

            // Set a temporary key during the installation
            config([
                'app.key' => InstallController::TEMP_KEY,
                'app.debug' => true,
                'app.env' => 'local',
            ]);

            App::setLocale($locale = $this->getRequestLocale($request));

            if (! is_writable(base_path())) {
                return new Response('Missing write permission on '.base_path());
            }

            return $this->addLocaleCookieToResponse($next($request), $locale);
        }

        // Not installed and not accessing install routes - redirect to install
        return Redirect::route('install.welcome');
    }

    /**
     * Check if ExilonCMS is already installed.
     */
    protected function isInstalled(): bool
    {
        // Check if APP_KEY is set and not the temporary key
        if (empty(config('app.key')) || config('app.key') === InstallController::TEMP_KEY) {
            return false;
        }

        // Check if installation marker file exists
        $markerFile = storage_path('installed.json');
        if (! file_exists($markerFile)) {
            return false;
        }

        // Optionally check if database is connected and users table exists
        try {
            if (! app()->make('db')->getPdo()) {
                return false;
            }

            $tablePrefix = config('database.connections.'.config('database.default').'.prefix');
            $usersTable = $tablePrefix.'users';

            if (! \Schema::hasTable($usersTable)) {
                return false;
            }

            // Check if admin user exists
            $adminExists = \ExilonCMS\Models\User::whereHas('role', function ($query) {
                $query->where('is_admin', true);
            })->exists();

            return $adminExists;
        } catch (\Exception $e) {
            return false;
        }
    }

    protected function getRequestLocale(Request $request): ?string
    {
        $locales = InstallController::getAvailableLocaleCodes();
        $locale = $request->input('locale');

        if ($locales->contains($locale)) {
            return $locale;
        }

        if ($locales->contains($locale = $request->cookie('exiloncms_locale'))) {
            return $locale;
        }

        return $request->getPreferredLanguage($locales->all());
    }

    protected function addLocaleCookieToResponse(Response $response, string $locale): Response
    {
        $response->headers->setCookie(cookie('exiloncms_locale', $locale, 60 * 24));

        return $response;
    }
}
