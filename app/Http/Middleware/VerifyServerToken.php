<?php

namespace ExilonCMS\Http\Middleware;

use ExilonCMS\Models\Server;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyServerToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('MCCMS-Link-Token');

        abort_if($token === null, 401, 'No server key provided.');

        $server = Server::firstWhere('token', $token);

        abort_if($server === null, 403, 'Invalid server key.');

        $request->merge(['server-id' => $server->id]);

        return $next($request);
    }
}
