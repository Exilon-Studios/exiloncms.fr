<?php

namespace ExilonCMS\Plugins\Analytics\Http\Controllers;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Analytics\Models\AnalyticsEvent;
use ExilonCMS\Plugins\Analytics\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class TrackingController extends Controller
{
    public function track(Request $request)
    {
        if (!Config::get('analytics.tracking_enabled')) {
            return response()->json(['status' => 'disabled']);
        }

        $validated = $request->validate([
            'event_type' => 'required|in:page_view,click,form_submit,download,custom',
            'page_url' => 'required|string',
            'page_title' => 'nullable|string',
            'referrer' => 'nullable|string',
            'properties' => 'nullable|array',
        ]);

        // Skip tracking for admin users if disabled
        if ($request->user()?->isAdmin() && !Config::get('analytics.track_admin_users')) {
            return response()->json(['status' => 'skipped', 'reason' => 'admin_user']);
        }

        // Skip ignored paths
        foreach (Config::get('analytics.ignore_paths', []) as $path) {
            if (fnmatch($path, $request->path())) {
                return response()->json(['status' => 'skipped', 'reason' => 'ignored_path']);
            }
        }

        // Sampling
        $samplingRate = Config::get('analytics.sampling_rate', 100);
        if (rand(1, 100) > $samplingRate) {
            return response()->json(['status' => 'skipped', 'reason' => 'sampling']);
        }

        $sessionId = $request->session()->getId();
        $ipAddress = $request->ip();

        // Anonymize IP if enabled
        if (Config::get('analytics.anonymize_ip') && $ipAddress) {
            $ipParts = explode('.', $ipAddress);
            if (count($ipParts) === 4) {
                $ipParts[3] = '0';
                $ipAddress = implode('.', $ipParts);
            }
        }

        // Create event
        $event = AnalyticsEvent::create([
            'user_id' => $request->user()?->id,
            'session_id' => $sessionId,
            'event_type' => $validated['event_type'],
            'page_url' => $validated['page_url'],
            'referrer' => $validated['referrer'] ?? null,
            'user_agent' => $request->userAgent(),
            'ip_address' => $ipAddress,
            'properties' => $validated['properties'] ?? null,
        ]);

        // Update page view stats
        if ($validated['event_type'] === 'page_view') {
            PageView::recordPageView(
                $validated['page_url'],
                $validated['page_title'] ?? 'Unknown'
            );
        }

        // Record unique visitor (simplified - should use cookie/first visit detection)
        if (!$request->session()->has('analytics_tracked')) {
            PageView::recordUniqueVisitor($validated['page_url']);
            $request->session()->put('analytics_tracked', true);
        }

        return response()->json(['status' => 'tracked', 'event_id' => $event->id]);
    }

    public function getPageViews(Request $request)
    {
        $url = $request->get('url');
        $period = $request->get('period', 'month');

        $startDate = match ($period) {
            'today' => now()->startOfDay(),
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'year' => now()->subYear(),
            default => now()->subDays(30),
        };

        $views = PageView::where('page_url', $url)
            ->where('date', '>=', $startDate->toDateString())
            ->sum('views');

        return response()->json(['views' => $views]);
    }
}
