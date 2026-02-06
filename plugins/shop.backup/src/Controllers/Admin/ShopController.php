<?php

namespace ExilonCMS\Plugins\Shop\Controllers\Admin;

use ExilonCMS\Plugins\Shop\Models\Category;
use ExilonCMS\Plugins\Shop\Models\Gateway;
use ExilonCMS\Plugins\Shop\Models\Item;
use ExilonCMS\Plugins\Shop\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ShopController
{
    public function index()
    {
        $stats = [
            'total_items' => Item::count(),
            'active_items' => Item::where('is_active', true)->count(),
            'total_orders' => Order::count(),
            'revenue' => Order::where('status', 'completed')->sum('total'),
        ];

        return Inertia::render('Admin/Shop/Index', [
            'stats' => $stats,
        ]);
    }

    public function items()
    {
        $items = Item::with('category')->ordered()->paginate(20);

        return Inertia::render('Admin/Shop/Items', [
            'items' => $items,
        ]);
    }

    public function createItem()
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('Admin/Shop/CreateItem', [
            'categories' => $categories,
        ]);
    }

    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:shop_categories,id',
            'type' => 'required|in:item,rank,currency,command,custom',
            'image' => 'nullable|string',
            'commands' => 'nullable|array',
            'role_id' => 'nullable|exists:roles,id',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        Item::create($validated);

        return Redirect::route('admin.shop.items')
            ->with('success', 'Item created successfully.');
    }

    public function editItem(Item $item)
    {
        $categories = Category::active()->ordered()->get();

        return Inertia::render('Admin/Shop/EditItem', [
            'item' => $item,
            'categories' => $categories,
        ]);
    }

    public function updateItem(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:shop_categories,id',
            'type' => 'required|in:item,rank,currency,command,custom',
            'image' => 'nullable|string',
            'commands' => 'nullable|array',
            'role_id' => 'nullable|exists:roles,id',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $item->update($validated);

        return Redirect::route('admin.shop.items')
            ->with('success', 'Item updated successfully.');
    }

    public function deleteItem(Item $item)
    {
        $item->delete();

        return Redirect::route('admin.shop.items')
            ->with('success', 'Item deleted successfully.');
    }

    public function categories()
    {
        $categories = Category::ordered()->withCount('items')->paginate(20);

        return Inertia::render('Admin/Shop/Categories', [
            'categories' => $categories,
        ]);
    }

    public function createCategory()
    {
        return Inertia::render('Admin/Shop/CreateCategory');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        Category::create($validated);

        return Redirect::route('admin.shop.categories')
            ->with('success', 'Category created successfully.');
    }

    public function editCategory(Category $category)
    {
        return Inertia::render('Admin/Shop/EditCategory', [
            'category' => $category,
        ]);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return Redirect::route('admin.shop.categories')
            ->with('success', 'Category updated successfully.');
    }

    public function deleteCategory(Category $category)
    {
        $category->delete();

        return Redirect::route('admin.shop.categories')
            ->with('success', 'Category deleted successfully.');
    }

    public function orders()
    {
        $orders = Order::with('user', 'items')->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/Shop/Orders', [
            'orders' => $orders,
        ]);
    }

    public function showOrder(Order $order)
    {
        $order->load(['user', 'items', 'payment']);

        return Inertia::render('Admin/Shop/OrderDetails', [
            'order' => $order,
        ]);
    }

    public function gateways()
    {
        $gateways = Gateway::orderBy('type')->get();

        return Inertia::render('Admin/Shop/Gateways', [
            'gateways' => $gateways,
        ]);
    }

    public function createGateway()
    {
        return Inertia::render('Admin/Shop/CreateGateway');
    }

    public function storeGateway(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:tebex,paypal,stripe',
            'name' => 'required|string|max:255',
            'config' => 'required|array',
            'test_mode' => 'boolean',
        ]);

        Gateway::create($validated);

        return Redirect::route('admin.shop.gateways')
            ->with('success', 'Gateway created successfully.');
    }

    public function editGateway(Gateway $gateway)
    {
        return Inertia::render('Admin/Shop/EditGateway', [
            'gateway' => $gateway,
        ]);
    }

    public function updateGateway(Request $request, Gateway $gateway)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'config' => 'required|array',
            'test_mode' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $gateway->update($validated);

        return Redirect::route('admin.shop.gateways')
            ->with('success', 'Gateway updated successfully.');
    }

    public function deleteGateway(Gateway $gateway)
    {
        $gateway->delete();

        return Redirect::route('admin.shop.gateways')
            ->with('success', 'Gateway deleted successfully.');
    }
}
