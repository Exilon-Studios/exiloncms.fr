<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\Http\Controllers\Controller;
use MCCMS\Http\Requests\PostRequest;
use MCCMS\Models\Post;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => Post::with('author')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Posts/Create', [
            'pendingId' => old('pending_id', Str::uuid()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostRequest $request)
    {
        $post = Post::create(Arr::except($request->validated(), 'image'));

        if ($request->hasFile('image')) {
            $post->storeImage($request->file('image'), true);
        }

        $post->persistPendingAttachments($request->input('pending_id'));

        if ($post->isPublished() && ($webhookUrl = setting('posts_webhook'))) {
            rescue(fn () => $post->createDiscordWebhook()->send($webhookUrl));
        }

        return to_route('admin.posts.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Edit', ['post' => $post]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostRequest $request, Post $post)
    {
        if ($request->hasFile('image')) {
            $post->storeImage($request->file('image'));
        }

        $post->update(Arr::except($request->validated(), 'image'));

        return to_route('admin.posts.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \LogicException
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return to_route('admin.posts.index')
            ->with('success', trans('messages.status.success'));
    }
}
