<?php

namespace ExilonCMS\Plugins\Shop\Controllers\Admin;

use ExilonCMS\Plugins\Shop\Models\Category;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ShopController
{
    public function index()
    {
        // Check if Shop plugin tables exist before querying
        $hasItemsTable = Schema::hasTable('shop_items');
        $hasOrdersTable = Schema::hasTable('orders');
        $hasCategoriesTable = Schema::hasTable('shop_categories');

        $stats = [
            'total_items' => $hasItemsTable ? Item::count() : 0,
            'total_orders' => $hasOrdersTable ? \ExilonCMS\Plugins\Shop\Models\Order::count() : 0,
            'total_revenue' => $hasOrdersTable ? (\ExilonCMS\Plugins\Shop\Models\Order::completed()->sum('total') ?? 0) : 0,
            'pending_orders' => $hasOrdersTable ? \ExilonCMS\Plugins\Shop\Models\Order::pending()->count() : 0,
        ];

        $categories = $hasCategoriesTable ? Category::orderBy('position')->get() : collect();

        return Inertia::render('Admin/Shop/Index', [
            'stats' => $stats,
            'categories' => $categories,
        ]);
    }

    public function settings(Request $request)
    {
        $configFile = base_path('plugins/shop/config/config.php');
        $config = file_exists($configFile) ? require $configFile : [];

        $settings = [];
        foreach ($config as $key => $field) {
            $settingKey = "shop.{$key}";
            $settings[$key] = setting($settingKey, $field['default'] ?? null);
        }

        return Inertia::render('Admin/Shop/Settings', [
            'config' => $config,
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $plugin = app(\ExilonCMS\Classes\Plugin\PluginLoader::class)->getPlugin('shop');

        if (! $plugin) {
            return redirect()->back()->with('error', 'Shop plugin not found.');
        }

        $configFields = collect($plugin->getConfigFields())->keyBy('name');

        foreach ($request->all() as $key => $value) {
            if (! $configFields->has($key)) {
                continue;
            }

            $field = $configFields->get($key);
            $settingKey = "plugin.shop.{$key}";

            $processedValue = match ($field['type'] ?? 'text') {
                'boolean', 'toggle' => (bool) $value,
                'integer', 'number' => is_numeric($value) ? (int) $value : 0,
                default => $value,
            };

            \ExilonCMS\Models\Setting::updateOrCreate(
                ['name' => $settingKey],
                ['value' => is_array($processedValue) ? json_encode($processedValue) : $processedValue]
            );
        }

        return redirect()->back()->with('success', 'Configuration updated successfully.');
    }
}
