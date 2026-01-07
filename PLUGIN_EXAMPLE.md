# Guide de développement des plugins ExilonCMS

Ce guide explique comment créer des plugins pour ExilonCMS et comment interagir avec le système.

## Utiliser la classe ExilonCMS

La classe `ExilonCMS\ExilonCMS` fournit des méthodes statiques pour accéder aux fonctionnalités principales :

```php
use ExilonCMS\ExilonCMS;

// Obtenir un paramètre
$siteName = ExilonCMS::setting('name', 'ExilonCMS');
$moneyName = ExilonCMS::setting('money', 'Points');

// Méthodes raccourcies
$siteName = ExilonCMS::siteName();
$moneyName = ExilonCMS::moneyName();
$siteUrl = ExilonCMS::url();

// Obtenir le plugin manager
$pluginManager = ExilonCMS::plugin();

// Obtenir l'instance du jeu actuel
$game = ExilonCMS::game();

// Obtenir la version de l'API
$apiVersion = ExilonCMS::apiVersion();
```

## Enregistrer des dashboard cards

Les plugins peuvent ajouter des cartes au dashboard utilisateur via le ServiceProvider.

### Exemple : Plugin Shop

```php
<?php

namespace ExilonCMS\Plugin\Shop\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;

class ShopServiceProvider extends BasePluginServiceProvider
{
    public function boot(): void
    {
        $this->loadViews();
        $this->loadTranslations();
        $this->loadMigrations();

        // Enregistrer une dashboard card
        ExilonCMS::plugin()->addDashboardCard([
            'id' => 'shop-purchases',
            'title' => 'Mes achats',
            'description' => 'Consultez vos derniers achats dans la boutique',
            'icon' => '🛒',
            'link' => '/shop/purchases',
            'type' => 'info',
        ]);

        // Enregistrer une card avec avertissement
        ExilonCMS::plugin()->addDashboardCard([
            'id' => 'shop-pending-payment',
            'title' => 'Paiement en attente',
            'description' => 'Vous avez un paiement en cours de traitement',
            'icon' => '⚠️',
            'link' => '/shop/checkout',
            'type' => 'warning',
        ]);

        // Enregistrer les routes admin
        $this->registerAdminRoutes(function () {
            Route::get('/shop', [ShopController::class, 'index']);
        });
    }
}
```

### Structure d'une dashboard card

```php
[
    'id' => string,          // ID unique (requis)
    'title' => string,       // Titre (requis)
    'description' => string, // Description (optionnel)
    'icon' => string,        // Emoji ou icône (optionnel)
    'link' => string,        // Lien vers une page (optionnel)
    'type' => string,        // 'info', 'warning', 'success', 'default' (optionnel)
    'permission' => string,  // Permission requise (optionnel)
]
```

## Enregistrer des items de navigation utilisateur

Pour ajouter des liens dans la navigation utilisateur :

```php
ExilonCMS::plugin()->addUserNavItem([
    'title' => 'Boutique',
    'route' => 'shop.index',
    'icon' => 'shopping-bag',
    'permission' => 'shop.access', // Optionnel
]);
```

## Helpers globaux disponibles

Les plugins peuvent également utiliser les helpers globaux définis dans `app/helpers.php` :

```php
// Récupérer un paramètre
setting('money', 'Points');

// Formater une date
format_date($carbonDate);

// Traduire
trans('messages.key');

// Obtenir l'instance du jeu
game();

// Vérifier si le CMS est installé
is_installed();
```

## Exemple complet de plugin

Voici un exemple complet de plugin Shop :

```
plugins/shop/
├── plugin.json              # Métadonnées du plugin
├── composer.json            # Autoloading
├── src/
│   ├── Http/Controllers/
│   │   └── ShopController.php
│   └── Providers/
│       └── ShopServiceProvider.php
├── resources/
│   ├── js/                  # Pages React (optionnel)
│   └── views/               # Vues Blade (optionnel)
└── database/
    └── migrations/
```

### plugin.json

```json
{
    "id": "shop",
    "name": "Boutique",
    "version": "1.0.0",
    "description": "Système de boutique pour ExilonCMS",
    "url": "https://github.com/exiloncms/shop",
    "authors": [
        {"name": "Your Name", "url": "https://github.com/yourname"}
    ],
    "mccms_api": "0.2",
    "providers": [
        "ExilonCMS\\Plugin\\Shop\\Providers\\ShopServiceProvider"
    ]
}
```

### composer.json

```json
{
    "name": "exiloncms/shop",
    "description": "Shop plugin for ExilonCMS",
    "type": "project",
    "autoload": {
        "psr-4": {
            "ExilonCMS\\Plugin\\Shop\\": "src/"
        }
    }
}
```

### ShopServiceProvider.php

```php
<?php

namespace ExilonCMS\Plugin\Shop\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;
use Illuminate\Support\Facades\Route;

class ShopServiceProvider extends BasePluginServiceProvider
{
    public function boot(): void
    {
        $this->loadViews();
        $this->loadTranslations();
        $this->loadMigrations();

        // Dashboard card pour les utilisateurs
        ExilonCMS::plugin()->addDashboardCard([
            'id' => 'shop-balance',
            'title' => 'Solde boutique',
            'description' => 'Votre solde: ' . auth()->user()?->money . ' ' . ExilonCMS::moneyName(),
            'icon' => '💰',
            'link' => '/shop',
        ]);

        // Navigation utilisateur
        ExilonCMS::plugin()->addUserNavItem([
            'title' => 'Boutique',
            'route' => 'shop.index',
            'icon' => '🛒',
        ]);

        // Routes publiques
        Route::middleware(['web', 'auth'])->group(function () {
            Route::prefix('shop')->name('shop.')->group(function () {
                Route::get('/', [ShopController::class, 'index'])->name('index');
                Route::get('/purchases', [ShopController::class, 'purchases'])->name('purchases');
            });
        });

        // Routes admin
        $this->registerAdminRoutes(function () {
            Route::prefix('admin/shop')->name('admin.shop.')->group(function () {
                Route::get('/', [AdminShopController::class, 'index'])->name('index');
                Route::get('/products', [AdminShopController::class, 'products'])->name('products');
            });
        });
    }
}
```
