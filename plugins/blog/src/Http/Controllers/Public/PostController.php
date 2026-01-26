<?php

namespace ExilonCMS\Plugins\Blog\Http\Controllers\Public;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Blog\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::published()
            ->with(['author', 'category', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(12);

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function show(Post $post)
    {
        if (!$post->isPublished()) {
            abort(404);
        }

        $post->load(['author', 'category', 'tags', 'comments' => function ($query) {
            $query->where('status', 'approved')
                ->whereNull('parent_id')
                ->with(['user', 'replies' => function ($q) {
                    $q->where('status', 'approved')->with('user');
                }])
                ->orderByDesc('created_at');
        }]);

        // Increment view count
        $post->increment('views_count');

        // Get related posts
        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->with(['category', 'tags'])
            ->orderByDesc('published_at')
            ->take(4)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
