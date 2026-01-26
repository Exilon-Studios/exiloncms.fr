<?php

use ExilonCMS\Plugins\Shop\Models\Category;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Support\Facades\Route;

// Shop home - show all categories
Route::get('/', function () {
    $categories = Category::active()->ordered()->with('items')->get();

    return inertia('Shop/Index', [
        'categories' => $categories,
    ]);
})->name('shop.index');

// Show category
Route::get('/category/{slug}', function ($slug) {
    $category = Category::where('slug', $slug)->active()->firstOrFail();

    $items = $category->items()->active()->ordered()->paginate(12);

    return inertia('Shop/Category', [
        'category' => $category,
        'items' => $items,
    ]);
})->name('shop.category');

// Show item
Route::get('/item/{id}', function ($id) {
    $item = Item::active()->with('category')->findOrFail($id);

    return inertia('Shop/Item', [
        'item' => $item,
    ]);
})->name('shop.item');
