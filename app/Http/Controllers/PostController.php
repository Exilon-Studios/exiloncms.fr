<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Models\Post;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('q');

        $posts = Post::published()
            ->with('author')
            ->when($search, fn (Builder $q) => $q->scopes(['search' => $search]))
            ->orderByDesc('is_pinned')
            ->latest('published_at')
            ->get();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'search' => $search,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(Post $post)
    {
        $post->load([
            'author', 'comments.author',
            'likes.author' => fn (Builder $query) => $query->without('role'),
        ]);

        $this->authorize('view', $post);

        return Inertia::render('Posts/Show', ['post' => $post]);
    }
}
