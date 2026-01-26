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
        // If CMS is installed, continue normally
        if (is_installed()) {
            return $next($request);
        }

        // If request is for the install page or debug routes, let it through
        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        // Otherwise, redirect to install page
        return redirect()->route('install.index');
    }
}
