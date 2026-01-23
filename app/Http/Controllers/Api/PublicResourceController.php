<?php

namespace ExilonCMS\Http\Controllers\Api;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PublicResourceController extends Controller
{
    /**
     * Get all approved resources for public API.
     * This endpoint is used by external ExilonCMS installations to browse available resources.
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type'); // 'plugin' or 'theme'
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);

        $cacheKey = "public_resources_{$type}_{$search}_{$page}_{$perPage}";

        $resources = Cache::remember($cacheKey, 3600, function () use ($type, $search, $perPage) {
            $query = Resource::where('status', 'approved')
                ->whereNotNull('download_url')
                ->whereNotNull('version');

            if ($type && in_array($type, ['plugin', 'theme'])) {
                $query->where('type', $type);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            return $query->orderByDesc('created_at')
                ->paginate(min($perPage, 100));
        });

        return response()->json([
            'success' => true,
            'data' => $resources->items(),
            'meta' => [
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
            ],
        ]);
    }

    /**
     * Get a specific resource by ID.
     */
    public function show(string $id): JsonResponse
    {
        $cacheKey = "public_resource_{$id}";

        $resource = Cache::remember($cacheKey, 3600, function () use ($id) {
            return Resource::where('id', $id)
                ->orWhere('slug', $id)
                ->where('status', 'approved')
                ->whereNotNull('download_url')
                ->first();
        });

        if (!$resource) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $resource->id,
                'slug' => $resource->slug,
                'title' => $resource->title,
                'description' => $resource->description,
                'type' => $resource->type,
                'version' => $resource->version,
                'pricing_type' => $resource->pricing_type,
                'price' => $resource->price,
                'download_url' => $resource->download_url,
                'demo_url' => $resource->demo_url,
                'repository_url' => $resource->repository_url,
                'thumbnail' => $resource->thumbnail,
                'screenshots' => $resource->screenshots,
                'tags' => $resource->tags,
                'author' => [
                    'id' => $resource->author->id,
                    'name' => $resource->author->name,
                ],
                'downloads' => $resource->downloads,
                'rating' => $resource->rating,
                'reviews_count' => $resource->reviews_count,
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at,
            ],
        ]);
    }

    /**
     * Get resources statistics.
     */
    public function stats(): JsonResponse
    {
        $cacheKey = 'public_resources_stats';

        $stats = Cache::remember($cacheKey, 3600, function () {
            return [
                'total_resources' => Resource::where('status', 'approved')->count(),
                'total_plugins' => Resource::where('status', 'approved')->where('type', 'plugin')->count(),
                'total_themes' => Resource::where('status', 'approved')->where('type', 'theme')->count(),
                'total_downloads' => Resource::where('status', 'approved')->sum('downloads'),
                'latest_resources' => Resource::where('status', 'approved')
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get(['id', 'title', 'slug', 'type', 'version', 'created_at']),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Search resources by tag.
     */
    public function searchByTag(Request $request, string $tag): JsonResponse
    {
        $resources = Resource::where('status', 'approved')
            ->whereJsonContains('tags', $tag)
            ->whereNotNull('download_url')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $resources->items(),
            'meta' => [
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
                'total' => $resources->total(),
            ],
        ]);
    }
}
