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
        $logs = ActionLog::with(['user', 'target'])
            ->latest()
            ->paginate();

        // Format logs for frontend with action messages
        $logs->getCollection()->transform(function ($log) {
            return [
                'id' => $log->id,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                ] : null,
                'action' => $log->action,
                'action_message' => $log->getActionMessage(),
                'action_type' => $log->target_type,
                'target_id' => $log->target_id,
                'data' => $log->data,
                'created_at' => $log->created_at,
            ];
        });

        return Inertia::render('Admin/Logs/Index', ['logs' => $logs]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ActionLog $log)
    {
        return Inertia::render('Admin/Logs/Show', ['log' => $log->load(['user', 'target', 'entries'])]);
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
