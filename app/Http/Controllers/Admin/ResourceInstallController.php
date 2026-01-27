<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Extensions\Theme\ThemeManager;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Resource;
use ExilonCMS\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http as HttpClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class ResourceInstallController extends Controller
{
    public function __construct(
        private ThemeManager $themeManager
    ) {}

    /**
     * Display the external resources installation page.
     */
    public function index(Request $request)
    {
        Gate::authorize('admin.resources.settings');

        // Fetch available resources from external API
        $marketplaceUrl = config('services.marketplace.url', 'https://marketplace.exiloncms.fr');
        $type = $request->query('type', 'all');
        $search = $request->query('search');

        try {
            $response = HttpClient::timeout(10)->get("{$marketplaceUrl}/api/resources", [
                'type' => $type,
                'search' => $search,
                'per_page' => 50,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $resources = $data['data'] ?? [];
            } else {
                $resources = [];
            }
        } catch (\Exception $e) {
            Log::error('Failed to fetch external resources', [
                'error' => $e->getMessage(),
            ]);
            $resources = [];
        }

        // Get locally installed resources to avoid showing duplicates
        $localResources = Resource::pluck('slug')->toArray();
        // Theme::pluck('path') returns slugs directly, not full paths
        $localThemes = Theme::pluck('path')->toArray();

        return Inertia::render('Admin/Resources/External/ExternalInstall', [
            'resources' => $resources,
            'installedResources' => array_merge($localResources, $localThemes),
            'filters' => [
                'type' => $type,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Install a resource from external source.
     */
    public function install(Request $request, string $resourceId)
    {
        Gate::authorize('admin.resources.settings');

        $request->validate([
            'type' => 'required|in:plugin,theme',
        ]);

        $marketplaceUrl = config('services.marketplace.url', 'https://marketplace.exiloncms.fr');

        try {
            // Fetch resource details from external API
            $response = HttpClient::timeout(30)->get("{$marketplaceUrl}/api/resources/{$resourceId}");

            if (! $response->successful()) {
                return back()->with('error', 'Resource not found on external server.');
            }

            $resource = $response->json('data');

            // Download the resource
            $downloadUrl = $resource['download_url'];
            $tempPath = storage_path('app/temp/'.Str::random(40).'.zip');

            if (! File::exists(dirname($tempPath))) {
                File::makeDirectory(dirname($tempPath), 0755, true);
            }

            $fileResponse = HttpClient::timeout(60)->get($downloadUrl);

            if (! $fileResponse->successful()) {
                return back()->with('error', 'Failed to download resource.');
            }

            File::put($tempPath, $fileResponse->body());

            // Extract the resource
            $extractPath = $request->type === 'theme'
                ? base_path('themes/temp')
                : base_path('plugins/temp');

            if (! File::exists($extractPath)) {
                File::makeDirectory($extractPath, 0755, true);
            }

            $zip = new ZipArchive;
            if ($zip->open($tempPath) !== true) {
                File::delete($tempPath);

                return back()->with('error', 'Failed to extract resource.');
            }

            $zip->extractTo($extractPath);
            $zip->close();
            File::delete($tempPath);

            // Move to final location
            if ($request->type === 'theme') {
                $this->installTheme($extractPath, $resource);
            } else {
                $this->installPlugin($extractPath, $resource);
            }

            // Clean up temp directory
            File::deleteDirectory($extractPath);

            // Clear caches
            $this->clearCaches();

            return back()->with('success', 'Resource installed successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to install external resource', [
                'resource_id' => $resourceId,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to install resource: '.$e->getMessage());
        }
    }

    /**
     * Install a theme from external source.
     */
    protected function installTheme(string $extractPath, array $resource): void
    {
        // Find the theme directory
        $directories = File::directories($extractPath);
        if (empty($directories)) {
            throw new \Exception('No theme directory found in archive.');
        }

        $themeDir = $directories[0];
        $themeSlug = basename($themeDir);
        $targetPath = base_path('themes/'.$themeSlug);

        // Move theme to themes directory
        if (File::exists($targetPath)) {
            // Backup existing theme
            File::moveDirectory($targetPath, storage_path('backups/themes/'.$themeSlug.'_'.time()));
        }

        File::moveDirectory($themeDir, $targetPath);

        // Save to database if not exists
        $theme = Theme::firstOrCreate(
            ['path' => $themeSlug],
            [
                'name' => $resource['title'],
                'version' => $resource['version'],
                'description' => $resource['description'],
                'author' => $resource['author']['name'] ?? 'Unknown',
                'url' => $resource['repository_url'] ?? null,
                'screenshot' => $resource['thumbnail'] ?? null,
                'has_config' => false,
            ]
        );

        Log::info('Theme installed from external source', [
            'theme' => $themeSlug,
            'version' => $resource['version'],
        ]);
    }

    /**
     * Install a plugin from external source.
     */
    protected function installPlugin(string $extractPath, array $resource): void
    {
        // Plugins have been removed from ExilonCMS
        throw new \Exception('Plugins are not supported in this version of ExilonCMS.');
    }

    /**
     * Clear all relevant caches.
     */
    protected function clearCaches(): void
    {
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Artisan::call('route:clear');
    }

    /**
     * Sync resources from external API to local database.
     */
    public function sync(Request $request)
    {
        Gate::authorize('admin.resources.settings');

        $marketplaceUrl = config('services.marketplace.url', 'https://marketplace.exiloncms.fr');

        try {
            $response = HttpClient::timeout(30)->get("{$marketplaceUrl}/api/resources", [
                'per_page' => 100,
            ]);

            if (! $response->successful()) {
                return back()->with('error', 'Failed to sync with external server.');
            }

            $data = $response->json();
            $resources = $data['data'] ?? [];

            $synced = 0;
            foreach ($resources as $resource) {
                // Only sync themes (plugins are not supported)
                if ($resource['type'] === 'theme') {
                    Theme::updateOrCreate(
                        ['path' => $resource['slug']],
                        [
                            'name' => $resource['title'],
                            'version' => $resource['version'],
                            'description' => $resource['description'],
                            'author' => $resource['author']['name'] ?? 'Unknown',
                            'url' => $resource['repository_url'] ?? null,
                            'screenshot' => $resource['thumbnail'] ?? null,
                        ]
                    );
                    $synced++;
                }
            }

            return back()->with('success', "Synced {$synced} resources from external server.");
        } catch (\Exception $e) {
            Log::error('Failed to sync external resources', [
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to sync: '.$e->getMessage());
        }
    }
}
