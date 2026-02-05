# Theme System - ExilonCMS

Le système de thème ExilonCMS utilise Inertia.js avec une approche basée sur les fichiers.

**Important** : Ce dossier est vide par défaut. Le thème "default" est intégré au cœur d'ExilonCMS et n'a pas besoin de dossier ici.

## Créer un thème personnalisé

Pour créer un nouveau thème, créez simplement un dossier dans ce répertoire :

```
themes/
└── your-theme/
    ├── theme.json              # Métadonnées du thème (requis)
    └── resources/
        ├── views/              # Pages du thème (override des pages core)
        │   ├── Home.tsx         # Override de la page d'accueil
        │   ├── Shop/            # Override des pages boutique
        │   └── Blog/            # Override des pages blog
        ├── css/                 # Styles du thème
        │   └── theme.css
        └── lang/                # Traductions du thème
            └── fr/
                └── theme.php
```

## Fichier theme.json (requis)

```json
{
  "id": "your-theme",
  "name": "Your Theme Name",
  "description": "Description de votre thème",
  "version": "1.0.0",
  "author": "Your Name",
  "requires": {
    "exiloncms": ">=1.3.70"
  }
}
```

## Comment override une page

Créez un fichier dans `resources/views/` avec le même chemin que la page core.

| Page Core | Fichier du thème à créer |
|-----------|-------------------------|
| `Home` | `themes/your-theme/resources/views/Home.tsx` |
| `Shop/Index` | `themes/your-theme/resources/views/Shop/Index.tsx` |
| `Blog/Index` | `themes/your-theme/resources/views/Blog/Index.tsx` |

### Exemple de page de thème

```tsx
// themes/your-theme/resources/views/Home.tsx
import { Head } from '@inertiajs/react';

interface HomeProps {
  siteName?: string;
}

export default function Home({ siteName }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      <div className="min-h-screen">
        <h1>Welcome to {siteName}</h1>
        {/* Votre design personnalisé ici */}
      </div>
    </>
  );
}
```

## Système File-Based

**Les thèmes sont découverts automatiquement** : si un dossier avec un `theme.json` valide existe dans ce dossier, il apparaîtra automatiquement dans l'admin.

Si vous supprimez le dossier d'un thème, il disparaîtra automatiquement de la liste.

## Activation du thème

1. Via l'admin : `/admin/themes` → Cliquez sur "Activate"
2. Le thème est automatiquement découvert s'il existe dans ce dossier

## Besoin d'aide ?

Consultez la documentation sur https://exiloncms.fr/docs/themes
