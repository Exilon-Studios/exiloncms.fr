<?php

namespace ExilonCMS\Http\Controllers\Admin;

use Inertia\Inertia;
use ExilonCMS\Http\Controllers\Controller;

class ShopPluginController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Plugins/Shop/Index', [
            'plugin' => [
                'id' => 'shop',
                'name' => __('messages.shop_plugin.name'),
                'version' => '1.0.4',
                'description' => __('messages.shop_plugin.description'),
                'author' => 'ExilonStudios',
            ],
        ]);
    }
}
