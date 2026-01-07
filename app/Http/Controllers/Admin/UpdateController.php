<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\ExilonCMS;
use ExilonCMS\Extensions\UpdateManager;
use ExilonCMS\Extensions\Plugin\PluginManager;
use ExilonCMS\Extensions\Theme\ThemeManager;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\ActionLog;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class UpdateController extends Controller
{
    protected UpdateManager $updates;

    /**
     * Create a new controller instance.
     */
    public function __construct(UpdateManager $updates)
    {
        $this->updates = $updates;
    }

    /**
     * Convert download URL to release page URL
     */
    protected function getReleaseUrl(string $downloadUrl, ?string $repoUrl = null): ?string
    {
        // If repo URL is provided, use it
        if ($repoUrl && str_contains($repoUrl, 'github.com')) {
            return rtrim($repoUrl, '/') . '/releases';
        }

        // Try to extract from download URL
        if (preg_match('~github\.com/([^/]+)/([^/]+)/releases/download/([^/]+)~', $downloadUrl, $matches)) {
            $owner = $matches[1];
            $repo = $matches[2];
            $tag = $matches[3];
            return "https://github.com/{$owner}/{$repo}/releases/tag/{$tag}";
        }

        return null;
    }

    public function index()
    {
        $pluginManager = app(PluginManager::class);
        $themeManager = app(ThemeManager::class);

        // Get plugins with updates (force refresh)
        $pluginsUpdates = $pluginManager->getPluginsToUpdate(true)->map(function ($plugin) use ($pluginManager) {
            $updates = app(UpdateManager::class)->getPlugins(true);
            $id = $plugin->apiId ?? 0;

            // Find marketplace plugin by ID (not array key)
            $updateData = collect($updates)->firstWhere('id', $id) ?? [];

            $description = $pluginManager->findDescription($plugin->id);
            $requiredApi = $description->api ?? '0.2';
            $currentApi = ExilonCMS::apiVersion();

            $downloadUrl = $updateData['url'] ?? null;
            $repoUrl = $description->url ?? null;
            $changelogUrl = $downloadUrl ? $this->getReleaseUrl($downloadUrl, $repoUrl) : null;

            return [
                'id' => $plugin->id,
                'name' => $plugin->name,
                'currentVersion' => $plugin->version,
                'latestVersion' => $updateData['version'] ?? null,
                'description' => $plugin->description ?? null,
                'changelogUrl' => $changelogUrl,
                'requiredApi' => $requiredApi,
                'isCompatible' => version_compare($currentApi, $requiredApi, '>='),
            ];
        })->values()->toArray();

        // Get themes with updates (force refresh)
        $themesUpdates = $themeManager->getThemesToUpdate(true)->map(function ($theme) use ($themeManager) {
            $updates = app(UpdateManager::class)->getThemes(true);
            $id = $theme->apiId ?? 0;

            // Find marketplace theme by ID (not array key)
            $updateData = collect($updates)->firstWhere('id', $id) ?? [];

            $description = $themeManager->findDescription($theme->id);
            $requiredApi = $description->api ?? '0.2';
            $currentApi = ExilonCMS::apiVersion();

            $downloadUrl = $updateData['url'] ?? null;
            $repoUrl = $description->url ?? null;
            $changelogUrl = $downloadUrl ? $this->getReleaseUrl($downloadUrl, $repoUrl) : null;

            return [
                'id' => $theme->id,
                'name' => $theme->name,
                'currentVersion' => $theme->version,
                'latestVersion' => $updateData['version'] ?? null,
                'description' => $theme->description ?? null,
                'changelogUrl' => $changelogUrl,
                'requiredApi' => $requiredApi,
                'isCompatible' => version_compare($currentApi, $requiredApi, '>='),
            ];
        })->values()->toArray();

        return Inertia::render('Admin/Updates/Index', [
            'currentVersion' => ExilonCMS::version(),
            'lastVersion' => $this->updates->getUpdate(),
            'hasUpdate' => $this->updates->hasUpdate(),
            'isDownloaded' => $this->updates->isLastVersionDownloaded(),
            'pluginsUpdates' => $pluginsUpdates,
            'themesUpdates' => $themesUpdates,
        ]);
    }

    public function fetch()
    {
        $response = to_route('admin.update.index');

        try {
            // Force fetch updates (GitHub or marketplace depending on config)
            if ($this->updates->isGithubEnabled()) {
                $this->updates->forceFetchGithubRelease();
            } else {
                $this->updates->forceFetchMarketplace();
            }
        } catch (Exception $e) {
            return $response->with('error', trans('messages.status.error', [
                'error' => $e->getMessage(),
            ]));
        }

        if (! $this->updates->hasUpdate(true)) {
            return $response->with('success', trans('admin.update.latest'));
        }

        return $response;
    }

    public function download(Request $request)
    {
        $update = $this->updates->getUpdate(true);

        if (! $this->updates->hasUpdate()) {
            return response()->json([
                'message' => trans('admin.update.latest'),
            ]);
        }

        $minPhp = Arr::get($update, 'php_version', '8.2');

        if (version_compare(PHP_VERSION, $minPhp, '<')) {
            return response()->json([
                'message' => trans('admin.update.php', ['version' => $minPhp]),
            ], 422);
        }

        try {
            $this->updates->download($update);
        } catch (Exception $e) {
            return response()->json([
                'message' => trans('messages.status.error', [
                    'error' => $e->getMessage(),
                ]),
            ], 422);
        }

        $request->session()->flash('success', trans('admin.update.downloaded'));

        return response()->noContent();
    }

    public function install(Request $request)
    {
        $update = $this->updates->getUpdate(true);

        if (! $this->updates->hasUpdate()) {
            return response()->json([
                'message' => trans('admin.update.latest'),
            ]);
        }

        try {
            $this->updates->installUpdate($update);
        } catch (Exception $e) {
            return response()->json([
                'message' => trans('messages.status.error', [
                    'error' => $e->getMessage(),
                ]),
            ], 422);
        }

        $request->session()->flash('success', trans('admin.update.installed'));

        ActionLog::log('updates.installed');

        return response()->noContent();
    }

    public function version()
    {
        return response()->json([
            'exiloncms' => ExilonCMS::version(),
            'php' => PHP_VERSION,
        ]);
    }
}

