# Guide Développeur - Création de Composants Puck

Ce guide vous aidera à créer vos propres composants pour l'éditeur Puck du CMS.

## Table des Matières

1. [Introduction](#introduction)
2. [Structure d'un Composant](#structure-dun-composant)
3. [Créer un Nouveau Composant](#créer-un-nouveau-composant)
4. [Types de Champs Disponibles](#types-de-champs-disponibles)
5. [Catégories](#catégories)
6. [Slots et Layouts](#slots-et-layouts)
7. [Permissions](#permissions)
8. [Exemples Complets](#exemples-complets)
9. [Marketplace de Composants](#marketplace-de-composants)

## Introduction

Les composants Puck sont des blocs réutilisables que les utilisateurs peuvent glisser-déposer pour construire leurs pages. Chaque composant est défini par :

- **Des champs** : Les propriétés configurables par l'utilisateur
- **Un rendu** : Comment le composant s'affiche
- **Des valeurs par défaut** : Les valeurs initiales des champs
- **Une catégorie** : Pour organiser les composants dans l'interface

## Structure d'un Composant

Un composant Puck se compose de deux parties :

### 1. Le Composant React (fichier .tsx)

```typescript
// resources/js/puck/components/MonComposant.tsx
import React from "react";

interface MonComposantProps {
  titre: string;
  description: string;
}

export const MonComposant = ({ titre, description }: MonComposantProps) => {
  return (
    <div className="mon-composant">
      <h2>{titre}</h2>
      <p>{description}</p>
    </div>
  );
};
```

### 2. La Configuration Puck (dans config.tsx)

```typescript
// resources/js/puck/config.tsx
import { MonComposant } from "./components/MonComposant";

export const puckConfig: Config = {
  components: {
    MonComposant: {
      fields: {
        titre: {
          type: "text",
          label: "Titre",
        },
        description: {
          type: "textarea",
          label: "Description",
        },
      },
      defaultProps: {
        titre: "Mon titre par défaut",
        description: "Ma description par défaut",
      },
      render: MonComposant,
    },
  },
};
```

## Créer un Nouveau Composant

### Étape 1 : Créer le Fichier Composant

Créez un nouveau fichier dans `resources/js/puck/components/` :

```bash
touch resources/js/puck/components/MaCard.tsx
```

### Étape 2 : Définir l'Interface TypeScript

```typescript
interface MaCardProps {
  titre: string;
  description: string;
  image?: string;
  lienBouton?: string;
  texteBouton?: string;
}
```

### Étape 3 : Créer le Composant

```typescript
export const MaCard = ({
  titre,
  description,
  image,
  lienBouton,
  texteBouton,
}: MaCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-4">
      {image && (
        <img
          src={image}
          alt={titre}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-2xl font-bold text-foreground mb-2">{titre}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {lienBouton && texteBouton && (
        <a
          href={lienBouton}
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {texteBouton}
        </a>
      )}
    </div>
  );
};
```

### Étape 4 : Ajouter à la Configuration

Dans `resources/js/puck/config.tsx` :

```typescript
import { MaCard } from "./components/MaCard";

// Ajouter le type
export type PuckComponents = {
  // ... autres composants
  MaCard: {
    titre: string;
    description: string;
    image?: string;
    lienBouton?: string;
    texteBouton?: string;
  };
};

// Ajouter la configuration
export const puckConfig: Config<PuckComponents, RootProps> = {
  components: {
    // ... autres composants
    MaCard: {
      fields: {
        titre: {
          type: "text",
          label: "Titre",
        },
        description: {
          type: "textarea",
          label: "Description",
        },
        image: {
          type: "text",
          label: "URL de l'image",
        },
        lienBouton: {
          type: "text",
          label: "Lien du bouton",
        },
        texteBouton: {
          type: "text",
          label: "Texte du bouton",
        },
      },
      defaultProps: {
        titre: "Titre de la carte",
        description: "Description de la carte",
        image: "",
        lienBouton: "",
        texteBouton: "En savoir plus",
      },
      render: MaCard,
    },
  },
};
```

### Étape 5 : Ajouter à une Catégorie

```typescript
export const puckConfig: Config = {
  categories: {
    // ... autres catégories
    cartes: {
      components: ["MaCard", "CardBlock"],
      title: "Cartes",
      defaultExpanded: true,
    },
  },
  // ...
};
```

## Types de Champs Disponibles

### 1. Text - Champ texte simple

```typescript
{
  type: "text",
  label: "Titre",
}
```

### 2. Textarea - Champ texte multiligne

```typescript
{
  type: "textarea",
  label: "Description",
}
```

### 3. Number - Champ numérique

```typescript
{
  type: "number",
  label: "Nombre de colonnes",
  min: 1,
  max: 12,
}
```

### 4. Select - Liste déroulante

```typescript
{
  type: "select",
  label: "Taille",
  options: [
    { label: "Petit", value: "sm" },
    { label: "Moyen", value: "md" },
    { label: "Grand", value: "lg" },
  ],
}
```

### 5. Radio - Boutons radio

```typescript
{
  type: "radio",
  label: "Alignement",
  options: [
    { label: "Gauche", value: "left" },
    { label: "Centre", value: "center" },
    { label: "Droite", value: "right" },
  ],
}
```

### 6. Slot - Zone de dépôt pour composants imbriqués

```typescript
{
  type: "slot",
  label: "Contenu",
  allow: ["HeadingBlock", "ParagraphBlock"], // Optionnel : restreindre les composants
}
```

### 7. Array - Liste d'éléments

```typescript
{
  type: "array",
  label: "Éléments",
  arrayFields: {
    titre: { type: "text" },
    description: { type: "textarea" },
  },
}
```

### 8. Object - Objet imbriqué

```typescript
{
  type: "object",
  label: "Paramètres",
  objectFields: {
    couleur: { type: "text" },
    taille: { type: "number" },
  },
}
```

## Catégories

Les catégories permettent d'organiser les composants dans l'interface :

```typescript
categories: {
  typography: {
    components: ["HeadingBlock", "ParagraphBlock"],
    title: "Typographie",
    defaultExpanded: true, // Ouverte par défaut
  },
  layout: {
    components: ["GridBlock", "ContainerBlock"],
    title: "Mise en page",
    defaultExpanded: false,
  },
}
```

## Slots et Layouts

Les slots permettent de créer des composants avec des zones de dépôt pour d'autres composants :

```typescript
// Composant avec 2 colonnes
export const DeuxColonnes = ({ gauche, droite }: DeuxColonnesProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>{typeof gauche === "function" ? <gauche /> : gauche}</div>
      <div>{typeof droite === "function" ? <droite /> : droite}</div>
    </div>
  );
};

// Configuration
{
  DeuxColonnes: {
    fields: {
      gauche: {
        type: "slot",
        label: "Colonne gauche",
      },
      droite: {
        type: "slot",
        label: "Colonne droite",
      },
    },
    render: DeuxColonnes,
  },
}
```

## Permissions

Vous pouvez contrôler les permissions pour chaque composant :

```typescript
{
  MonComposant: {
    fields: { /* ... */ },
    permissions: {
      delete: true,
      drag: true,
      duplicate: true,
    },
    render: MonComposant,
  },
}
```

## Exemples Complets

### Exemple 1 : Composant Hero Section

```typescript
// HeroSection.tsx
interface HeroSectionProps {
  titre: string;
  sousTitre: string;
  image: string;
  texteBouton: string;
  lienBouton: string;
}

export const HeroSection = ({
  titre,
  sousTitre,
  image,
  texteBouton,
  lienBouton,
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 text-center text-white">
        <h1 className="text-6xl font-bold mb-4">{titre}</h1>
        <p className="text-2xl mb-8">{sousTitre}</p>
        <a
          href={lienBouton}
          className="inline-block bg-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-primary/90"
        >
          {texteBouton}
        </a>
      </div>
    </section>
  );
};

// Configuration
{
  HeroSection: {
    fields: {
      titre: { type: "text", label: "Titre principal" },
      sousTitre: { type: "text", label: "Sous-titre" },
      image: { type: "text", label: "Image de fond (URL)" },
      texteBouton: { type: "text", label: "Texte du bouton" },
      lienBouton: { type: "text", label: "Lien du bouton" },
    },
    defaultProps: {
      titre: "Bienvenue",
      sousTitre: "Découvrez notre univers",
      image: "/images/hero.jpg",
      texteBouton: "En savoir plus",
      lienBouton: "#",
    },
    render: HeroSection,
  },
}
```

### Exemple 2 : Grille de Cartes

```typescript
// GrilleCartes.tsx
interface GrilleCartesProps {
  colonnes: number;
  ecart: number;
  contenu: React.ReactNode;
}

export const GrilleCartes = ({
  colonnes,
  ecart,
  contenu: Contenu,
}: GrilleCartesProps) => {
  return (
    <div
      className="grid mb-8"
      style={{
        gridTemplateColumns: `repeat(${colonnes}, 1fr)`,
        gap: `${ecart}px`,
      }}
    >
      {typeof Contenu === "function" ? <Contenu /> : Contenu}
    </div>
  );
};

// Configuration
{
  GrilleCartes: {
    fields: {
      colonnes: {
        type: "select",
        label: "Nombre de colonnes",
        options: [
          { label: "2 colonnes", value: 2 },
          { label: "3 colonnes", value: 3 },
          { label: "4 colonnes", value: 4 },
        ],
      },
      ecart: {
        type: "number",
        label: "Écart entre les cartes (px)",
        min: 0,
        max: 100,
      },
      contenu: {
        type: "slot",
        label: "Contenu",
        allow: ["CardBlock", "MaCard"],
      },
    },
    defaultProps: {
      colonnes: 3,
      ecart: 16,
      contenu: [],
    },
    render: GrilleCartes,
  },
}
```

## Marketplace de Composants

### Structure d'un Package de Composant

Un composant marketplace doit être structuré ainsi :

```
mon-composant-puck/
├── package.json
├── README.md
├── src/
│   ├── index.ts
│   ├── Component.tsx
│   └── config.ts
└── dist/
    └── index.js
```

### Créer un Package

1. **package.json** :

```json
{
  "name": "@mccms/puck-component-hero",
  "version": "1.0.0",
  "description": "Composant Hero pour Puck Editor",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "@measured/puck": "^0.16.0"
  },
  "keywords": ["puck", "component", "mccms", "hero"],
  "author": "Votre Nom",
  "license": "MIT"
}
```

2. **src/index.ts** :

```typescript
export { HeroComponent } from "./Component";
export { heroConfig } from "./config";
```

3. **Installation** :

Pour installer un composant depuis la marketplace :

```bash
npm install @mccms/puck-component-hero
```

4. **Utilisation** :

```typescript
// resources/js/puck/config.tsx
import { heroConfig } from "@mccms/puck-component-hero";

export const puckConfig: Config = {
  components: {
    ...heroConfig.components,
    // Vos autres composants
  },
};
```

## Bonnes Pratiques

1. **Utilisez les Design Tokens** : Utilisez toujours `bg-primary`, `text-foreground`, etc. au lieu de couleurs hardcodées
2. **Responsive** : Assurez-vous que vos composants sont responsive avec les classes Tailwind (`sm:`, `md:`, `lg:`)
3. **Accessibilité** : Utilisez des balises sémantiques HTML (`<header>`, `<nav>`, `<main>`, etc.)
4. **TypeScript** : Définissez toujours des interfaces TypeScript pour vos props
5. **Documentation** : Documentez chaque composant avec des commentaires clairs
6. **Valeurs par Défaut** : Fournissez toujours des valeurs par défaut sensées

## Ressources

- [Documentation Puck officielle](https://puckeditor.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React TypeScript](https://react-typescript-cheatsheet.netlify.app)

## Support

Pour toute question ou problème, consultez :
- La documentation du projet
- Les issues GitHub
- Le canal Discord de la communauté
