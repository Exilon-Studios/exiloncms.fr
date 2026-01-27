<?php

use ExilonCMS\Plugins\Shop\Controllers\CartController;
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

// Cart routes
Route::prefix('cart')->group(function () {
    Route::get('/items', [CartController::class, 'index'])->name('cart.items');
    Route::post('/add/{itemId}', [CartController::class, 'add'])->name('cart.add');
    Route::post('/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/remove/{id}', [CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/clear', [CartController::class, 'clear'])->name('cart.clear');
});
