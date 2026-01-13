<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get recent notifications for the dropdown (JSON API).
     */
    public function recent(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $unreadCount = $request->user()
            ->notifications()
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'level' => $notification->level,
                    'content' => $notification->content,
                    'link' => $notification->link,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at' => $notification->created_at->toISOString(),
                ];
            })->toArray(),
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Get unread count for the authenticated user (JSON API).
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $request->user()
            ->notifications()
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Show all notifications page.
     */
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
        $request->user()
            ->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $request->expectsJson() ? response()->noContent() : redirect()->back();
    }

    /**
     * Delete a notification.
     */
    public function destroy(Request $request, Notification $notification)
    {
        abort_if($request->user()->id !== $notification->user_id, 403);

        $notification->delete();

        return $request->expectsJson() ? response()->noContent() : redirect()->back();
    }
}
