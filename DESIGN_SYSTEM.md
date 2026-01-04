# Design System - MC-CMS V2

## 🎨 Palette de Couleurs

### Couleurs Principales

#### Primary (Orange) - Actions Principales
```css
--primary: 21.7450 65.6388% 55.4902%;           /* #E87743 */
--primary-foreground: 0 0% 100%;                 /* Blanc sur primary */
```
**Utilisation:** Boutons primaires, liens, éléments interactifs importants

#### Secondary (Teal) - Actions Secondaires
```css
--secondary: 180 17.5879% 39.0196%;             /* #517C79 */
--secondary-foreground: 0 0% 100%;               /* Blanc sur secondary */
```
**Utilisation:** Boutons secondaires, badges, états secondaires

### Couleurs de Fond

#### Background & Foreground
```css
--background: 0 0% 100%;                         /* Blanc pur */
--foreground: 220.9091 39.2857% 10.9804%;        /* Gris foncé */
```

#### Card
```css
--card: 0 0% 100%;                               /* Blanc */
--card-foreground: 220.9091 39.2857% 10.9804%;   /* Gris foncé */
```

#### Popover
```css
--popover: 0 0% 100%;                            /* Blanc */
--popover-foreground: 220.9091 39.2857% 10.9804%; /* Gris foncé */
```

### Couleurs Fonctionnelles

#### Muted (Éléments désactivés)
```css
--muted: 220.0000 14.2857% 95.8824%;            /* Gris très clair */
--muted-foreground: 220 8.9362% 46.0784%;        /* Gris moyen */
```

#### Accent (Highlights)
```css
--accent: 0 0% 93.3333%;                         /* Gris ultra clair */
--accent-foreground: 220.9091 39.2857% 10.9804%; /* Gris foncé */
```

#### Destructive (Erreurs, Suppressions)
```css
--destructive: 0 84.2365% 60.1961%;              /* Rouge */
--destructive-foreground: 0 0% 98.0392%;         /* Blanc cassé */
```

### Bordures & Inputs

```css
--border: 220 13.0435% 90.9804%;                 /* Gris clair */
--input: 220 13.0435% 90.9804%;                  /* Même que border */
--ring: 21.7450 65.6388% 55.4902%;               /* Primary pour focus */
```

### Charts

```css
--chart-1: 180 17.3913% 45.0980%;                /* Teal */
--chart-2: 22.2973 75.5102% 61.5686%;            /* Orange vif */
--chart-3: 31.2000 92.5926% 78.8235%;            /* Orange pastel */
--chart-4: 0 0% 53.3333%;                        /* Gris */
--chart-5: 0 0% 60%;                             /* Gris clair */
```

## 🌙 Dark Mode

### Couleurs Dark Mode

```css
.dark {
  --background: 270 5.5556% 7.0588%;              /* Presque noir */
  --foreground: 0 0% 75.6863%;                    /* Gris clair */
  --card: 0 0% 7.0588%;                           /* Presque noir */
  --primary: 22.2973 75.5102% 61.5686%;           /* Orange vif */
  --secondary: 180 17.3913% 45.0980%;             /* Teal */
  --muted: 0 0% 13.3333%;                         /* Gris très foncé */
  --accent: 0 0% 20%;                             /* Gris foncé */
  --destructive: 180 17.3913% 45.0980%;           /* Teal pour dark */
  --border: 0 0% 13.3333%;                        /* Gris très foncé */
}
```

## 📐 Border Radius

```css
--radius: 0.75rem;  /* 12px - Base */
```

**Variantes:**
```css
rounded-sm  = calc(var(--radius) - 4px)  /* 8px */
rounded-md  = calc(var(--radius) - 2px)  /* 10px */
rounded-lg  = var(--radius)              /* 12px */
rounded-xl  = calc(var(--radius) + 4px)  /* 16px */
```

## 🔤 Typographie

```css
--font-sans: Geist Mono, ui-monospace, monospace;
--font-serif: serif;
--font-mono: JetBrains Mono, monospace;
```

## 🎯 Utilisation des Classes Tailwind

### ✅ CORRECT - Utiliser les Design Tokens

