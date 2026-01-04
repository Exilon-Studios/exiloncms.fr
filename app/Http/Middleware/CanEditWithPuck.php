<?php

namespace MCCMS\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanEditWithPuck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated and has permission to edit with Puck
        if (!$user || !$user->can('admin.pages.puck-edit')) {
            abort(403, 'You do not have permission to edit with Puck.');
        }

        return $next($request);
    }
}
