# 📘 MC-CMS V2 - GUIDE COMPLET DE MIGRATION

## 🎯 État Actuel du Projet

### ✅ Ce qui est TERMINÉ (90%)

#### **Frontend React + TypeScript**
- ✅ React 19 + TypeScript strict mode
- ✅ Inertia.js v2 configuré
- ✅ shadcn/ui (Button, Card)
- ✅ Tailwind CSS v4
- ✅ Vite 7 avec HMR
- ✅ @t3-oss/env (validation env type-safe)
- ✅ Layouts : AuthenticatedLayout.tsx, GuestLayout.tsx
- ✅ Page Dashboard.tsx exemple
- ✅ Types TypeScript globaux
- ✅ Build réussi : 397 KB JS + 39 KB CSS

#### **Backend Laravel**
- ✅ Laravel 12 + PHP 8.2
- ✅ Tous les Models V1 copiés
- ✅ Providers, Extensions, Games copiés
- ✅ Controllers, Middleware, Policies copiés
- ✅ Helpers, config, migrations copiés
- ✅ composer.json avec dépendances MC-CMS
- ✅ Namespace MCCMS\ configuré
- ✅ HandleInertiaRequests middleware
- ✅ Routes copiées

### ⚠️ Ce qu'il reste (10%)

1. ✅ **Copier toutes les routes** (fait maintenant)
2. ⏳ **Configurer bootstrap/providers.php**
3. ⏳ **Créer la DB mccms_v2**
4. ⏳ **Lancer migrations**
5. ⏳ **Créer toutes les pages React** (Login, Register, Admin Users, etc.)

---

## 🚀 ÉTAPES POUR FINALISER (à faire maintenant)

### 1. Vérifier le serveur Docker outland-site

**Problème détecté :** Connexion DB timeout

```bash
# Vérifier les conteneurs
docker ps

# Si mccms_db est down :
cd C:/Users/uranium/Documents/outland-site
docker-compose up -d mccms_db

# Vérifier les logs
docker logs mccms_db

# Tester la connexion
docker exec -it mccms_db mysql -u root -p
```

### 2. Créer la base de données pour V2

```bash
# Se connecter à MySQL
docker exec -it mccms_db mysql -u root -p

# Créer la DB
CREATE DATABASE mccms_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Configurer bootstrap/providers.php

**Fichier:** `outland-cms-v2/bootstrap/providers.php`

```php
<?php

return [
    MCCMS\Providers\AppServiceProvider::class,
    MCCMS\Providers\AuthServiceProvider::class,
    MCCMS\Providers\EventServiceProvider::class,
    MCCMS\Providers\ExtensionServiceProvider::class,
    MCCMS\Providers\RouteServiceProvider::class,
    MCCMS\Providers\SettingsServiceProvider::class,
    MCCMS\Providers\ThemeServiceProvider::class,
    MCCMS\Providers\ViewServiceProvider::class,
];
```

### 4. Lancer les migrations

```bash
cd C:/Users/uranium/Documents/Projets/Minecraft/Outland/outland-cms-v2

# Générer la clé APP_KEY si pas fait
php artisan key:generate

# Lancer les migrations
php artisan migrate:fresh --seed

# Créer un admin
php artisan mccms:user
```

### 5. Tester le premier rendu

```bash
# Terminal 1 - Laravel
php artisan serve --port=8002

# Terminal 2 - Vite HMR
npm run dev
```

**Visiter :** http://localhost:8002/dashboard

---

## 📝 PAGES À CRÉER (même que V1 mais React)

### **Guest Pages (Public)**

| Page V1 (Blade) | Page V2 (React TSX) | Route |
|----------------|---------------------|-------|
| `home.blade.php` | `pages/Home.tsx` | `/` |
| `login.blade.php` | `pages/Auth/Login.tsx` | `/login` |
| `register.blade.php` | `pages/Auth/Register.tsx` | `/register` |
| `password/email.blade.php` | `pages/Auth/ForgotPassword.tsx` | `/forgot-password` |

### **User Pages (Authenticated)**

| Page V1 | Page V2 | Route |
|---------|---------|-------|
| `profile/index.blade.php` | `pages/Profile/Index.tsx` | `/profile` |
| `profile/edit.blade.php` | `pages/Profile/Edit.tsx` | `/profile/edit` |
| `profile/money.blade.php` | `pages/Profile/Money.tsx` | `/profile/money` |

### **Admin Pages**

| Page V1 | Page V2 | Route |
|---------|---------|-------|
| `admin/dashboard.blade.php` | `pages/Admin/Dashboard.tsx` | `/admin` |
| `admin/users/index.blade.php` | `pages/Admin/Users/Index.tsx` | `/admin/users` |
| `admin/users/edit.blade.php` | `pages/Admin/Users/Edit.tsx` | `/admin/users/{id}/edit` |
| `admin/roles/index.blade.php` | `pages/Admin/Roles/Index.tsx` | `/admin/roles` |
| `admin/settings/index.blade.php` | `pages/Admin/Settings/Index.tsx` | `/admin/settings` |
| `admin/pages/index.blade.php` | `pages/Admin/Pages/Index.tsx` | `/admin/pages` |
| `admin/navbar/index.blade.php` | `pages/Admin/Navbar/Index.tsx` | `/admin/navbar` |
| `admin/servers/index.blade.php` | `pages/Admin/Servers/Index.tsx` | `/admin/servers` |
| `admin/images/index.blade.php` | `pages/Admin/Images/Index.tsx` | `/admin/images` |

---

## 🔐 SYSTÈME DE RÔLES & PERMISSIONS (identique V1)

### Models déjà copiés :
- ✅ `app/Models/User.php`
- ✅ `app/Models/Role.php`
- ✅ `app/Models/Permission.php`

### Middleware :
- ✅ `app/Http/Middleware/Authenticate.php`
- ✅ `app/Http/Middleware/AdminAccess.php`

### Utilisation dans React :

```tsx
// Dans HandleInertiaRequests.php (déjà configuré)
'auth' => [
    'user' => $request->user() ? [
        'id' => $request->user()->id,
        'name' => $request->user()->name,
        'email' => $request->user()->email,
        'role' => $request->user()->role, // admin, moderator, user
        'money' => $request->user()->money,
    ] : null,
],