```tsx
// Boutons
<Button className="bg-primary text-primary-foreground">Cliquez-moi</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="destructive">Supprimer</Button>

// Cartes
<div className="bg-card text-card-foreground border border-border rounded-lg">
  <h2 className="text-foreground">Titre</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// Tables
<TableRow className="hover:bg-muted/50 border-b border-border">
  <TableCell className="text-foreground">Données</TableCell>
</TableRow>

// Inputs
<Input className="border-input bg-background text-foreground" />

// Badges
<Badge variant="secondary">Status</Badge>
<Badge className="bg-primary text-primary-foreground">Important</Badge>
```

### ❌ INCORRECT - Couleurs Hardcodées

```tsx
// NE PAS FAIRE
<button className="bg-blue-500 text-white">...</button>
<div className="bg-gray-100 text-gray-900">...</div>
<span className="text-red-500">...</span>
<div className="border-gray-200">...</div>
```

## 🧩 Composants shadcn/ui

### Composants Disponibles

- ✅ `Button` - Tous les variants utilisent les design tokens
- ✅ `Card` - Couleurs de fond et bordures
- ✅ `Input` - Bordures et focus
- ✅ `Table` - Hover et bordures
- ✅ `Badge` - Variants primary, secondary, destructive
- ✅ `Avatar` - Fallback avec primary
- ✅ `DropdownMenu` - Hover avec accent
- ✅ `AlertDialog` - Couleurs destructive
- ✅ `Separator` - Bordure
- ✅ `Label` - Foreground
- ✅ `Checkbox` - Primary
- ✅ `Switch` - Primary
- ✅ `Tabs` - Accent et muted
- ✅ `Textarea` - Border et focus

### DataTable (TanStack Table)

```tsx
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

<DataTable
  columns={columns}
  data={users}
  searchKey="name"
  searchPlaceholder="Rechercher un utilisateur..."
/>
```

## 🎨 Exemples d'Harmonie

### Page Admin avec Harmonie

```tsx
<div className="bg-background min-h-screen">
  {/* Header */}
  <header className="border-b border-border bg-card">
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">Bienvenue</p>
    </div>
  </header>

  {/* Content */}
  <main className="p-6 space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-3 gap-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Utilisateurs</CardTitle>
          <CardDescription className="text-muted-foreground">
            Total d'utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">1,234</div>
        </CardContent>
      </Card>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2">
      <Button variant="default">
        <UserPlus className="mr-2 h-4 w-4" />
        Ajouter
      </Button>
      <Button variant="secondary">
        <RefreshCw className="mr-2 h-4 w-4" />
        Actualiser
      </Button>
      <Button variant="outline">
        <Settings className="mr-2 h-4 w-4" />
        Paramètres
      </Button>
    </div>

    {/* Data Table */}
    <Card className="border-border">
      <DataTable columns={columns} data={data} searchKey="name" />
    </Card>
  </main>
</div>
```

## 📋 Checklist de Migration

Lors de la création/modification d'un composant :

- [ ] Remplacer `bg-white` par `bg-background` ou `bg-card`
- [ ] Remplacer `text-black` par `text-foreground`
- [ ] Remplacer `text-gray-*` par `text-muted-foreground`
- [ ] Remplacer `bg-gray-*` par `bg-muted` ou `bg-accent`
- [ ] Remplacer `border-gray-*` par `border-border`
- [ ] Remplacer `bg-blue-*` par `bg-primary`
- [ ] Remplacer `bg-red-*` par `bg-destructive`
- [ ] Utiliser `hover:bg-accent` au lieu de `hover:bg-gray-*`
- [ ] Utiliser les composants shadcn/ui quand disponibles
- [ ] Utiliser TanStack Table pour les tableaux

## 🚀 Avantages du Design System

1. **Cohérence visuelle** - Toutes les pages utilisent la même palette
2. **Dark mode automatique** - Un seul toggle pour tout le site
3. **Maintenance facile** - Changer une couleur = changement global
4. **Accessibilité** - Contraste calculé automatiquement
5. **Performance** - Classes réutilisables
6. **Évolutivité** - Facile d'ajouter de nouvelles variantes

---

**Version**: 1.0.0
**Dernière mise à jour**: 2026-01-01
