<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Http\Requests\AttachmentRequest;
use ExilonCMS\Models\Page;

class PageAttachmentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(AttachmentRequest $request, Page $page)
    {
        $imageUrl = $page->storeAttachment($request->file('file'));

        return response()->json(['location' => $imageUrl]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function pending(AttachmentRequest $request, string $pendingId)
    {
        $imageUrl = Page::storePendingAttachment($pendingId, $request->file('file'));

        return response()->json(['location' => $imageUrl]);
    }
}
