<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Resource;
use ExilonCMS\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ResourceController extends Controller
{
    /**
     * Display a listing of pending resources.
     */
    public function pending(Request $request)
    {
        Gate::authorize('admin.resources.moderate');

        $resources = Resource::with(['author', 'approvedBy'])
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->paginate(20);

        $stats = [
            'pending' => Resource::where('status', 'pending')->count(),
            'approved' => Resource::where('status', 'approved')->count(),
            'rejected' => Resource::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Resources/Pending', [
            'resources' => $resources,
            'stats' => $stats,
        ]);
    }

    /**
     * Display a listing of all resources for admin management.
     */
    public function index(Request $request)
    {
        Gate::authorize('admin.resources.view');

        $status = $request->query('status', 'all');
        $type = $request->query('type', 'all');
        $search = $request->query('search');

        $query = Resource::with(['author', 'approvedBy']);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Resources/Index', [
            'resources' => $resources,
            'filters' => [
                'status' => $status,
                'type' => $type,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        Gate::authorize('admin.resources.view');

        $resource->load(['author', 'approvedBy', 'reviews' => function ($query) {
            $query->latest()->limit(20);
        }, 'reviews.user', 'updates']);

        return Inertia::render('Admin/Resources/Show', [
            'resource' => $resource,
        ]);
    }

    /**
     * Approve a resource.
     */
    public function approve(Request $request, Resource $resource)
    {
        Gate::authorize('admin.resources.moderate');

        $request->validate([
            'publish_now' => 'boolean',
        ]);

        $admin = $request->user();

        $resource->approve($admin->id);

        if ($request->boolean('publish_now')) {
            $resource->update(['published_at' => now()]);
        }

        return redirect()->back()
            ->with('success', 'Resource approved successfully!');
    }

    /**
     * Reject a resource.
     */
    public function reject(Request $request, Resource $resource)
    {
        Gate::authorize('admin.resources.moderate');

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $resource->reject($validated['reason']);

        return redirect()->back()
            ->with('success', 'Resource rejected successfully!');
    }

    /**
     * Archive a resource.
     */
    public function archive(Resource $resource)
    {
        Gate::authorize('admin.resources.moderate');

        $resource->archive();

        return redirect()->back()
            ->with('success', 'Resource archived successfully!');
    }

    /**
     * Display seller verification requests.
     */
    public function sellerRequests(Request $request)
    {
        Gate::authorize('admin.resources.moderate');

        $pendingSellers = User::where('is_seller', true)
            ->whereNull('seller_verified_at')
            ->with('sellerVerifier')
            ->paginate(20);

        $stats = [
            'pending' => User::where('is_seller', true)
                ->whereNull('seller_verified_at')
                ->count(),
            'verified' => User::where('is_seller', true)
                ->whereNotNull('seller_verified_at')
                ->count(),
        ];

        return Inertia::render('Admin/Resources/SellerRequests', [
            'sellers' => $pendingSellers,
            'stats' => $stats,
        ]);
    }

    /**
     * Verify a seller.
     */
    public function verifySeller(Request $request, User $user)
    {
        Gate::authorize('admin.resources.moderate');

        $user->verifySeller($request->user()->id);

        return redirect()->back()
            ->with('success', 'Seller verified successfully!');
    }

    /**
     * Revoke seller verification.
     */
    public function revokeSeller(User $user)
    {
        Gate::authorize('admin.resources.moderate');

        $user->revokeSellerVerification();

        return redirect()->back()
            ->with('success', 'Seller verification revoked successfully!');
    }

    /**
     * Remove seller status from user.
     */
    public function removeSeller(User $user)
    {
        Gate::authorize('admin.resources.moderate');

        $user->removeSellerStatus();

        return redirect()->back()
            ->with('success', 'Seller status removed successfully!');
    }

    /**
     * Update resource stats (downloads, views).
     */
    public function updateStats(Request $request, Resource $resource)
    {
        Gate::authorize('admin.resources.edit');

        $validated = $request->validate([
            'downloads' => 'integer|min:0',
            'views' => 'integer|min:0',
        ]);

        $resource->update($validated);

        return redirect()->back()
            ->with('success', 'Stats updated successfully!');
    }

    /**
     * Display marketplace settings.
     */
    public function settings()
    {
        Gate::authorize('admin.resources.settings');

        $settings = [
            'marketplace_enabled' => setting('marketplace_enabled', true),
            'seller_verification_required' => setting('seller_verification_required', true),
            'auto_approve_verified_sellers' => setting('auto_approve_verified_sellers', true),
            'commission_rate' => setting('commission_rate', 0),
            'min_price' => setting('min_price', 0),
            'max_price' => setting('max_price', 9999.99),
            'allowed_file_types' => setting('allowed_file_types', ['zip', 'rar', '7z']),
            'max_file_size' => setting('max_file_size', 100), // MB
        ];

        return Inertia::render('Admin/Resources/Settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update marketplace settings.
     */
    public function updateSettings(Request $request)
    {
        Gate::authorize('admin.resources.settings');

        $validated = $request->validate([
            'marketplace_enabled' => 'boolean',
            'seller_verification_required' => 'boolean',
            'auto_approve_verified_sellers' => 'boolean',
            'commission_rate' => 'numeric|min:0|max:100',
            'min_price' => 'numeric|min:0',
            'max_price' => 'numeric|min:0',
            'allowed_file_types' => 'array',
            'allowed_file_types.*' => 'string',
            'max_file_size' => 'integer|min:1|max:500',
        ]);

        foreach ($validated as $key => $value) {
            setting([$key => $value]);
        }

        return redirect()->back()
            ->with('success', 'Marketplace settings updated successfully!');
    }
}
