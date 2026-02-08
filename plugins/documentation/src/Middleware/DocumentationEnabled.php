<?php

namespace ExilonCMS\Plugins\Documentation\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
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
        // Vérifier si le plugin documentation est activé (depuis la DB ou plugins.json)
        $enabledPlugins = $this->getEnabledPlugins();

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

    /**
     * Get the list of enabled plugins from both database and plugins.json
     */
    protected function getEnabledPlugins(): array
    {
        // First check database setting
        $enabledPlugins = setting('enabled_plugins', []);

        // If database is empty or doesn't have plugins, check plugins.json file
        if (empty($enabledPlugins)) {
            $pluginsFile = base_path('plugins/plugins.json');

            if (File::exists($pluginsFile)) {
                $content = File::get($pluginsFile);
                $plugins = json_decode($content, true);

                if (is_array($plugins)) {
                    return array_filter($plugins, fn ($plugin) => is_string($plugin) && ! empty($plugin));
                }
            }
        }

        return is_array($enabledPlugins) ? $enabledPlugins : [];
    }
}
