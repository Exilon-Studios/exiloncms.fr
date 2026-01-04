<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\Extensions\UpdateManager;
use MCCMS\Http\Controllers\Controller;
use MCCMS\Models\Image;
use MCCMS\Models\Page;
use MCCMS\Models\Post;
use MCCMS\Models\User;
use MCCMS\Support\Charts;
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
        $newVersion = $updates->hasUpdate() ? $updates->getLastVersion() : null;
        $userCount = User::whereNull('deleted_at')->count();

        return inertia('Admin/Dashboard', [
            'secure' => $request->secure() || ! $this->app->isProduction(),
            'stats' => [
                'totalUsers' => $userCount,
                'totalPosts' => Post::count(),
                'totalPages' => Page::count(),
                'totalImages' => Image::count(),
            ],
            'charts' => [
                'newUsersPerMonths' => Charts::countByMonths(User::whereNull('deleted_at')),
                'newUsersPerDays' => Charts::countByDays(User::whereNull('deleted_at')),
            ],
            'activeUsers' => $this->getActiveUsers($userCount),
            'newVersion' => $newVersion,
            'apiAlerts' => $updates->getApiAlerts(),
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
