<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Http\Requests\CommentRequest;
use ExilonCMS\Models\Comment;
use ExilonCMS\Models\Post;

class PostCommentController extends Controller
{
    /**
     * Construct a new PostCommentController instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Comment::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CommentRequest $request, Post $post)
    {
        $post->comments()->create($request->validated());

        return to_route('posts.show', $post);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \LogicException
     */
    public function destroy(Post $post, Comment $comment)
    {
        $comment->delete();

        return to_route('posts.show', $post);
    }
}
