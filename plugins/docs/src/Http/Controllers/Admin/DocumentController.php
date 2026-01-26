<?php

namespace ExilonCMS\Plugins\Docs\Http\Controllers\Admin;

use ExilonCMS\Plugins\Docs\Models\Document;
use ExilonCMS\Plugins\Docs\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentController
{
    public function index()
    {
        $categories = DocumentCategory::with('documents')->ordered()->get();
        $documents = Document::with('category', 'user')->ordered()->get();

        return Inertia::render('Admin/Docs/Index', [
            'categories' => $categories,
            'documents' => $documents,
        ]);
    }

    public function create()
    {
        $categories = DocumentCategory::ordered()->get();
        $documents = Document::published()->ordered()->get();

        return Inertia::render('Admin/Docs/Create', [
            'categories' => $categories,
            'documents' => $documents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'category_id' => 'nullable|exists:document_categories,id',
            'parent_id' => 'nullable|exists:documents,id',
            'order' => 'integer|min:0',
            'is_published' => 'boolean',
            'icon' => 'nullable|string|max:50',
            'version' => 'nullable|string|max:50',
        ]);

        $document = Document::create([
            ...$validated,
            'slug' => Str::slug($validated['title']),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('admin.docs.index')
            ->with('success', 'Document created successfully.');
    }

    public function show(Document $document)
    {
        return Inertia::render('Admin/Docs/Show', [
            'document' => $document->load('category', 'user', 'parent'),
        ]);
    }

    public function edit(Document $document)
    {
        $categories = DocumentCategory::ordered()->get();
        $documents = Document::where('id', '!=', $document->id)->published()->ordered()->get();

        return Inertia::render('Admin/Docs/Edit', [
            'document' => $document,
            'categories' => $categories,
            'documents' => $documents,
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'category_id' => 'nullable|exists:document_categories,id',
            'parent_id' => 'nullable|exists:documents,id',
            'order' => 'integer|min:0',
            'is_published' => 'boolean',
            'icon' => 'nullable|string|max:50',
            'version' => 'nullable|string|max:50',
        ]);

        $document->update([
            ...$validated,
            'slug' => Str::slug($validated['title']),
        ]);

        return redirect()->route('admin.docs.index')
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return redirect()->route('admin.docs.index')
            ->with('success', 'Document deleted successfully.');
    }
}
