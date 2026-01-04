<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\ActionLog;
use Inertia\Inertia;

class ActionLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logs = ActionLog::onlyGlobal()
            ->with(['user', 'target'])
            ->latest()
            ->paginate();

        return Inertia::render('Admin/Logs/Index', ['logs' => $logs]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ActionLog $log)
    {
        return Inertia::render('Admin/Logs/Show', ['log' => $log->load('entries')]);
    }

    /**
     * Clear old records.
     *
     * @throws \LogicException
     */
    public function clear()
    {
        ActionLog::whereDate('created_at', '<', now()->subDays(15))->delete();

        return to_route('admin.logs.index')
            ->with('success', trans('admin.logs.cleared'));
    }
}
