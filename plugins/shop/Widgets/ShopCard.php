<?php

namespace ExilonCMS\Plugins\Shop\Widgets;

use ExilonCMS\Extensions\Widget\BaseWidget;
use ExilonCMS\Extensions\Plugin\PluginManager;
use ExilonCMS\Models\User;

class ShopCard extends BaseWidget
{
    public function id(): string
    {
        return 'shop-card';
    }

    public function title(): string
    {
        return __('shop.widget.title');
    }

    public function description(): ?string
    {
        return null;
    }

    public function type(): string
    {
        return 'sidebar';
    }

    public function icon(): ?string
    {
        return '🛒';
    }

    public function link(): ?string
    {
        return null;
    }

    public function props(?User $user): array
    {
        // No recent orders - will show "no orders" message
        return [
            'links' => $this->getLinks(),
            'recentOrders' => [],
        ];
    }

    protected function getLinks(): array
    {
        // Get links from navigation.json
        $pluginManager = app(PluginManager::class);
        $navItems = $pluginManager->getNavigationItemsFromPlugin('shop', 'user');

        return $navItems->map(function ($item) {
            return [
                'label' => __("shop.nav.{$item['label']}") ?? $item['label'],
                'href' => $item['href'],
                'icon' => $item['icon'] ?? 'link',
                'description' => __("shop.nav.{$item['label']}_description") ?? '',
            ];
        })->toArray();
    }

    public function isVisible(?User $user): bool
    {
        return true;
    }
}
