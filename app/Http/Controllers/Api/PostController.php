<?php

namespace MCCMS\Http\Controllers\Api;

use MCCMS\Http\Controllers\Controller;
use MCCMS\Http\Resources\PostResource;
use MCCMS\Models\Post;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PostResource::collection(Post::published()
            ->with('author')
            ->latest('published_at')
            ->get());
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        abort_if(! $post->isPublished(), 404);

        return new PostResource($post->load(['comments', 'author']));
    }
}
