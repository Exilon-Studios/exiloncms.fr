# Saazy Theme for ExilonCMS

Un thème moderne et élégant pour ExilonCMS, inspiré du design Saazy avec des animations fluides Framer Motion.

## 🎨 Caractéristiques

- **Design moderne** inspiré du thème WordPress Saazy
- **Animations fluides** avec Framer Motion
- **100% Responsive** - Mobile, tablette et desktop
- **Dark mode support** - Theme sombre inclus
- **Performance optimisée** - Chargement rapide
- **SEO friendly** - Structure sémantique optimisée
- **Facile à personnaliser** - Couleurs, fonts, espacements

## 📦 Installation

### Via le Panel Admin

1. Allez dans **Admin → Thèmes**
2. Cliquez sur **Ajouter un thème**
3. Sélectionnez le dossier `saazy`
4. Cliquez sur **Activer**

### Via Commande

```bash
# Copier le thème dans le dossier themes
php artisan theme:install saazy

# Activer le thème
php artisan theme:activate saazy

# Publier les assets
php artisan theme:publish saazy
```

## 🚀 Utilisation

Une fois activé, le thème remplace automatiquement la page d'accueil par défaut avec :

- **Hero Section** - Grande bannière avec animations
- **Compatible Games** - Grille de jeux supportés
- **Features** - Section fonctionnalités avec hover effects
- **Stack Technique** - Présentation de la stack
- **Testimonials** - Carousel de témoignages
- **FAQ** - Accordéon interactif
- **CTA** - Section d'appel à l'action

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies via Tailwind CSS. Pour les modifier :

1. Copiez `themes/saazy/resources/css/style.css`
2. Modifiez les variables CSS
3. Rebuild les assets : `npm run build`

### Contenu

Le contenu peut être personnalisé dans **Admin → Pages** ou en éditant directement le composant `HeroSaazy.tsx`.

### Logo

Le logo peut être changé dans **Admin → Paramètres → Logo**.

## 📁 Structure

```
themes/saazy/
├── src/
│   ├── Http/Controllers/
│   │   └── HomeController.php
│   └── SaazyServiceProvider.php
├── resources/
│   ├── js/
│   │   └── pages/
│   │       └── Home.tsx
│   ├── views/
│   │   └── layouts/
│   │       └── app.blade.php
│   ├── css/
│   │   └── style.css
│   └── lang/
├── routes/
│   └── web.php
├── theme.json
├── composer.json
└── README.md
```

## 🛠️ Développement

```bash
# Build les assets de développement
npm run dev

# Build pour production
npm run build

# Watch les changements
npm run dev -- --watch
```

## 📝 Configuration

Le thème peut être configuré via `theme.json` :

```json
{
  "name": "Saazy",
  "description": "Thème moderne avec animations",
  "version": "1.0.0",
  "supports": {
    "color": true,
    "logo": true,
    "favicon": true
  }
}
```

## 🐛 Bugs

Pour signaler un bug ou demander une fonctionnalité :

- GitHub : https://github.com/ExilonStudios/ExilonCMS/issues
- Discord : https://discord.exiloncms.fr

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus d'informations.

## 👨‍💻 Auteur

**ExilonStudios** - https://exiloncms.fr

---

**Note** : Ce thème utilise Framer Motion pour les animations. Assurez-vous que le package est installé dans votre projet.
