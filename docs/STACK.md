# Stack Technique - MC-CMS V2

## ✅ Stack Finale Recommandée

### Backend
- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Database**: PostgreSQL (recommandé) ou MySQL
- **Namespace**: `MCCMS\` (pas `App\`)

### Frontend
- **UI Framework**: React 19
- **Language**: TypeScript 5.9+ (strict mode)
- **Bridge**: Inertia.js v2 (SPA sans API)
- **Styling**: Tailwind CSS v3.4.17 (stable)
- **Components**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React + Tabler Icons
- **Forms**: React Hook Form + Zod
- **Rich Text**: TipTap
- **Animations**: Framer Motion

### Build & Dev Tools
- **Build Tool**: Vite 7
- **Package Manager**: npm
- **CSS Processing**: PostCSS + Autoprefixer

## 📋 Configuration Clés

### Tailwind CSS v3
```js
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: ['./resources/**/*.{blade.php,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',      // 0.75rem
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      }
    }
  }
}
```

### PostCSS
```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

### Vite
```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
  ]
})
```

## 🎨 Design System

### Couleurs Principales
- **Primary**: Orange (#E87743) - Actions principales
- **Secondary**: Teal (#517C79) - Actions secondaires
- **Radius**: 0.75rem (12px) - Coins bien arrondis

### Modes
- Light mode (défaut)
- Dark mode (classe `.dark`)

## 🔧 Commandes Utiles

### Développement
```bash
# Démarrer le serveur Laravel
php artisan serve --port=8002

# Démarrer Vite (HMR)
npm run dev

# Ou les deux en parallèle
composer dev
```

### Build
```bash
# Build de production
npm run build

# Clear cache Laravel
php artisan optimize:clear
```

### Tests
```bash
# Tests PHPUnit
php artisan test

# Test spécifique
php artisan test --filter=UserTest
```

## 📦 Dépendances Principales

### NPM (Frontend)
```json
{
  "dependencies": {
    "@inertiajs/react": "^2.3.4",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "@radix-ui/*": "latest",
    "lucide-react": "^0.562.0",
    "tailwind-merge": "^3.4.0",
    "class-variance-authority": "^0.7.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "typescript": "^5.9.3",
    "vite": "^7.0.7",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49"
  }
}
```

### Composer (Backend)
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^12.0",
    "inertiajs/inertia-laravel": "^2.0"
  }
}
```

## 🏗️ Architecture

### Structure des Fichiers
```
outland-cms-v2/
├── app/                    # Backend (namespace MCCMS\)
│   ├── Http/Controllers/
│   ├── Models/
│   ├── Extensions/         # Système de plugins/thèmes
│   └── Games/             # Intégrations jeux
├── resources/
│   ├── css/
│   │   └── app.css        # Tailwind v3 + Variables CSS
│   ├── js/
│   │   ├── app.tsx        # Point d'entrée Inertia
│   │   ├── pages/         # Pages React (routes Inertia)
│   │   ├── components/    # Composants réutilisables
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── layouts/       # Layouts (Auth, Guest)
│   │   └── types/         # Types TypeScript
│   └── views/
│       └── app.blade.php  # SEUL fichier Blade
├── plugins/               # Plugins modulaires
├── themes/                # Thèmes personnalisables
├── tailwind.config.js     # Config Tailwind v3
├── postcss.config.js      # Config PostCSS
├── vite.config.ts         # Config Vite
└── tsconfig.json          # Config TypeScript strict
```

## 🚀 Système de Plugins & Thèmes

### Plugins
- Structure modulaire dans `plugins/{plugin-name}/`
- Chaque plugin a ses propres routes, controllers, models, migrations
- Pages React spécifiques au plugin
- Système de dépendances entre plugins

### Thèmes
- Structure dans `themes/{theme-name}/`
- Personnalisation complète de l'apparence
- Support du dark mode
- Variables CSS personnalisables

## 📝 Notes Importantes

1. **Pas de Blade** (sauf `app.blade.php`) - Tout est React + Inertia
2. **TypeScript strict** - Tous les types doivent être définis
3. **shadcn/ui** - Composants copiés localement (pas de package npm)
4. **Tailwind v3** - Version stable, pas v4 (incompatibilités)
5. **Rounded buttons** - Fonctionne avec `rounded-md` grâce à `--radius: 0.75rem`

## 🎯 Prochaines Étapes

1. Développer le système de plugins
2. Créer le système de thèmes
3. Intégrations serveurs de jeux (Minecraft, Steam)
4. Marketplace de plugins/thèmes
5. Documentation API

---

**Version**: 2.0.0
**Dernière mise à jour**: 2026-01-01
