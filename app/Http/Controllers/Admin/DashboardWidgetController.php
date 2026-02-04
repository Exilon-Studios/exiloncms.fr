<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Classes\Widgets\WidgetManager;
use ExilonCMS\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Dashboard Widget Controller
 *
 * Provides widget data for the admin dashboard.
 */
class DashboardWidgetController extends Controller
{
    public function __construct(
        private WidgetManager $widgetManager,
    ) {}

    /**
     * Get all available dashboard widgets.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $allWidgets = $this->widgetManager->getWidgets();

        // Filter widgets by user permissions
        $widgets = array_filter($allWidgets, function ($widget) {
            return $this->widgetManager->canViewWidget($widget);
        });

        // Re-index array
        $widgets = array_values($widgets);

        return response()->json($widgets);
    }

    /**
     * Get widgets by position.
     *
     * @param  string  $position
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByPosition(Request $request, string $position)
    {
        $widgets = $this->widgetManager->getWidgetsByPosition($position);

        // Filter by permissions
        $widgets = array_filter($widgets, function ($widget) {
            return $this->widgetManager->canViewWidget($widget);
        });

        return response()->json(array_values($widgets));
    }

    /**
     * Get user's configured dashboard layout.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserLayout(Request $request)
    {
        $layout = $this->widgetManager->getUserWidgets();

        return response()->json($layout);
    }

    /**
     * Save user's dashboard layout.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveUserLayout(Request $request)
    {
        $request->validate([
            'layout' => 'required|array',
            'layout.main' => 'array',
            'layout.sidebar' => 'array',
        ]);

        $this->widgetManager->saveUserWidgets(
            auth()->id(),
            $request->input('layout')
        );

        return response()->json(['success' => true]);
    }

    /**
     * Get widget data for rendering.
     *
     * @param  string  $widgetId
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, string $widgetId)
    {
        $widget = $this->widgetManager->getWidgetData($widgetId);

        if (! $widget) {
            return response()->json(['error' => 'Widget not found'], 404);
        }

        if (! $this->widgetManager->canViewWidget($widget)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($widget);
    }

    /**
     * Clear widget cache.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearCache()
    {
        $this->widgetManager->clearCache();

        return redirect()->back()
            ->with('success', 'Widget cache cleared.');
    }
}
