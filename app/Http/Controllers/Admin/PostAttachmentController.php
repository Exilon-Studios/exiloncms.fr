<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Http\Requests\AttachmentRequest;
use ExilonCMS\Models\Post;

class PostAttachmentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(AttachmentRequest $request, Post $post)
    {
        $imageUrl = $post->storeAttachment($request->file('file'));

        return response()->json(['location' => $imageUrl]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function pending(AttachmentRequest $request, string $pendingId)
    {
        $imageUrl = Post::storePendingAttachment($pendingId, $request->file('file'));

        return response()->json(['location' => $imageUrl]);
    }
}
