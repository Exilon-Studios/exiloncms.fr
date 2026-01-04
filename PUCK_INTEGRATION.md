# Intégration Puck Editor - MC-CMS V2

## 📋 Vue d'ensemble

Puck Editor est maintenant complètement intégré dans MC-CMS V2, permettant une édition visuelle drag-and-drop des pages publiques et personnalisées.

## ✨ Fonctionnalités

### 1. **Éditeur Visuel Drag-and-Drop**
- Interface intuitive de type page builder
- Aperçu en temps réel des modifications
- Système d'annulation/rétablissement (undo/redo)
- Support responsive avec différents viewports (mobile, tablet, desktop)

### 2. **Bibliothèque de Composants**
6 composants de base prêts à l'emploi :
- **HeadingBlock** - Titres H1-H6 avec alignement
- **ParagraphBlock** - Paragraphes avec alignement
- **ButtonBlock** - Boutons avec tous les variants shadcn/ui
- **ImageBlock** - Images responsives
- **CardBlock** - Cartes avec image, titre et description
- **GridBlock** - Grilles multi-colonnes avec slots

### 3. **Système de Catégories**
Les composants sont organisés en catégories :
- Typographie (Heading, Paragraph)
- Interactif (Button)
- Média (Image)
- Mise en page (Grid, Card)

### 4. **Marketplace de Composants**
- Interface de marketplace avec recherche et filtres
- 8+ composants prêts à installer en un clic
- Système de catégorisation et tags
- Support pour les packages npm

### 5. **Permissions**
- Permission `admin.pages.puck-edit` pour contrôler l'accès
- Assignable à n'importe quel rôle
- Par défaut assignée au rôle Admin

## 📂 Structure des Fichiers

```
resources/js/
├── puck/
│   ├── config.tsx              # Configuration principale Puck
│   ├── components/             # Composants Puck
│   │   ├── HeadingBlock.tsx
│   │   ├── ParagraphBlock.tsx
│   │   ├── ButtonBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── CardBlock.tsx
│   │   └── GridBlock.tsx
│   └── marketplace/
│       └── index.ts            # Marketplace de composants
├── pages/
│   ├── Admin/
│   │   ├── Pages/
│   │   │   ├── PuckEditor.tsx  # Éditeur Puck full-screen
│   │   │   └── Index.tsx       # Liste avec bouton Puck
│   │   └── Puck/
│   │       └── Marketplace.tsx # Interface marketplace
│   └── PuckPage.tsx            # Rendu public des pages Puck
└── ...

app/
├── Models/
│   └── Page.php                # Modèle avec puck_data et use_puck
├── Http/
│   └── Controllers/
│       └── Admin/
│           └── PageController.php  # Méthode puckEditor()
└── ...

database/
├── migrations/
│   └── *_add_puck_data_to_pages_table.php
└── seeders/
    └── PuckPermissionSeeder.php

routes/
└── admin.php                   # Route vers Puck editor
```

## 🚀 Utilisation

### Pour les Éditeurs

1. **Accéder à l'éditeur Puck** :
   - Aller dans Admin → Pages
   - Cliquer sur le bouton "Puck" sur une page
   - L'éditeur s'ouvre en plein écran

2. **Créer du contenu** :
   - Glisser-déposer des composants depuis la barre latérale
   - Configurer les propriétés dans le panneau de droite
   - Prévisualiser sur différents appareils
   - Cliquer sur "Publish" pour sauvegarder

3. **Organiser le contenu** :
   - Réorganiser par drag-and-drop
   - Dupliquer des composants
   - Supprimer des éléments
   - Grouper avec GridBlock

### Pour les Développeurs

#### Créer un Nouveau Composant

Voir le guide complet dans `PUCK_COMPONENT_GUIDE.md`

**Exemple rapide** :

