<?php

namespace ExilonCMS\Plugins\Documentation\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware pour vérifier si le plugin Documentation est activé
 */
class DocumentationEnabled
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si le plugin documentation est activé
        $enabledPlugins = setting('enabled_plugins', []);

        \Log::info('DocumentationEnabled middleware - enabled_plugins:', ['plugins' => $enabledPlugins]);

        if (! in_array('documentation', $enabledPlugins, true)) {
            // Si le plugin n'est pas activé, rediriger vers l'accueil ou retourner 404
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Documentation plugin is not enabled',
                ], 403);
            }

            return redirect()->route('home')
                ->with('error', 'The documentation feature is not available.');
        }

        return $next($request);
    }
}
