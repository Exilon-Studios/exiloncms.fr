<?php

namespace ExilonCMS\Plugins\Notifications\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Notifications\Models\NotificationChannel;
use ExilonCMS\Plugins\Notifications\Models\NotificationLog;
use ExilonCMS\Plugins\Notifications\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $logs = NotificationLog::with(['user:id,name', 'channel'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        $channels = NotificationChannel::all();
        $templates = NotificationTemplate::all();

        return Inertia::render('Admin/Notifications/Index', [
            'logs' => $logs,
            'channels' => $channels,
            'templates' => $templates,
        ]);
    }

    public function channels()
    {
        $channels = NotificationChannel::all();

        return Inertia::render('Admin/Notifications/Channels', [
            'channels' => $channels,
        ]);
    }

    public function templates()
    {
        $templates = NotificationTemplate::all();

        return Inertia::render('Admin/Notifications/Templates', [
            'templates' => $templates,
        ]);
    }

    public function createTemplate()
    {
        return Inertia::render('Admin/Notifications/Templates/Create');
    }

    public function storeTemplate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:notification_templates,slug',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:email,sms,push',
            'is_enabled' => 'boolean',
        ]);

        NotificationTemplate::create($validated);

        return redirect()
            ->route('admin.notifications.templates')
            ->with('success', 'Template created successfully.');
    }

    public function editTemplate(NotificationTemplate $template)
    {
        return Inertia::render('Admin/Notifications/Templates/Edit', [
            'template' => $template,
        ]);
    }

    public function updateTemplate(Request $request, NotificationTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:notification_templates,slug,'.$template->id,
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:email,sms,push',
            'is_enabled' => 'boolean',
        ]);

        $template->update($validated);

        return back()->with('success', 'Template updated successfully.');
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'data' => 'array',
        ]);

        $user = User::find($validated['user_id']);
        $service = App::make('notification');

        $success = $service->send($user, $validated['type'], $validated['data'] ?? []);

        if ($success) {
            return back()->with('success', 'Notification sent successfully.');
        } else {
            return back()->with('error', 'Failed to send notification.');
        }
    }
}
