<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\Http\Controllers\Controller;
use MCCMS\Http\Requests\AttachmentRequest;
use MCCMS\Models\Page;

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
