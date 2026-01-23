<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\ExilonCMS;
use ExilonCMS\Extensions\UpdateManager;
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

    public function index()
    {
        return Inertia::render('Admin/Updates/Index', [
            'currentVersion' => ExilonCMS::version(),
            'lastVersion' => $this->updates->getUpdate(),
            'hasUpdate' => $this->updates->hasUpdate(),
            'isDownloaded' => $this->updates->isLastVersionDownloaded(),
        ]);
    }

    public function fetch()
    {
        $response = to_route('admin.update.index');

        try {
            // Force fetch updates from GitHub
            $this->updates->forceFetchGithubRelease();
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
        if (! $this->updates->isLastVersionDownloaded()) {
            return to_route('admin.update.index')
                ->with('error', trans('admin.update.not_downloaded'));
        }

        try {
            $this->updates->install();

            ActionLog::log(
                'cms.update',
                'CMS updated to version ' . ExilonCMS::version(),
                'update'
            );

            return to_route('admin.update.index')
                ->with('success', trans('admin.update.installed'));
        } catch (Exception $e) {
            return to_route('admin.update.index')
                ->with('error', trans('messages.status.error', [
                    'error' => $e->getMessage(),
                ]));
        }
    }

    public function version()
    {
        return response()->json([
            'version' => ExilonCMS::version(),
            'api' => ExilonCMS::apiVersion(),
        ]);
    }
}
