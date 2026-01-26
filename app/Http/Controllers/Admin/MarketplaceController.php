<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $type = $request->get('type', 'all');
        $search = $request->get('search', '');

        $cacheKey = "marketplace.items.{$page}.{$type}.{$search}";
        $items = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($type, $search) {
            return $this->fetchFromMarketplace('/api/v1/items', [
                'type' => $type,
                'search' => $search,
                'page' => $request->get('page', 1),
            ]);
        });

        return Inertia::render('Admin/Marketplace/Index', [
            'items' => $items['data'] ?? [],
            'pagination' => $items['meta'] ?? [],
            'type' => $type,
            'search' => $search,
            'isConnected' => $this->isConnected(),
        ]);
    }

    public function connect(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string',
        ]);

        // Verify API key with marketplace
        try {
            $response = Http::timeout(10)->post(
                config('services.marketplace.url').'/api/v1/sso/verify',
                [
                    'api_key' => $request->api_key,
                    'site_url' => config('app.url'),
                ]
            );

            if (! $response->successful()) {
                return back()->with('error', 'Invalid API key. Please check and try again.');
            }

            $data = $response->json();

            // Store API key encrypted
            Setting::updateOrCreate(
                ['key' => 'marketplace_api_key'],
                [
                    'name' => 'Marketplace API Key',
                    'value' => encrypt($request->api_key),
                    'type' => 'encrypted',
                ]
            );

            // Store user info if available
            if (isset($data['user'])) {
                Setting::updateOrCreate(
                    ['key' => 'marketplace_user_id'],
                    [
                        'name' => 'Marketplace User ID',
                        'value' => $data['user']['id'],
                        'type' => 'text',
                    ]
                );
            }

            return back()->with('success', 'Successfully connected to marketplace!');

        } catch (\Exception $e) {
            return back()->with('error', 'Connection failed: '.$e->getMessage());
        }
    }

    public function disconnect()
    {
        Setting::where('key', 'marketplace_api_key')->delete();
        Setting::where('key', 'marketplace_user_id')->delete();

        return back()->with('success', 'Disconnected from marketplace.');
    }

    public function install(Request $request, string $itemId)
    {
        if (! $this->isConnected()) {
            return back()->with('error', 'Please connect to marketplace first.');
        }

        try {
            $apiKey = decrypt(setting('marketplace_api_key'));

            // Get download URL from marketplace
            $response = Http::timeout(30)->withToken($apiKey)
                ->get(config('services.marketplace.url')."/api/v1/items/{$itemId}/download");

            if (! $response->successful()) {
                return back()->with('error', 'Failed to get download URL.');
            }

            $data = $response->json();
            $downloadUrl = $data['download_url'];
            $pluginId = $data['plugin_id'];
            $type = $data['type'];

            // Download file
            $tempPath = storage_path('app/temp/'.$pluginId.'.zip');
            file_put_contents($tempPath, file_get_contents($downloadUrl));

            // Redirect to plugin manager upload
            return response()->download($tempPath);

        } catch (\Exception $e) {
            return back()->with('error', 'Installation failed: '.$e->getMessage());
        }
    }

    public function sync()
    {
        // Clear marketplace cache
        Cache::forget('marketplace.items.*');

        return back()->with('success', 'Marketplace cache cleared.');
    }

    protected function isConnected(): bool
    {
        return ! empty(setting('marketplace_api_key'));
    }

    protected function fetchFromMarketplace(string $endpoint, array $params = [])
    {
        $apiKey = setting('marketplace_api_key');

        if (! $apiKey) {
            return ['data' => [], 'meta' => []];
        }

        try {
            $response = Http::timeout(10)->withToken($apiKey)
                ->get(config('services.marketplace.url').$endpoint, $params);

            return $response->json();
        } catch (\Exception $e) {
            return ['data' => [], 'meta' => []];
        }
    }
}
