<?php

namespace MCCMS\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware pour vérifier si la registration est activée
 */
class CheckRegistrationStatus
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si la registration est désactivée, rediriger vers la page de login
        if (! setting('register', true) && $request->routeIs('register')) {
            return redirect()->route('login')->with('info', 'La création de compte est actuellement désactivée.');
        }

        return $next($request);
    }
}
