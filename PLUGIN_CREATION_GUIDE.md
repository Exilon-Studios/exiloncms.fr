# Guide de Création de Plugin - ExilonCMS

Ce guide documente toutes les étapes pour créer un plugin fonctionnel pour ExilonCMS.

## Structure d'un Plugin

```
plugins/my-plugin/
├── plugin.json              # Métadonnées du plugin
├── composer.json            # Autoloading PSR-4
├── navigation.json          # Navigation (admin + user)
├── src/
│   ├── Http/
│   │   └── Controllers/
│   │       └── MyPluginController.php
│   ├── Models/              # Modèles Eloquent (optionnel)
│   └── Providers/
│       └── MyPluginServiceProvider.php
├── resources/
│   ├── js/
│   │   └── pages/           # Pages TSX pour Inertia
│   │       └── Index.tsx
│   └── lang/
│       └── fr/             # Traductions
│           ├── nav.php
│           └── widget.php
├── database/
│   └── migrations/         # Migrations de base de données
├── Widgets/                # Widgets pour le dashboard (optionnel)
│   └── MyWidget.php
└── routes/
    └── web.php             # Routes publiques et privées
```

## 1. Fichier `plugin.json`

Définit les métadonnées du plugin :

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "description": "Description de mon plugin",
  "version": "1.0.0",
  "author": "YourName",
  "url": "https://github.com/your-repo",
  "mccms_api": "0.2",
  "providers": [
    "ExilonCMS\\Plugins\\MyPlugin\\Providers\\MyPluginServiceProvider"
  ],
  "requirements": {
    "php": ">=8.2",
    "laravel": ">=12"
  }
}
```

## 2. Fichier `composer.json`

Configure l'autoloading PSR-4 :

```json
{
  "name": "exiloncms/my-plugin",
  "description": "Description de mon plugin",
  "type": "exiloncms-plugin",
  "license": "MIT",
  "autoload": {
    "psr-4": {
      "ExilonCMS\\Plugins\\MyPlugin\\": "src/"
    },
    "files": [
      "src/Providers/MyPluginServiceProvider.php"
    ]
  },
  "require": {
    "php": ">=8.2"
  }
}
```

## 3. Fichier `navigation.json`

Définit les liens de navigation pour admin et users :

```json
{
  "admin": [
    {
      "label": "My Plugin",
      "href": "/admin/plugins/my-plugin",
      "permission": "admin.plugins",
      "icon": "puzzle"
    }
  ],
  "user": [
    {
      "label": "my-plugin",
      "href": "/my-plugin",
      "icon": "puzzle"
    }
  ]
}
```

**Champs disponibles :**
- `label` : Clé de traduction ou texte direct
- `href` : URL de la page
- `permission` (optionnel) : Permission requise
- `icon` : Nom de l'icône Lucide/Tabler

## 4. Service Provider (`src/Providers/MyPluginServiceProvider.php`)

```php
<?php

namespace ExilonCMS\Plugins\MyPlugin\Providers;

use ExilonCMS\Extensions\Plugin\BasePluginServiceProvider;

