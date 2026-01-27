<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Extensions\UpdateManager;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Services\DiscordNotificationService;
use ExilonCMS\Services\ExtensionUpdateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExtensionUpdateController extends Controller
{
    public function __construct(
        private ExtensionUpdateService $updateService,
        private DiscordNotificationService $discordService,
        private UpdateManager $cmsUpdateManager,
    ) {
    }

    /**
     * Display extension updates page.
     */
    public function index()
    {
        // Get cached updates or check fresh
        $updates = $this->updateService->checkAllUpdates();

        // Get CMS update info
        $cmsUpdate = $this->cmsUpdateManager->getUpdate();

        return Inertia::render('Admin/ExtensionUpdates/Index', [
            'pluginUpdates' => array_values($updates['plugins']),
            'themeUpdates' => array_values($updates['themes']),
            'cmsUpdate' => $cmsUpdate,
            'discordEnabled' => $this->discordService->isEnabled(),
            'totalUpdates' => count($updates['plugins']) + count($updates['themes']) + ($cmsUpdate ? 1 : 0),
        ]);
    }

    /**
     * Check for extension updates (API endpoint).
     */
    public function check(Request $request)
    {
        $forceRefresh = $request->boolean('force', false);

        $updates = $this->updateService->checkAllUpdates($forceRefresh);

        return response()->json([
            'success' => true,
            'data' => $updates,
            'counts' => [
                'plugins' => count($updates['plugins']),
                'themes' => count($updates['themes']),
                'total' => count($updates['plugins']) + count($updates['themes']),
            ],
        ]);
    }

    /**
     * Send Discord notification about available updates.
     */
    public function sendNotification(Request $request)
    {
        $updates = $this->updateService->checkAllUpdates();

        $pluginCount = count($updates['plugins']);
        $themeCount = count($updates['themes']);

        $cmsUpdate = $this->cmsUpdateManager->getUpdate();
        $cmsCount = $cmsUpdate ? 1 : 0;

        if ($cmsCount === 0 && $pluginCount === 0 && $themeCount === 0) {
            return back()->with('info', 'No updates available to notify about.');
        }

        // Send individual notifications for each update type
        if ($cmsUpdate && $cmsCount > 0) {
            $this->discordService->notifyCmsUpdate(
                $this->cmsUpdateManager->getCurrentVersion(),
                $cmsUpdate['version'],
                $cmsUpdate['body'] ?? null
            );
        }

        foreach ($updates['plugins'] as $pluginId => $update) {
            $this->discordService->notifyPluginUpdate(
                $update['name'],
                $update['id'],
                $update['current_version'],
                $update['latest_version']
            );
        }

        foreach ($updates['themes'] as $themeId => $update) {
            $this->discordService->notifyThemeUpdate(
                $update['name'],
                $update['id'],
                $update['current_version'],
                $update['latest_version']
            );
        }

        Log::info('Discord notifications sent for extension updates', [
            'cms' => $cmsCount,
            'plugins' => $pluginCount,
            'themes' => $themeCount,
        ]);

        return back()->with('success', 'Discord notifications sent successfully!');
    }
}