```typescript
// 1. Créer le composant React
// resources/js/puck/components/AlertBlock.tsx
export const AlertBlock = ({ message, variant }) => (
  <div className={`alert alert-${variant}`}>
    {message}
  </div>
);

// 2. Ajouter à la config
// resources/js/puck/config.tsx
export const puckConfig: Config = {
  components: {
    AlertBlock: {
      fields: {
        message: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Info", value: "info" },
            { label: "Warning", value: "warning" },
          ],
        },
      },
      defaultProps: {
        message: "Message d'alerte",
        variant: "info",
      },
      render: AlertBlock,
    },
  },
};
```

#### Installer un Composant de la Marketplace

```bash
# Installer le package npm
npm install @mccms/puck-hero-advanced

# Importer dans config.tsx
import { heroConfig } from "@mccms/puck-hero-advanced";

export const puckConfig: Config = {
  components: {
    ...heroConfig.components,
    // Vos composants existants
  },
};
```

## 🔧 Configuration

### Base de Données

La table `pages` a été étendue avec :
- `puck_data` (JSON) : Données Puck de la page
- `use_puck` (boolean) : Indique si la page utilise Puck

### Routes

```php
// routes/admin.php
Route::get('pages/{page}/puck-editor', [PageController::class, 'puckEditor'])
  ->name('pages.puck-editor')
  ->middleware('can:admin.pages.puck-edit');
```

### Permissions

```bash
# Exécuter le seeder pour créer la permission
php artisan db:seed --class=PuckPermissionSeeder
```

## 🎨 Design Tokens

Tous les composants utilisent les design tokens du CMS :
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-card`, `text-foreground`
- `border-border`, `bg-muted`

Cela garantit une cohérence avec le thème du site.

## 📦 Composants Marketplace

### Disponibles

1. **Hero Section Avancée** - Hero avec parallax et vidéo
2. **Tableau de Prix** - Comparaison de plans/tarifs
3. **Carrousel de Témoignages** - Avis clients automatique
4. **FAQ Accordéon** - Questions-réponses animées
5. **Grille d'Équipe** - Présentation des membres
6. **Formulaire de Contact** - Contact avec validation
7. **Compteurs de Stats** - Statistiques animées
8. **Timeline** - Historique ou roadmap

### Installation

Actuellement en mode "preview" - l'installation en un clic sera implémentée prochainement.

## 🔐 Sécurité

- Permission `admin.pages.puck-edit` requise
- Validation côté serveur des données Puck
- Sanitization du contenu HTML
- Protection CSRF via Laravel

## 🐛 Dépannage

### Le CSS de Puck ne se charge pas
Vérifiez que `@import "@measured/puck/puck.css";` est présent dans `resources/css/app.css`

### Les composants ne s'affichent pas
1. Vérifiez que tous les composants sont importés dans `config.tsx`
2. Vérifiez les types TypeScript
3. Vérifiez la console pour les erreurs

### Erreur "puck_data not found"
Exécutez la migration : `php artisan migrate`

### Permission denied
Exécutez : `php artisan db:seed --class=PuckPermissionSeeder`

## 📚 Ressources

- [Documentation Puck officielle](https://puckeditor.com/docs)
- [Guide Développeur](./PUCK_COMPONENT_GUIDE.md)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🚧 Prochaines Étapes

- [ ] Implémenter l'installation réelle des composants marketplace
- [ ] Ajouter plus de composants de base (Video, Tabs, Accordion, etc.)
- [ ] Créer des templates de pages pré-configurées
- [ ] Ajouter un système de versioning des pages
- [ ] Support pour les pages multilingues
- [ ] Import/Export de configurations Puck

## 🤝 Contribution

Pour contribuer de nouveaux composants :
1. Suivez le guide dans `PUCK_COMPONENT_GUIDE.md`
2. Respectez les design tokens
3. Ajoutez des tests si possible
4. Documentez les props et leur utilisation

## 📄 Licence

Cette intégration fait partie de MC-CMS V2 et suit la même licence.
