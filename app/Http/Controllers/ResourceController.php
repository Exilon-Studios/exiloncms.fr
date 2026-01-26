<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\Resource;
use ExilonCMS\Models\ResourceReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $type = $request->query('type', 'all');
        $pricing = $request->query('pricing', 'all');
        $search = $request->query('search');
        $sort = $request->query('sort', 'latest');
        $tags = $request->query('tags');

        $query = Resource::published()->with(['author', 'approvedBy']);

        // Filter by type
        if ($type !== 'all' && in_array($type, Resource::TYPES)) {
            $query->ofType($type);
        }

        // Filter by pricing
        if ($pricing === 'free') {
            $query->free();
        } elseif ($pricing === 'paid') {
            $query->paid();
        }

        // Search
        if ($search) {
            $query->search($search);
        }

        // Filter by tags
        if ($tags) {
            $query->withTags(explode(',', $tags));
        }

        // Sort
        switch ($sort) {
            case 'popular':
                $query->orderByPopularity();
                break;
            case 'rating':
                $query->orderByRating();
                break;
            case 'latest':
            default:
                $query->orderByLatest();
                break;
        }

        $resources = $query->paginate(12)->withQueryString();

        return Inertia::render('Resources/Index', [
            'resources' => $resources,
            'filters' => [
                'type' => $type,
                'pricing' => $pricing,
                'search' => $search,
                'sort' => $sort,
                'tags' => $tags,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $resource = Resource::with(['author', 'reviews' => function ($query) {
            $query->latest()->limit(10);
        }, 'reviews.user', 'updates' => function ($query) {
            $query->published()->orderByVersion();
        }])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment views
        $resource->incrementViews();

        $user = Auth::user();
        $hasPurchased = $resource->hasPurchased($user);
        $canReview = $resource->canBeReviewedBy($user);

        // Get user's review if exists
        $userReview = null;
        if ($user) {
            $userReview = $resource->reviews()->where('user_id', $user->id)->first();
        }

        return Inertia::render('Resources/Show', [
            'resource' => $resource,
            'hasPurchased' => $hasPurchased,
            'canReview' => $canReview,
            'userReview' => $userReview,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Resource::class);

        return Inertia::render('Resources/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Resource::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'content' => 'nullable|string',
            'type' => 'required|in:'.implode(',', Resource::TYPES),
            'pricing_type' => 'required|in:'.implode(',', Resource::PRICING_TYPES),
            'price' => 'required_if:pricing_type,paid|numeric|min:0|max:9999.99',
            'currency' => 'required_if:pricing_type,paid|string|size:3',
            'version' => 'required|string|max:20',
            'download_url' => 'required|url',
            'demo_url' => 'nullable|url',
            'repository_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|max:2048',
            'screenshots' => 'nullable|array|max:5',
            'screenshots.*' => 'image|max:2048',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:30',
        ]);

        $user = $request->user();

        // Ensure user is a seller
        if (! $user->isSeller()) {
            $user->markAsSeller();
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('resources/thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        // Handle screenshots upload
        if ($request->hasFile('screenshots')) {
            $screenshots = [];
            foreach ($request->file('screenshots') as $screenshot) {
                $path = $screenshot->store('resources/screenshots', 'public');
                $screenshots[] = $path;
            }
            $validated['screenshots'] = $screenshots;
        }

        $validated['author_id'] = $user->id;
        $validated['slug'] = null; // Will be generated in model

        $resource = Resource::create($validated);

        return redirect()->route('resources.show', $resource->slug)
            ->with('success', 'Resource submitted successfully! It will be reviewed before being published.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resource $resource)
    {
        Gate::authorize('update', $resource);

        return Inertia::render('Resources/Edit', [
            'resource' => $resource,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resource $resource)
    {
        Gate::authorize('update', $resource);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'content' => 'nullable|string',
            'type' => 'required|in:'.implode(',', Resource::TYPES),
            'pricing_type' => 'required|in:'.implode(',', Resource::PRICING_TYPES),
            'price' => 'required_if:pricing_type,paid|numeric|min:0|max:9999.99',
            'currency' => 'required_if:pricing_type,paid|string|size:3',
            'version' => 'required|string|max:20',
            'download_url' => 'required|url',
            'demo_url' => 'nullable|url',
            'repository_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|max:2048',
            'screenshots' => 'nullable|array|max:5',
            'screenshots.*' => 'image|max:2048',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:30',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($resource->thumbnail) {
                Storage::disk('public')->delete($resource->thumbnail);
            }
            $path = $request->file('thumbnail')->store('resources/thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        // Handle screenshots upload
        if ($request->hasFile('screenshots')) {
            // Delete old screenshots
            if ($resource->screenshots) {
                foreach ($resource->screenshots as $screenshot) {
                    Storage::disk('public')->delete($screenshot);
                }
            }
            $screenshots = [];
            foreach ($request->file('screenshots') as $file) {
                $path = $file->store('resources/screenshots', 'public');
                $screenshots[] = $path;
            }
            $validated['screenshots'] = $screenshots;
        }

        // If resource was already published, it needs re-approval
        if ($resource->isPublished()) {
            $validated['status'] = 'pending';
            $validated['published_at'] = null;
        }

        $resource->update($validated);

        return redirect()->route('resources.show', $resource->slug)
            ->with('success', 'Resource updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        Gate::authorize('delete', $resource);

        // Delete files
        if ($resource->thumbnail) {
            Storage::disk('public')->delete($resource->thumbnail);
        }
        if ($resource->screenshots) {
            foreach ($resource->screenshots as $screenshot) {
                Storage::disk('public')->delete($screenshot);
            }
        }

        $resource->delete();

        return redirect()->route('resources.index')
            ->with('success', 'Resource deleted successfully!');
    }

    /**
     * Download the resource.
     */
    public function download(string $slug)
    {
        $resource = Resource::where('slug', $slug)->firstOrFail();
        $user = Auth::user();

        // Check if user can download
        if (! $resource->isPublished()) {
            abort(404);
        }

        if (! $resource->hasPurchased($user)) {
            return redirect()->route('resources.show', $resource->slug)
                ->with('error', 'You need to purchase this resource to download it.');
        }

        // Increment download count
        $resource->incrementDownloads();

        // Redirect to download URL
        return redirect()->away($resource->download_url);
    }

    /**
     * Store a newly created review in storage.
     */
    public function storeReview(Request $request, string $slug)
    {
        $resource = Resource::published()->where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $validated['resource_id'] = $resource->id;
        $validated['user_id'] = $request->user()->id;

        ResourceReview::create($validated);

        return redirect()->route('resources.show', $resource->slug)
            ->with('success', 'Review submitted successfully!');
    }

    /**
     * Update the specified review in storage.
     */
    public function updateReview(Request $request, string $slug, ResourceReview $review)
    {
        Gate::authorize('update', $review);

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);

        return redirect()->route('resources.show', $slug)
            ->with('success', 'Review updated successfully!');
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroyReview(string $slug, ResourceReview $review)
    {
        Gate::authorize('delete', $review);

        $review->delete();

        return redirect()->route('resources.show', $slug)
            ->with('success', 'Review deleted successfully!');
    }

    /**
     * Display the user's resources.
     */
    public function myResources(Request $request)
    {
        $user = $request->user();

        $resources = Resource::where('author_id', $user->id)
            ->with(['approvedBy'])
            ->orderByDesc('created_at')
            ->paginate(12);

        return Inertia::render('Resources/MyResources', [
            'resources' => $resources,
        ]);
    }

    /**
     * Display the user's purchased resources.
     */
    public function myPurchases(Request $request)
    {
        $user = $request->user();

        $purchases = $user->purchases()
            ->with(['resource.author'])
            ->completed()
            ->orderByDesc('purchased_at')
            ->paginate(12);

        return Inertia::render('Resources/MyPurchases', [
            'purchases' => $purchases,
        ]);
    }
}
