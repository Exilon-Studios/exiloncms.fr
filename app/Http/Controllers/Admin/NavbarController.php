<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Http\Requests\NavbarElementRequest;
use ExilonCMS\Models\NavbarElement;
use ExilonCMS\Models\Role;
use ExilonCMS\Plugins\Blog\Models\Post;
use ExilonCMS\Plugins\Pages\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NavbarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $elements = NavbarElement::scopes('parent')
            ->orderBy('position')
            ->get()
            ->map(function ($element) {
                return [
                    'id' => $element->id,
                    'name' => $element->raw_name,
                    'type' => $element->type,
                    'value' => $element->value,
                    'icon' => $element->icon,
                    'new_tab' => $element->new_tab,
                    'position' => $element->position,
                    'elements' => $element->elements->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'name' => $child->raw_name,
                            'type' => $child->type,
                            'value' => $child->value,
                            'icon' => $child->icon,
                            'new_tab' => $child->new_tab,
                            'position' => $child->position,
                        ];
                    }),
                ];
            });

        return Inertia::render('Admin/Navbar/Index', [
            'navbarElements' => $elements,
        ]);
    }

    /**
     * Update the resources order in storage.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateOrder(Request $request)
    {
        $this->validate($request, [
            'order.*.id' => ['required', 'integer'],
            'order.*.children' => ['sometimes', 'array'],
        ]);

        $elements = $request->input('order');

        $position = 1;

        foreach ($elements as $element) {
            $id = $element['id'];
            $children = $element['children'] ?? [];

            NavbarElement::whereKey($id)->update([
                'position' => $position++,
                'parent_id' => null,
            ]);

            $childPosition = 1;

            foreach ($children as $child) {
                NavbarElement::whereKey($child['id'])->update([
                    'position' => $childPosition++,
                    'parent_id' => $id,
                ]);
            }
        }

        NavbarElement::clearCache();

        return response()->json([
            'message' => trans('admin.navbar_elements.updated'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Navbar/Create', [
            'types' => [
                'home' => trans('admin.navbar.index.types.home'),
                'link' => trans('admin.navbar.index.types.link'),
                'page' => trans('admin.navbar.index.types.page'),
                'post' => trans('admin.navbar.index.types.post'),
                'posts' => trans('admin.navbar.index.types.posts'),
                'plugin' => trans('admin.navbar.index.types.plugin'),
                'dropdown' => trans('admin.navbar.index.types.dropdown'),
            ],
            'pages' => Page::enabled()->get(),
            'posts' => Post::published()->get(),
            'roles' => Role::orderByDesc('power')->get(),
            'pluginRoutes' => plugins()->getRouteDescriptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NavbarElementRequest $request)
    {
        $element = NavbarElement::create($request->validated());

        $element->roles()->sync($request->input('roles'));

        return to_route('admin.navbar-elements.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NavbarElement $navbarElement)
    {
        return Inertia::render('Admin/Navbar/Edit', [
            'navbarElement' => [
                'id' => $navbarElement->id,
                'name' => $navbarElement->raw_name,
                'type' => $navbarElement->type,
                'value' => $navbarElement->value,
                'icon' => $navbarElement->icon,
                'new_tab' => $navbarElement->new_tab,
                'position' => $navbarElement->position,
            ],
            'types' => [
                'home' => trans('admin.navbar.index.types.home'),
                'link' => trans('admin.navbar.index.types.link'),
                'page' => trans('admin.navbar.index.types.page'),
                'post' => trans('admin.navbar.index.types.post'),
                'posts' => trans('admin.navbar.index.types.posts'),
                'plugin' => trans('admin.navbar.index.types.plugin'),
                'dropdown' => trans('admin.navbar.index.types.dropdown'),
            ],
            'pages' => Page::enabled()->get(),
            'posts' => Post::published()->get(),
            'roles' => Role::orderByDesc('power')->get(),
            'pluginRoutes' => plugins()->getRouteDescriptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(NavbarElementRequest $request, NavbarElement $navbarElement)
    {
        if ($navbarElement->isDropdown() && $request->input('type') !== 'dropdown') {
            foreach ($navbarElement->elements as $element) {
                $element->parent()->dissociate();
                $element->save();
            }
        }

        $navbarElement->update($request->validated());

        $navbarElement->roles()->sync($request->input('roles'));

        NavbarElement::clearCache();

        return to_route('admin.navbar-elements.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \LogicException
     */
    public function destroy(NavbarElement $navbarElement)
    {
        if ($navbarElement->isDropdown() && ! $navbarElement->elements->isEmpty()) {
            return to_route('admin.navbar-elements.index')
                ->with('error', trans('admin.navbar_elements.not_empty'));
        }

        $navbarElement->delete();

        return to_route('admin.navbar-elements.index')
            ->with('success', trans('messages.status.success'));
    }
}
