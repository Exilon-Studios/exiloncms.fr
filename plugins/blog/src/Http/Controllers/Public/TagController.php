<?php

namespace ExilonCMS\Plugins\Blog\Http\Controllers\Public;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Blog\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::withCount('posts')
            ->orderBy('name')
            ->get();

        return Inertia::render('Blog/Tags/Index', [
            'tags' => $tags,
        ]);
    }

    public function show(Tag $tag, Request $request)
    {
        $posts = $tag->posts()
            ->published()
            ->with(['author', 'category', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(12);

        return Inertia::render('Blog/Tags/Show', [
            'tag' => $tag,
            'posts' => $posts,
        ]);
    }
}
