<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return inertia('Notifications/Index', [
            'notifications' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Mark the specified notification as read.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        abort_if($request->user()->id !== $notification->user_id, 403);

        $notification->markAsRead();

        return $request->expectsJson() ? response()->noContent() : redirect()->back();
    }

    /**
     * Mark all the user notification as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return $request->expectsJson() ? response()->noContent() : redirect()->back();
    }
}
