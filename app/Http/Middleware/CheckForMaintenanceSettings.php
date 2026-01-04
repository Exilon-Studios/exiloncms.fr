<?php

namespace MCCMS\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckForMaintenanceSettings
{
    /**
     * The routes that should be reachable while maintenance mode is enabled.
     */
    protected array $exceptRoutes = [
        'login',
        'login.*',
        'password.*',
        'logout',
        'admin.*',
    ];

    /**
     * The paths that should be reachable while maintenance mode is enabled.
     */
    protected array $except = [
        'user/login',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if maintenance mode is enabled
        $maintenanceEnabled = (bool) setting('maintenance.enabled', false);

        if (! $maintenanceEnabled) {
            return $next($request);
        }

        // Routes always accessible (login, admin, etc.)
        if ($request->routeIs($this->exceptRoutes) || $request->is($this->except)) {
            return $next($request);
        }

        // Admins with maintenance.access permission can access
        if ($request->user() !== null && $request->user()->can('maintenance.access')) {
            return $next($request);
        }

        // Get blocked paths (null or empty array = global maintenance)
        $blockedPaths = setting('maintenance.paths');

        // If no specific paths defined, block everything
        if (empty($blockedPaths)) {
            return $this->renderMaintenanceView();
        }

        // Normalize blocked paths
        $normalizedPaths = array_map(function (string $path) {
            $normalized = Str::endsWith($path, '/*')
                ? Str::replaceLast('/*', '*', $path)
                : $path;

            return trim($normalized, '/');
        }, $blockedPaths);

        // If request matches a blocked path, show maintenance
        if ($request->is($normalizedPaths)) {
            return $this->renderMaintenanceView();
        }

        // Otherwise let pass through
        return $next($request);
    }

    protected function renderMaintenanceView(): Response
    {
        $maintenanceTitle = setting('maintenance.title');
        $maintenanceSubtitle = setting('maintenance.subtitle');

        return Inertia::render('Maintenance', [
            'message' => $maintenanceSubtitle ?: trans('messages.maintenance.message'),
            'title' => $maintenanceTitle,
            'subtitle' => $maintenanceSubtitle,
        ])->toResponse(request())->setStatusCode(503);
    }
}
