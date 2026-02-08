<?php

namespace ExilonCMS\Plugins\Shop\Controllers;

use ExilonCMS\Plugins\Shop\Models\Category;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController
{
    public function index(Request $request)
    {
        $categoryId = $request->input('category');
        $search = $request->input('search');

        $query = Item::where('is_active', true);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $items = $query->with('category')
            ->orderBy('name')
            ->paginate(setting('plugin.shop.items_per_page', 12));

        $categories = Category::orderBy('position')->get();

        return Inertia::render('Shop/Index', [
            'items' => $items,
            'categories' => $categories,
            'currentCategory' => $categoryId,
        ]);
    }

    public function show($id)
    {
        $item = Item::with('category')->findOrFail($id);

        return Inertia::render('Shop/Show', [
            'item' => $item,
        ]);
    }
}
