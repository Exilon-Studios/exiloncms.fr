<?php

namespace MCCMS\Http\Controllers;

use MCCMS\Http\Requests\CommentRequest;
use MCCMS\Models\Comment;
use MCCMS\Models\Post;

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
