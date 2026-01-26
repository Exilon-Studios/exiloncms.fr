<?php

namespace ExilonCMS\Plugins\Docs\Http\Controllers\Admin;

use ExilonCMS\Plugins\Docs\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentCategoryController
{
    public function index()
    {
        $categories = DocumentCategory::with('documents')->ordered()->get();

        return Inertia::render('Admin/Docs/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Docs/Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'order' => 'integer|min:0',
            'color' => 'nullable|string|max:50',
        ]);

        DocumentCategory::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->route('admin.docs.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(DocumentCategory $category)
    {
        return Inertia::render('Admin/Docs/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, DocumentCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'order' => 'integer|min:0',
            'color' => 'nullable|string|max:50',
        ]);

        $category->update([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->route('admin.docs.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(DocumentCategory $category)
    {
        $category->delete();

        return redirect()->route('admin.docs.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