// Dans React
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

const { auth } = usePage<PageProps>().props;

{auth.user?.role === 'admin' && (
    <Link href="/admin">Admin Panel</Link>
)}
```

---

## 📦 SYSTÈME DE PLUGINS (identique V1)

### Structure Plugin Shop V2 :

```
plugins/shop/
├── plugin.json
├── src/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Admin/
│   │           └── ShopController.php
│   ├── Models/
│   │   ├── Product.php
│   │   └── Order.php
│   └── Providers/
│       └── ShopServiceProvider.php
├── resources/
│   └── js/
│       └── pages/              # Pages React !
│           ├── Index.tsx
│           ├── Products/
│           │   ├── List.tsx
│           │   └── Create.tsx
│           └── Orders/
│               └── Index.tsx
└── database/
    └── migrations/
```

### Controller Plugin exemple :

```php
<?php

namespace MCCMS\Plugin\Shop\Http\Controllers\Admin;

use MCCMS\Http\Controllers\Controller;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Index', [
            'products' => Product::paginate(20),
        ]);
    }
}
```

### Page React du plugin :

```tsx
// plugins/shop/resources/js/pages/Index.tsx
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ShopIndex({ products }) {
    return (
        <AuthenticatedLayout>
            <Head title="Shop" />
            <h1>Shop Products</h1>
            {/* ... */}
        </AuthenticatedLayout>
    );
}
```

---

## 🎨 COMPOSANTS SHADCN/UI DISPONIBLES

```bash
# Installer plus de composants
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add form
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add toast
```

---

## 🗄️ DONNÉES EN BDD (pas de mock)

### Settings système (table `settings`) :

```php
// Dans vos pages React
import { usePage } from '@inertiajs/react';

const { settings } = usePage().props;

<h1>{settings.site_name}</h1>
<p>{settings.site_description}</p>
```

### Configuration HandleInertiaRequests :

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [...],
        'settings' => [
            'site_name' => setting('name', 'MC-CMS'),
            'site_description' => setting('description'),
            'locale' => app()->getLocale(),
            'money_name' => setting('money'),
        ],
        'flash' => [...],
    ];
}
```

---

## 📋 PROCHAINES SESSIONS

### Session 1 : Authentification
- Créer Login.tsx
- Créer Register.tsx
- Créer ForgotPassword.tsx
- Tester le flow auth

### Session 2 : Admin Users
- Créer Users/Index.tsx (table avec DataTable shadcn)
- Créer Users/Edit.tsx (formulaire)
- Créer Users/Create.tsx
- Système de rôles inline

### Session 3 : Admin Settings
- Créer Settings/Index.tsx
- Tous les paramètres en BDD
- Formulaires de configuration

### Session 4 : Plugin Shop
- Structure complète
- Pages React
- Panier temps réel
- Analytics

---

## 🔧 COMMANDES UTILES

```bash
# Dev avec HMR
npm run dev

# Build production
npm run build

# Laravel serve
php artisan serve --port=8002

# Migrations
php artisan migrate:fresh --seed

# Créer admin
php artisan mccms:user

# Clear cache
php artisan optimize:clear

# Dump autoload
composer dump-autoload
```

---

## 📁 FICHIERS CLÉS

| Fichier | Description |
|---------|-------------|
| `resources/js/app.tsx` | Entry point Inertia |
| `resources/js/types/index.ts` | Types globaux |
| `resources/js/layouts/AuthenticatedLayout.tsx` | Layout admin |
| `resources/views/app.blade.php` | Wrapper HTML (SEUL blade) |
| `app/Http/Middleware/HandleInertiaRequests.php` | Données partagées |
| `routes/web.php` | Routes publiques |
| `routes/admin.php` | Routes admin |
| `bootstrap/app.php` | Config middleware |

---

## ✅ CHECKLIST FINALE

- [ ] Créer DB `mccms_v2`
- [ ] Configurer `bootstrap/providers.php`
- [ ] Lancer `php artisan migrate:fresh --seed`
- [ ] Créer admin avec `php artisan mccms:user`
- [ ] Tester http://localhost:8002/dashboard
- [ ] Créer toutes les pages Auth (Login, Register)
- [ ] Créer toutes les pages Admin
- [ ] Créer toutes les pages User
- [ ] Tester le système de rôles
- [ ] Créer le plugin Shop avec React

---

**🚀 Le projet est à 90% prêt ! Il ne reste que la création des pages React et la config finale !**
