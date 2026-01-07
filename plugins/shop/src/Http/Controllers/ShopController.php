<?php

namespace ExilonCMS\Plugins\Shop\Http\Controllers;

use Inertia\Inertia;
use ExilonCMS\Http\Controllers\Controller;

class ShopController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Index', [
            'categories' => [],
            'featured_items' => [],
            'money' => setting('money', 'Points'),
        ]);
    }

    public function orders()
    {
        // Return empty orders for now - system will be built later
        return Inertia::render('Shop/Orders', [
            'orders' => [],
            'money' => setting('money', 'Points'),
        ]);
    }

    public function invoices()
    {
        // Return empty invoices for now - system will be built later
        return Inertia::render('Shop/Invoices', [
            'invoices' => [],
            'money' => setting('money', 'Points'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Shop/Create');
    }

    public function store()
    {
        // Store logic
    }

    public function edit($id)
    {
        return Inertia::render('Shop/Edit', ['id' => $id]);
    }

    public function update($id)
    {
        // Update logic
    }

    public function destroy($id)
    {
        // Delete logic
    }
}
