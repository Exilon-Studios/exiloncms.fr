<?php

namespace ExilonCMS\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use ExilonCMS\Models\NavbarElement;
use ExilonCMS\Models\SocialLink;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'money' => $user->money ?? 0,
                    'hasAdminAccess' => $user->hasAdminAccess(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'settings' => [
                'name' => setting('name', config('app.name')),
                'description' => setting('description'),
                'locale' => app()->getLocale(),
                'background' => setting('background') ? image_url(setting('background')) : null,
                'favicon' => favicon(),
                'copyright' => str_replace('{year}', date('Y'), setting('copyright', '')),
                'darkTheme' => dark_theme(),
                // Navbar settings
                'navbar' => [
                    'links_position' => setting('navbar.links_position', 'left'),
                    'links_spacing' => setting('navbar.links_spacing', '4rem'),
                    'style' => setting('navbar.style', 'transparent'),
                    'background' => setting('navbar.background'),
                ],
            ],
            'navbar' => $this->loadNavbarElements($user),
            'socialLinks' => SocialLink::orderBy('position')->get()->map(fn($link) => [
                'title' => $link->title,
                'value' => $link->value,
                'icon' => $link->icon,
                'color' => $link->color,
            ]),
            // Share translations for common keys
            'trans' => [
                'auth' => trans('auth'),
                'messages' => trans('messages'),
                'admin' => trans('admin'),
                'pages' => trans('pages'),
                'puck' => trans('puck'),
                'dashboard' => trans('dashboard'),
            ],
        ];
    }

    protected function loadNavbarElements($user): array
    {
        $elements = Cache::get(NavbarElement::CACHE_KEY, function () {
            return NavbarElement::orderBy('position')->with('roles')->get();
        });

        if (! $elements instanceof \Illuminate\Database\Eloquent\Collection) {
            $elements = NavbarElement::hydrate($elements);
        }

        $filteredElements = $elements->filter(fn (NavbarElement $element) => $element->hasPermission());
        $parentElements = $filteredElements->whereNull('parent_id');

        return $parentElements->map(function (NavbarElement $element) use ($filteredElements) {
            $data = [
                'id' => $element->id,
                'name' => $element->raw_name,
                'type' => $element->type,
                'value' => $element->value,
                'link' => $element->getLink(),
                'newTab' => $element->new_tab,
                'isDropdown' => $element->isDropdown(),
                'isCurrent' => $element->isCurrent(),
                'elements' => [],
            ];

            if ($element->isDropdown()) {
                $data['elements'] = $filteredElements
                    ->where('parent_id', $element->id)
                    ->map(fn($child) => [
                        'id' => $child->id,
                        'name' => $child->raw_name,
                        'type' => $child->type,
                        'value' => $child->value,
                        'link' => $child->getLink(),
                        'newTab' => $child->new_tab,
                        'isCurrent' => $child->isCurrent(),
                    ])
                    ->values()
                    ->toArray();
            }

            return $data;
        })->values()->toArray();
    }
}
