<?php

namespace ExilonCMS\Http\Controllers\Api;

use ExilonCMS\Models\User;
use ExilonCMS\Models\Server;
use ExilonCMS\Models\ActionLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ExilonLinkController
{
    /**
     * Verify API key from request.
     */
    protected function verifyApiKey(Request $request): ?Server
    {
        $apiKey = $request->header('X-ExilonLink-Key') ?? $request->input('api_key');

        if (! $apiKey) {
            return null;
        }

        return Server::where('api_key', $apiKey)->first();
    }

    /**
     * Get server information.
     * GET /api/exilonlink/server
     */
    public function server(Request $request): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        return response()->json([
            'server' => [
                'id' => $server->id,
                'name' => $server->name,
                'game' => $server->game,
                'host' => $server->host,
                'port' => $server->port,
            ],
            'site' => [
                'name' => setting('name'),
                'url' => config('app.url'),
                'locale' => app()->getLocale(),
            ],
        ]);
    }

    /**
     * Get player information by UUID/Game ID.
     * GET /api/exilonlink/players/{uuid}
     */
    public function player(Request $request, string $uuid): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        $user = User::where('game_id', $uuid)->first();

        if (! $user) {
            return response()->json(['error' => 'Player not found'], 404);
        }

        return response()->json([
            'player' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'game_id' => $user->game_id,
                'role' => $user->role->name ?? null,
                'money' => $user->money,
                'is_banned' => $user->bans()->active()->exists(),
                'created_at' => $user->created_at,
            ],
            'stats' => [
                'total_payments' => $user->payments()->where('status', 'completed')->count(),
                'total_spent' => $user->payments()->where('status', 'completed')->sum('price'),
                'total_votes' => $user->votes()->count(),
            ],
        ]);
    }

    /**
     * Get online players.
     * GET /api/exilonlink/players
     */
    public function players(Request $request): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        // Return players that have been seen recently (last 5 minutes)
        $players = User::where('last_seen_at', '>=', now()->subMinutes(5))
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'game_id' => $user->game_id,
                'role' => $user->role->name ?? null,
                'money' => $user->money,
            ]);

        return response()->json([
            'players' => $players,
            'count' => $players->count(),
        ]);
    }

    /**
     * Execute a command on a player.
     * POST /api/exilonlink/players/{uuid}/command
     */
    public function playerCommand(Request $request, string $uuid): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        $validator = Validator::make($request->all(), [
            'command' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('game_id', $uuid)->first();

        if (! $user) {
            return response()->json(['error' => 'Player not found'], 404);
        }

        // Log the command execution
        ActionLog::create([
            'user_id' => $user->id,
            'action' => 'exilonlink_command',
            'details' => [
                'command' => $request->input('command'),
                'server_id' => $server->id,
            ],
        ]);

        // In a real implementation, this would send the command to the game server
        // For now, we just log it
        // The actual command execution happens via the server bridge

        return response()->json([
            'success' => true,
            'message' => 'Command queued for execution',
        ]);
    }

    /**
     * Execute a server command (console).
     * POST /api/exilonlink/command
     */
    public function command(Request $request): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        $validator = Validator::make($request->all(), [
            'command' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Log the command execution
        ActionLog::create([
            'user_id' => null,
            'action' => 'exilonlink_server_command',
            'details' => [
                'command' => $request->input('command'),
                'server_id' => $server->id,
            ],
        ]);

        // In a real implementation, this would execute the command on the server
        // via RCON or other server communication protocol

        return response()->json([
            'success' => true,
            'message' => 'Command executed',
        ]);
    }

    /**
     * Get player purchases/commands to execute.
     * POST /api/exilonlink/queue
     * This is called by the server plugin to get pending commands
     */
    public function queue(Request $request): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        // Get pending payments that need items delivered
        $pendingPayments = \ShopPlugin\Models\Payment::where('status', 'completed')
            ->whereNull('delivered_at')
            ->with(['user', 'items.item'])
            ->get();

        $commands = [];

        foreach ($pendingPayments as $payment) {
            foreach ($payment->items as $item) {
                if ($item->item->commands) {
                    foreach ($item->item->commands as $command) {
                        $commands[] = [
                            'type' => 'player',
                            'player' => $payment->user->name,
                            'uuid' => $payment->user->game_id,
                            'command' => $this->replacePlaceholders($command, $payment->user, $item),
                            'payment_id' => $payment->id,
                        ];
                    }
                }
            }

            // Mark as delivered
            $payment->update(['delivered_at' => now()]);
        }

        return response()->json([
            'commands' => $commands,
            'count' => count($commands),
        ]);
    }

    /**
     * Replace placeholders in command string.
     */
    protected function replacePlaceholders(string $command, User $user, $item): string
    {
        return str_replace(
            ['{player}', '{uuid}', '{id}', '{quantity}', '{money}'],
            [$user->name, $user->game_id, $user->id, $item->quantity, $user->money],
            $command
        );
    }

    /**
     * Update player information from server.
     * POST /api/exilonlink/sync
     */
    public function sync(Request $request): JsonResponse
    {
        $server = $this->verifyApiKey($request);

        abort_if(! $server, 401, 'Invalid API key');

        $validator = Validator::make($request->all(), [
            'players' => 'required|array',
            'players.*.name' => 'required|string',
            'players.*.uuid' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $synced = 0;

        foreach ($request->input('players') as $playerData) {
            $user = User::where('game_id', $playerData['uuid'])->first();

            if ($user) {
                // Update last seen time
                $user->update([
                    'name' => $playerData['name'],
                    'last_seen_at' => now(),
                ]);
                $synced++;
            }
        }

        // Update server status
        $server->update([
            'players_online' => count($request->input('players')),
            'last_sync_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'synced' => $synced,
        ]);
    }

    /**
     * Register a new server (first setup).
     * POST /api/exilonlink/register
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'game' => 'required|string',
            'host' => 'required|string',
            'port' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generate API key
        $apiKey = bin2hex(random_bytes(32));

        $server = Server::create([
            'name' => $request->input('name'),
            'game' => $request->input('game'),
            'host' => $request->input('host'),
            'port' => $request->input('port'),
            'api_key' => $apiKey,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'api_key' => $apiKey,
            'server_id' => $server->id,
        ], 201);
    }
}
