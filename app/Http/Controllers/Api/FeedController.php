<?php

namespace ExilonCMS\Http\Controllers\Api;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Post;
use Illuminate\Database\Eloquent\Collection;

class FeedController extends Controller
{
    /**
     * Show the RSS feed for the posts.
     */
    public function rss()
    {
        return response()->view('feed.rss', ['posts' => $this->getRecentPosts()])
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Show the Atom feed for the posts.
     */
    public function atom()
    {
        return response()->view('feed.atom', ['posts' => $this->getRecentPosts()])
            ->header('Content-Type', 'application/xml');
    }

    protected function getRecentPosts(): Collection
    {
        return Post::published()
            ->with(['author', 'comments'])
            ->latest('published_at')
            ->take(10)
            ->get();
    }
}
