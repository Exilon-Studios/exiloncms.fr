<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Extensions\UpdateManager;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Image;
use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Pages\Models\Page;
use ExilonCMS\Support\Charts;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * The application instance.
     */
    private Application $app;

    /**
     * Create a new controller instance.
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    public function index(Request $request)
    {
        $updates = $this->app->make(UpdateManager::class);
        $updateList = $updates->getUpdates();
        $newVersion = $updates->hasUpdates() ? $updateList[0] ?? null : null;
        $userCount = User::whereNull('deleted_at')->count();

        // Count posts only if Blog plugin is available
        $totalPosts = 0;
        if (class_exists('ExilonCMS\Plugins\Blog\Models\Post')) {
            $totalPosts = \ExilonCMS\Plugins\Blog\Models\Post::count();
        }

        return inertia('Admin/Dashboard', [
            'secure' => $request->secure() || ! $this->app->isProduction(),
            'stats' => [
                'totalUsers' => $userCount,
                'totalPosts' => $totalPosts,
                'totalPages' => Page::count(),
                'totalImages' => Image::count(),
            ],
            'charts' => [
                'newUsersPerMonths' => Charts::countByMonths(User::whereNull('deleted_at')),
                'newUsersPerDays' => Charts::countByDays(User::whereNull('deleted_at')),
            ],
            'activeUsers' => $this->getActiveUsers($userCount),
            'newVersion' => $newVersion,
            'updatesCount' => $updates->getUpdatesCount(),
        ]);
    }

    public function fallback()
    {
        return inertia('Admin/Errors/404')->toResponse(request())->setStatusCode(404);
    }

    protected function getActiveUsers(int $totalUsers)
    {
        $column = 'last_login_at';

        $dayUsers = User::where($column, '>', now()->subDay())->count();
        $weekUsers = User::where($column, '>', now()->subWeek())->count() - $dayUsers;
        $monthUsers = User::where($column, '>', now()->subMonth())->count() - $weekUsers;

        $dayTrans = now()->subDay()->longAbsoluteDiffForHumans();
        $weekTrans = now()->subWeek()->longAbsoluteDiffForHumans();
        $monthTrans = now()->subMonth()->longAbsoluteDiffForHumans();

        return [
            $dayTrans => $dayUsers,
            $weekTrans => $weekUsers,
            $monthTrans => $monthUsers,
            '+ '.$monthTrans => $totalUsers - $monthUsers,
        ];
    }
}
