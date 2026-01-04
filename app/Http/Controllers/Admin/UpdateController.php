<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\MCCMS;
use MCCMS\Extensions\UpdateManager;
use MCCMS\Http\Controllers\Controller;
use MCCMS\Models\ActionLog;
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
            'currentVersion' => MCCMS::version(),
            'lastVersion' => $this->updates->getUpdate(),
            'hasUpdate' => $this->updates->hasUpdate(),
            'isDownloaded' => $this->updates->isLastVersionDownloaded(),
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
            'mccms' => MCCMS::version(),
            'php' => PHP_VERSION,
        ]);
    }
}

