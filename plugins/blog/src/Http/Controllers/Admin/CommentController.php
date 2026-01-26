<?php

namespace ExilonCMS\Plugins\Blog\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Blog\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with(['post', 'user', 'parent'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Blog/Admin/Comments/Index', [
            'comments' => $comments,
        ]);
    }

    public function update(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,spam,trash',
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment status updated.');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,spam,trash,delete',
            'comments' => 'required|array',
            'comments.*' => 'exists:blog_comments,id',
        ]);

        $comments = Comment::whereIn('id', $validated['comments']);

        switch ($validated['action']) {
            case 'approve':
                $comments->update(['status' => 'approved']);
                $message = 'Comments approved.';
                break;
            case 'spam':
                $comments->update(['status' => 'spam']);
                $message = 'Comments marked as spam.';
                break;
            case 'trash':
                $comments->update(['status' => 'trash']);
                $message = 'Comments moved to trash.';
                break;
            case 'delete':
                $comments->delete();
                $message = 'Comments deleted.';
                break;
        }

        return back()->with('success', $message);
    }
}
