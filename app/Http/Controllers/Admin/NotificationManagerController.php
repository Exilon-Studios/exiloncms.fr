<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Notification;
use ExilonCMS\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class NotificationManagerController extends Controller
{
    public function index()
    {
        $notifications = Notification::with(['user', 'author'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function create()
    {
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Notifications/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'target_type' => 'required|in:all,users,role',
            'target_users' => 'required_if:target_type,users|array',
            'target_users.*' => 'exists:users,id',
            'target_role' => 'required_if:target_type,role|string|exists:roles,name',
            'level' => 'required|in:info,success,warning,danger',
            'content' => 'required|string|max:1000',
            'link' => 'nullable|url|max:500',
        ]);

        $authorId = auth()->id();

        switch ($request->target_type) {
            case 'all':
                // Send to all users
                $users = User::all();
                break;

            case 'users':
                // Send to specific users
                $users = User::whereIn('id', $request->target_users)->get();
                break;

            case 'role':
                // Send to users with specific role
                $users = User::whereHas('role', function ($query) use ($request) {
                    $query->where('name', $request->target_role);
                })->get();
                break;

            default:
                $users = collect();
        }

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'author_id' => $authorId,
                'level' => $request->level,
                'content' => $request->content,
                'link' => $request->link,
            ]);
        }

        return Redirect::route('admin.notifications-manager.index')
            ->with('success', "Notification envoyée à {$users->count} utilisateur(s).");
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return Redirect::back()
            ->with('success', 'Notification supprimée avec succès.');
    }
}
