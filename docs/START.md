# 🚀 MC-CMS V2 - Démarrage Rapide

## ✅ Ce qui est COMPLET

- ✅ **Authentification complète** (Login, Register, 2FA)
- ✅ **Admin Panel** avec sidebar collapsible
- ✅ **Dashboard** avec stats en temps réel
- ✅ **Gestion Users** (Index, Create, Edit, Delete)
- ✅ **Gestion Roles** (Index avec permissions)
- ✅ **Settings** (Configuration site)
- ✅ **Design moderne** avec gradients + animations
- ✅ **Build optimisé**: 399 KB JS + 58 KB CSS

---

## 📋 Prérequis

1. **PostgreSQL** installé (via Docker ou natif)
2. **PHP 8.2+** avec extensions: pdo_pgsql, mbstring, gd, etc.
3. **Composer** pour dépendances PHP
4. **Node.js 18+** et npm pour le frontend

---

## 🎯 ÉTAPE 1: Base de données PostgreSQL

### Option A: Utiliser le conteneur Docker existant

```bash
# Le conteneur mccms_v2_db devrait déjà tourner
docker ps | grep mccms_v2_db

# Si non, le créer:
docker run -d --name mccms_v2_db \
  -e POSTGRES_USER=mccms \
  -e POSTGRES_PASSWORD=mccms_secret_password \
  -e POSTGRES_DB=mccms_v2 \
  -p 5432:5432 \
  postgres:16-alpine

# Vérifier que la DB existe
docker exec -it mccms_v2_db psql -U mccms -d mccms_v2 -c "\dt"
```

### Option B: PostgreSQL natif

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE mccms_v2;
CREATE USER mccms WITH PASSWORD 'mccms_secret_password';
GRANT ALL PRIVILEGES ON DATABASE mccms_v2 TO mccms;
\q
```

---

## 🎯 ÉTAPE 2: Configuration Laravel

```bash
# Aller dans le bon répertoire!
cd C:/Users/uranium/Documents/Projets/Minecraft/Outland/outland-cms-v2

# Vérifier que .env est configuré pour PostgreSQL
cat .env | grep DB_

# Devrait afficher:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=mccms_v2
# DB_USERNAME=mccms
# DB_PASSWORD=mccms_secret_password

# Lancer les migrations
php artisan migrate:fresh

