# Theme System - ExilonCMS

Le système de thème ExilonCMS utilise Inertia.js avec une approche simple basée sur les vues Laravel.

## Structure d'un thème

```
themes/
└── your-theme/
    ├── theme.json              # Métadonnées du thème
    ├── resources/
    │   ├── views/              # ⭐ Pages du thème (override des pages core)
    │   │   ├── Home.tsx         # Override de la page d'accueil
    │   │   ├── Shop/
    │   │   │   └── Index.tsx    # Override de la page boutique
    │   │   └── Blog/
    │   │       └── Index.tsx    # Override de la page blog
    │   ├── css/                 # Styles du thème
    │   │   └── theme.css
    │   └── lang/                # Traductions du thème
    │       └── fr/
    │           └── theme.php
    └── assets/                  # Assets statiques (images, fonts, etc.)
```

## Comment override une page

**C'est ultra simple !** Il suffit de créer un fichier dans le dossier `views/` de votre thème avec le même nom que la page core.

### Exemples

| Page Core | Fichier du thème à créer |
|-----------|-------------------------|
| `Home` | `themes/your-theme/resources/views/Home.tsx` |
| `Shop/Index` | `themes/your-theme/resources/views/Shop/Index.tsx` |
| `Blog/Index` | `themes/your-theme/resources/views/Blog/Index.tsx` |
| `Posts/Show` | `themes/your-theme/resources/views/Posts/Show.tsx` |

### Exemple de page de thème

```tsx
// themes/blog/resources/views/Home.tsx
import { Head } from '@inertiajs/react';

interface HomeProps {
  siteName?: string;
  message?: string;
  // ... autres props
}

export default function Home({ siteName, message }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      <div className="min-h-screen">
        <h1>Welcome to {siteName}</h1>
        <p>{message}</p>
        {/* Votre design personnalisé ici */}
      </div>
    </>
  );
}
```

## Pages disponibles pour override

### Pages principales
- `Home` - Page d'accueil
- `Shop/Index` - Boutique
- `Shop/Show` - Page d'un produit
- `Blog/Index` - Liste des articles
- `Posts/Show` - Article individuel
- `Pages/Show` - Page personnalisée

### Pages utilisateur
- `Profile/Index` - Profil utilisateur
- `Notifications/Index` - Notifications

### Pages admin (pour thèmes admin)
- `Admin/Dashboard` - Dashboard admin
- `Admin/Users/Index` - Gestion utilisateurs
- `Admin/Posts/Index` - Gestion articles
- `Admin/Shop/Items/Index` - Gestion produits
- etc.

## Activation du thème

1. Via l'admin : `/admin/themes` → Cliquez sur "Activate"
2. Ou via la console : `php artisan theme:activate your-theme`

## Mode Preview

Pour prévisualiser un thème sans l'activer :
1. Allez dans `/admin/themes`
2. Cliquez sur "Preview"
3. Le thème est appliqué temporairement via la session

## theme.json - Métadonnées

```json
{
  "id": "blog",
  "name": "Blog Theme",
  "description": "Thème moderne pour blogs",
  "version": "1.0.0",
  "author": "Votre Nom",
  "url": "https://votre-site.com",
  "requires": {
    "exiloncms": ">=1.0.0",
    "plugin:blog": ">=1.0.0"
  }
}
```

## Bonnes pratiques

1. **Utilisez les mêmes interfaces TypeScript** que les pages core
2. **Conservez les mêmes props** pour éviter les erreurs
3. **Testez votre thème** en mode preview avant de l'activer
4. **Gérez les layouts** - les thèmes peuvent avoir leurs propres layouts
5. **Assets** - Placez vos images dans `assets/` et utilisez `asset()` pour y accéder

## Besoin d'aide ?

Consultez la documentation sur https://exiloncms.fr/docs/themes