class MyPluginServiceProvider extends BasePluginServiceProvider
{
    public function boot(): void
    {
        // Charger les traductions
        $this->loadTranslations();

        // Charger les routes automatiquement depuis routes/web.php
        $this->loadRoutes();

        // Charger les migrations (optionnel)
        $this->loadMigrations();
    }
}
```

**Méthodes disponibles dans BasePluginServiceProvider :**

### Chargement de ressources
- `loadTranslations()` - Charge les traductions depuis `resources/lang/`
- `loadViews()` - Charge les views Blade depuis `resources/views/`
- `loadMigrations()` - Charge les migrations depuis `database/migrations/`
- `loadRoutes()` - Charge les routes depuis `routes/web.php`

### Enregistrement de routes (alternatives)
- `registerAdminRoutes(Closure $callback)` - Routes admin (`/admin/*`)
- `registerUserRoutes(Closure $callback)` - Routes user authentifiées

### Autres fonctionnalités (avancé)
- `registerPolicies()` - Enregistre les policies
- `registerSchedule()` - Enregistre les tâches planifiées
- `registerMiddleware()` - Enregistre les middlewares

## 5. Routes (`routes/web.php`)

```php
<?php

use Illuminate\Support\Facades\Route;
use ExilonCMS\Plugins\MyPlugin\Http\Controllers\MyPluginController;

// Page publique
Route::middleware(['web'])
    ->group(function () {
        Route::get('/my-plugin', [MyPluginController::class, 'index'])->name('my-plugin.index');
    });

// Pages privées (requièrent auth)
Route::middleware(['web', 'auth'])
    ->prefix('dashboard')
    ->group(function () {
        Route::get('/my-plugin', [MyPluginController::class, 'dashboard'])->name('dashboard.my-plugin');
    });
```

## 6. Contrôleur (`src/Http/Controllers/MyPluginController.php`)

```php
<?php

namespace ExilonCMS\Plugins\MyPlugin\Http\Controllers;

use Inertia\Inertia;
use ExilonCMS\Http\Controllers\Controller;

class MyPluginController extends Controller
{
    public function index()
    {
        return Inertia::render('MyPlugin/Index', [
            'data' => [], // Vos données
        ]);
    }
}
```

**Important :** TOUJOURS utiliser `Inertia::render()` et retourner des données réelles (pas de mock data).

## 7. Pages TSX (`resources/js/pages/MyPlugin/Index.tsx`)

```tsx
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface MyPluginProps {
    data: any[];
}

export default function MyPluginIndex({ data }: MyPluginProps) {
    return (
        <AuthenticatedLayout>
            <Head title="My Plugin" />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold">My Plugin</h1>
                {/* Votre contenu */}
            </div>
        </AuthenticatedLayout>
    );
}
```

**Règles :**
- TOUJOURS utiliser `AuthenticatedLayout` pour les pages publiques aussi
- TOUJOURS inclure `<Head title="..." />`
- Utiliser Tailwind CSS pour le style
- Utiliser les composants shadcn/ui (`@/components/ui/*`)

## 8. Traductions (`resources/lang/fr/nav.php`)

```php
<?php

return [
    'my-plugin' => 'Mon Plugin',
    'my-plugin_description' => 'Description de mon plugin',
];
```

**Pour utiliser les traductions dans le layout :**

Dans `HandleInertiaRequests.php`, ajoutez :
```php
'trans' => [
    // ...
    'my-plugin::nav' => trans('my-plugin::nav'),
],
```

## 9. Widgets (Optionnel - `Widgets/MyWidget.php`)

Les widgets apparaissent dans le dashboard des utilisateurs.

```php
<?php

namespace ExilonCMS\Plugins\MyPlugin\Widgets;

use ExilonCMS\Extensions\Widget\BaseWidget;
use ExilonCMS\Models\User;

class MyWidget extends BaseWidget
{
    public function id(): string
    {
        return 'my-widget';
    }

    public function title(): string
    {
        return __('my-plugin::widget.title');
    }

    public function type(): string
    {
        // Types disponibles: 'card', 'sidebar', 'widget'
        return 'sidebar';
    }

    public function icon(): ?string
    {
        return 'puzzle'; // Nom d'icône Lucide/Tabler
    }

    public function link(): ?string
    {
        return '/my-plugin';
    }

    public function props(?User $user): array
    {
        return [
            'items' => [], // Vos données
        ];
    }
}
```

## 10. Migrations (Optionnel - `database/migrations/`)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('my_plugin_table', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('my_plugin_table');
    }
};
```

## Installation du Plugin

1. Copiez le dossier dans `plugins/my-plugin/`
2. Lancez `composer dump-autoload`
3. Activez le plugin depuis l'admin ou via la base de données
4. Lancez les migrations : `php artisan migrate`
5. Videz le cache : `php artisan optimize:clear`

## Icônes Disponibles (pour navigation.json et widgets)

```
shopping-bag, package, file-text, puzzle, settings, users,
shield, ban, file, photo, arrows-right-left, palette, download,
list, language, home, server, etc.
```

(Voir `AuthenticatedLayout.tsx` pour la liste complète)

## Checklist de Création

- [ ] `plugin.json` avec les métadonnées
- [ ] `composer.json` avec PSR-4
- [ ] `navigation.json` pour la navigation
- [ ] ServiceProvider avec `loadTranslations()` et `loadRoutes()`
- [ ] `routes/web.php` avec les routes
- [ ] Contrôleur avec `Inertia::render()`
- [ ] Pages TSX avec `AuthenticatedLayout`
- [ ] Traductions dans `resources/lang/fr/`
- [ ] Widgets (optionnel)
- [ ] Migrations (optionnel)

## Notes Importantes

1. **PAS de données mock** - Retournez des tableaux vides si pas de données
2. **PAS de views Blade** - Utilisez TSX avec Inertia
3. **PAS de code CMS-specific** - Le plugin doit être indépendant
4. **Traduction requise** - Toutes les strings doivent être traduisibles
5. **TypeScript strict** - Tous les composants TSX doivent être typés
6. **Tailwind CSS** - Utilisez les classes utilitaires Tailwind
7. **shadcn/ui** - Utilisez les composants de `@/components/ui/*`