# Créer un admin
php artisan mccms:user
# Choisir: Admin
# Username: admin
# Email: admin@example.com
# Password: (votre choix)
```

---

## 🎯 ÉTAPE 3: Démarrer les serveurs

### Terminal 1 - Laravel (Backend)

```bash
cd C:/Users/uranium/Documents/Projets/Minecraft/Outland/outland-cms-v2
php artisan serve --port=8002
```

**Devrait afficher:**
```
INFO  Server running on [http://127.0.0.1:8002]
```

### Terminal 2 - Vite (Frontend HMR)

```bash
cd C:/Users/uranium/Documents/Projets/Minecraft/Outland/outland-cms-v2
npm run dev
```

**Devrait afficher:**
```
VITE v7.3.0  ready in 345 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## 🌐 ÉTAPE 4: Accéder au site

**URL à visiter:** `http://localhost:8002`

### Pages disponibles:

| URL | Description |
|-----|-------------|
| `http://localhost:8002/login` | Page de connexion |
| `http://localhost:8002/register` | Inscription |
| `http://localhost:8002/admin` | Dashboard admin |
| `http://localhost:8002/admin/users` | Gestion users |
| `http://localhost:8002/admin/users/create` | Créer user |
| `http://localhost:8002/admin/roles` | Gestion rôles |
| `http://localhost:8002/admin/settings` | Paramètres |

---

## ❌ ERREURS COURANTES

### Erreur: "Maximum execution time of 30 seconds exceeded"

**Cause:** Tu lances le serveur dans le mauvais dossier (outland-site au lieu de outland-cms-v2)

**Solution:**
```bash
# Arrêter le serveur (Ctrl+C)
# Aller dans le BON dossier:
cd C:/Users/uranium/Documents/Projets/Minecraft/Outland/outland-cms-v2
php artisan serve --port=8002
```

### Erreur: "Connection refused" ou "SQLSTATE[08006]"

**Cause:** PostgreSQL n'est pas démarré

**Solution:**
```bash
# Vérifier le conteneur
docker ps | grep mccms_v2_db

# Le démarrer si nécessaire
docker start mccms_v2_db
```

### Erreur: "Class 'Inertia' not found"

**Cause:** Dépendances Composer manquantes

**Solution:**
```bash
composer install
```

### Erreur: Build Vite échoue

**Cause:** Dépendances npm manquantes

**Solution:**
```bash
npm install
npm run build
```

---

## 🔄 Build Production

Pour déployer en production:

```bash
# Build optimisé
npm run build

# Les fichiers sont générés dans public/build/

# Configuration serveur web (Nginx/Apache):
# Pointer vers public/ comme document root
# Les assets sont servis depuis public/build/
```

---

## 📊 Statistiques du build

```
✓ 8854 modules transformed
✓ 28 chunks generated
✓ 399.08 KB JS (131.42 KB gzipped)
✓ 58.85 KB CSS (11.80 KB gzipped)
✓ Built in 20.50s
```

---

## 🎨 Fonctionnalités V2

### Authentification
- ✅ Login avec email ou username
- ✅ Register avec validation stricte
- ✅ Two-Factor Authentication (2FA)
- ✅ Remember me
- ✅ Email verification

### Admin Panel
- ✅ Dashboard avec stats temps réel
- ✅ Graphiques users (jour/mois)
- ✅ Active users tracking
- ✅ Alerts (HTTPS, updates)

### Gestion Users
- ✅ Liste paginée (20 par page)
- ✅ Search par nom/email
- ✅ Création utilisateur
- ✅ Édition complète
- ✅ Gestion rôles
- ✅ Gestion money
- ✅ Ban system
- ✅ 2FA disable
- ✅ Email verification
- ✅ Activity logs

### Gestion Rôles
- ✅ Liste tous les rôles
- ✅ Affichage permissions
- ✅ Couleurs personnalisées
- ✅ Power levels

### Settings
- ✅ Site name/description
- ✅ Currency name
- ✅ Locale/timezone
- ✅ Copyright
- ✅ User money transfer

### Design
- ✅ Sidebar collapsible avec animations
- ✅ Dark mode support
- ✅ Responsive (mobile + desktop)
- ✅ Gradients modernes
- ✅ Icons Tabler
- ✅ Components shadcn/ui

---

## 📁 Structure finale

```
outland-cms-v2/
├── app/
│   └── Http/Controllers/Admin/
│       ├── AdminController.php (✅ Inertia)
│       ├── UserController.php (✅ Inertia)
│       ├── RoleController.php (✅ Inertia)
│       └── SettingsController.php (✅ Inertia)
├── resources/js/
│   ├── components/
│   │   ├── admin/Sidebar.tsx
│   │   ├── auth/AuthUI.tsx
│   │   ├── ui/ (button, card, input, label)
│   │   └── Footer.tsx
│   ├── layouts/
│   │   ├── AuthenticatedLayout.tsx
│   │   └── GuestLayout.tsx
│   └── pages/
│       ├── Admin/
│       │   ├── Dashboard.tsx ✅
│       │   ├── Users/ (Index, Create, Edit) ✅
│       │   ├── Roles/Index.tsx ✅
│       │   └── Settings/Index.tsx ✅
│       └── Auth/
│           ├── Login.tsx ✅
│           ├── Register.tsx ✅
│           └── TwoFactor.tsx ✅
├── routes/
│   ├── web.php (auth routes)
│   └── admin.php (admin routes)
└── database/
    └── migrations/ (25+ tables)
```

---

## 🚀 Prochaines étapes

1. **Créer les pages manquantes:**
   - Pages CMS (création/édition)
   - Posts/News (création/édition)
   - Images gallery
   - Servers management
   - Plugins management
   - Themes management

2. **Améliorer le Dashboard:**
   - Graphiques interactifs (Chart.js)
   - Activity feed en temps réel
   - Quick actions

3. **Ajouter des fonctionnalités:**
   - Drag & drop pour upload images
   - Rich text editor (TipTap)
   - Search global
   - Notifications temps réel

---

**🎉 Enjoy MC-CMS V2!**
