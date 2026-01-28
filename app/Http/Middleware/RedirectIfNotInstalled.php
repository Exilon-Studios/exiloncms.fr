<?php

namespace ExilonCMS\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNotInstalled
{
    /**
     * The paths that should be reachable even if not installed.
     */
    protected array $except = [
        'install',
        'install/*',
        'wizard',
        'wizard/*',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->path();
        $routeName = $request->route()?->getName();

        // Check if request is for install/wizard routes - ALWAYS allow these
        foreach ($this->except as $pattern) {
            // Match patterns like 'install', 'install/*', 'wizard', 'wizard/*'
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        // If CMS is installed, continue normally for non-install routes
        if (is_installed()) {
            return $next($request);
        }

        // CMS not installed and not on install page - redirect to install
        return redirect()->route('install.index');
    }
}
