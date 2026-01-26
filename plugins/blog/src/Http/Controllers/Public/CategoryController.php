<?php

namespace ExilonCMS\Plugins\Blog\Http\Controllers\Public;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Blog\Models\Category;
use ExilonCMS\Plugins\Blog\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('posts')
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Blog/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category, Request $request)
    {
        $posts = Post::published()
            ->where('category_id', $category->id)
            ->with(['author', 'category', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(12);

        return Inertia::render('Blog/Categories/Show', [
            'category' => $category,
            'posts' => $posts,
        ]);
    }
}
