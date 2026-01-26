<?php

namespace ExilonCMS\Plugins\Analytics\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Analytics\Models\AnalyticsEvent;
use ExilonCMS\Plugins\Analytics\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'month');
        $startDate = match ($period) {
            'today' => now()->startOfDay(),
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'year' => now()->subYear(),
            default => now()->subDays(30),
        };

        // Overview stats
        $stats = [
            'page_views' => AnalyticsEvent::where('event_type', 'page_view')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'unique_visitors' => AnalyticsEvent::where('event_type', 'page_view')
                ->where('created_at', '>=', $startDate)
                ->distinct('session_id')
                ->count('session_id'),
            'events' => AnalyticsEvent::where('created_at', '>=', $startDate)->count(),
            'avg_session_duration' => $this->calculateAvgSessionDuration($startDate),
        ];

        // Page views over time
        $pageViewsOverTime = AnalyticsEvent::select([
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count'),
        ])
            ->where('event_type', 'page_view')
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top pages
        $topPages = PageView::select('page_url', 'page_title')
            ->selectRaw('SUM(views) as total_views')
            ->selectRaw('SUM(unique_visitors) as total_unique')
            ->where('date', '>=', $startDate->toDateString())
            ->groupBy('page_url', 'page_title')
            ->orderByDesc('total_views')
            ->limit(10)
            ->get();

        // Event types breakdown
        $eventTypes = AnalyticsEvent::select('event_type')
            ->selectRaw('COUNT(*) as count')
            ->where('created_at', '>=', $startDate)
            ->groupBy('event_type')
            ->get();

        // Referrers
        $topReferrers = AnalyticsEvent::select('referrer')
            ->selectRaw('COUNT(*) as count')
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('referrer')
            ->where('referrer', '!=', '')
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Devices/Browsers (basic from user agent)
        $browsers = AnalyticsEvent::select('user_agent')
            ->selectRaw('COUNT(*) as count')
            ->where('created_at', '>=', $startDate)
            ->get()
            ->map(function ($event) {
                return [
                    'browser' => $this->detectBrowser($event->user_agent),
                    'count' => $event->count,
                ];
            })
            ->groupBy('browser')
            ->map(function ($group) {
                return [
                    'browser' => $group->first()['browser'],
                    'count' => $group->sum('count'),
                ];
            })
            ->sortByDesc('count')
            ->take(5)
            ->values();

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => $stats,
            'pageViewsOverTime' => $pageViewsOverTime,
            'topPages' => $topPages,
            'eventTypes' => $eventTypes,
            'topReferrers' => $topReferrers,
            'browsers' => $browsers,
            'period' => $period,
        ]);
    }

    public function events(Request $request)
    {
        $events = AnalyticsEvent::query()
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->paginate(50);

        return Inertia::render('Admin/Analytics/Events', [
            'events' => $events,
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'period' => 'required|in:today,week,month,year',
            'format' => 'required|in:csv,json',
        ]);

        $period = $request->period;
        $startDate = match ($period) {
            'today' => now()->startOfDay(),
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'year' => now()->subYear(),
        };

        $events = AnalyticsEvent::where('created_at', '>=', $startDate)->get();

        $filename = "analytics_{$period}_".now()->format('Y-m-d');

        if ($request->format === 'json') {
            return response()->json($events)->header('Content-Disposition', "attachment; filename={$filename}.json");
        }

        // CSV export
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}.csv",
        ];

        $callback = function () use ($events) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Type', 'Page URL', 'Session ID', 'User ID', 'IP', 'Created At']);

            foreach ($events as $event) {
                fputcsv($file, [
                    $event->id,
                    $event->event_type,
                    $event->page_url,
                    $event->session_id,
                    $event->user_id,
                    $event->ip_address,
                    $event->created_at,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    protected function calculateAvgSessionDuration($startDate): float
    {
        // Calculate average time between first and last event per session
        $sessionDurations = DB::select('
            SELECT
                session_id,
                MIN(created_at) as first_event,
                MAX(created_at) as last_event,
                TIMESTAMPDIFF(SECOND, MIN(created_at), MAX(created_at)) as duration
            FROM analytics_events
            WHERE created_at >= ?
            GROUP BY session_id
            HAVING duration > 0
        ', [$startDate]);

        if (empty($sessionDurations)) {
            return 0;
        }

        $totalDuration = collect($sessionDurations)->sum('duration');
        $count = count($sessionDurations);

        return round($totalDuration / $count, 2);
    }

    protected function detectBrowser($userAgent): string
    {
        if (preg_match('/Firefox/i', $userAgent)) {
            return 'Firefox';
        }
        if (preg_match('/Chrome/i', $userAgent) && ! preg_match('/Edg/i', $userAgent)) {
            return 'Chrome';
        }
        if (preg_match('/Safari/i', $userAgent) && ! preg_match('/Chrome/i', $userAgent)) {
            return 'Safari';
        }
        if (preg_match('/Edg/i', $userAgent)) {
            return 'Edge';
        }
        if (preg_match('/Opera/i', $userAgent)) {
            return 'Opera';
        }

        return 'Other';
    }
}
