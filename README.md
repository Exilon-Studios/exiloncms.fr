# ExilonCMS

<div align="center">

**Un CMS moderne et extensible pour les communautés et les entreprises**

[![Dernière Release](https://img.shields.io/github/v/release/Exilon-Studios/exiloncms.fr)](https://github.com/Exilon-Studios/exiloncms.fr/releases)
[![Licence](https://img.shields.io/github/license/Exilon-Studios/exiloncms.fr)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)

Un puissant système de gestion de contenu moderne conçu pour les communautés, les entreprises et les créateurs. Avec une architecture de plugins extensible, des thèmes dynamiques et une API conviviale pour les développeurs.

[🇬🇧 **English**](README_EN.md) | **🇫🇷 Français**

</div>

---

## ✨ Fonctionnalités

- 🎨 **Système de Thèmes Dynamiques** - Les overrides de pages thèmes permettent une personnalisation complète
- 🔌 **Architecture de Plugins Extensible** - Ajoutez des fonctionnalités avec des plugins modulaires
- 🚀 **Stack Moderne** - Laravel 12, React 19, Inertia.js v2, TypeScript, Tailwind CSS v3.4
- 🎯 **Convivial pour les Développeurs** - API claire, outils CLI et documentation complète
- 🌍 **Support Multi-langues** - Système de traduction intégré
- 🔐 **Contrôle d'Accès par Rôles** - Permissions granulaires et gestion des utilisateurs
- 🔄 **Mises à Jour Automatiques** - Mises à jour transparentes depuis GitHub avec sauvegardes automatiques
- 📦 **Marketplace d'Extensions** - Parcourez et installez des extensions depuis [exiloncms.fr/marketplace](https://exiloncms.fr/marketplace)
- 📱 **Design Responsive** - Interface mobile-first belle et fonctionnelle

### Cas d'Utilisation

ExilonCMS est conçu pour :
- **Communautés** - Serveurs de jeu, forums, plateformes sociales
- **Entreprises** - Sites d'entreprise, portfolios, vitrines de produits
- **E-commerce** - Boutiques en ligne avec passerelles de paiement intégrées
- **Créateurs de Contenu** - Blogs, sites d'actualités, plateformes de documentation
- **Organisations** - Associations à but non lucratif, établissements d'enseignement, clubs

---

## 📋 Prérequis

- **PHP** : 8.2 ou supérieur
- **Base de données** : SQLite 3.8+ (inclus), PostgreSQL 10+, ou MySQL 8+
- **Serveur Web** : Apache, Nginx, ou Laravel Valet
- **Extensions** : curl, fileinfo, json, mbstring, openssl, pdo, zip, bcmath

---

## 🚀 Installation

### Option 1 : Installateur Web Autonome (Recommandé)

Le moyen le plus simple d'installer ExilonCMS avec une interface web interactive :

```bash
# Télécharger l'installateur
wget https://github.com/Exilon-Studios/exiloncms.fr/releases/latest/download/exiloncms-installer.zip

# Extraire
unzip exiloncms-installer.zip

# Démarrer le serveur PHP
php -S localhost:8000

# Ouvrir http://localhost:8000 dans le navigateur
# L'installateur va :
# ✅ Télécharger automatiquement la dernière version du CMS
# ✅ Vous guider dans la configuration de la base de données
# ✅ Créer votre compte administrateur
# ✅ Configurer les paramètres de votre site
```

### Option 2 : Installation Manuelle

Téléchargez le package complet du CMS et configurez-le manuellement :

```bash
# Télécharger depuis les Releases GitHub
wget https://github.com/Exilon-Studios/exiloncms.fr/releases/latest/download/exiloncms.zip

# Extraire
unzip exiloncms.zip
cd exiloncms

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Éditer .env et configurer la base de données (SQLite par défaut)
# DB_DATABASE=database/database.sqlite

# Exécuter les migrations
php artisan migrate --seed

# Créer l'utilisateur admin
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"

# Démarrer le serveur de développement
php artisan serve
```

Visitez `http://localhost:8000` pour accéder à votre site.

### Installation Docker

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Configurer la base de données dans .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=exiloncms
# DB_USERNAME=exiloncms
# DB_PASSWORD=secret

# Installer et lancer
composer install
npm install
npm run build
php artisan migrate --seed
php artisan key:generate
php artisan serve
```

---

## 🎯 Développement

```bash
# Démarrer tous les services (Laravel + Queue + Vite)
composer dev

# Windows (sans logs)
composer dev-windows

# Ou individuellement :
php artisan serve      # Backend Laravel
npm run dev            # Frontend Vite (avec HMR)
```

```bash
# Exécuter les tests
composer test

# Formatage du code (requis avant commit)
./vendor/bin/pint

# Vider le cache
php artisan optimize:clear

# Vérification des types TypeScript
npm run typecheck
```

---

## 📦 Extensibilité

### Système de Plugins

ExilonCMS est fourni avec plusieurs plugins intégrés :

- **Analytics** - Analytics du site et suivi des statistiques
- **Blog** - Actualités, articles et système de blog
- **Documentation** - Système de documentation avec catégories
- **Legal** - Pages légales (politique de confidentialité, conditions d'utilisation)
- **Notifications** - Système de notifications utilisateurs
- **Pages** - Gestion des pages personnalisées
- **Releases** - Notes de version et changelogs
- **Shop** - E-commerce avec support des passerelles de paiement
- **Translations** - Interface de gestion des traductions
- **Votes** - Système de vote et sondages

```bash
# Gestion des plugins
php artisan plugin:list
php artisan plugin:install <plugin>
php artisan plugin:uninstall <plugin>
```

### Créer des Plugins

```bash
# Créer un nouveau plugin
php artisan make:plugin MonPlugin

# Structure d'un plugin :
plugins/
└── mon-plugin/
    ├── plugin.json              # Métadonnées du plugin
    ├── composer.json            # Dépendances
    ├── src/
    │   └── MonPlugin.php        # Classe principale
    ├── routes/
    │   ├── web.php              # Routes publiques
    │   └── admin.php            # Routes admin
    ├── database/
    │   └── migrations/          # Migrations du plugin
    └── resources/
        └── js/
            └── pages/           # Pages React
```

### Système de Thèmes

ExilonCMS dispose d'un puissant système d'override de thèmes :

```bash
# Créer un nouveau thème
php artisan theme:create MonTheme

# Structure d'un thème :
themes/
└── mon-theme/
    ├── theme.json              # Métadonnées du thème
    ├── resources/
    │   ├── css/                # Styles du thème
    │   ├── js/
    │   │   └── pages/          # Overrides de pages du thème
    │   │       ├── Home.tsx    # Override la page d'accueil
    │   │       ├── Shop.tsx    # Override la page boutique
    │   │       └── Blog.tsx    # Override la page blog
    │   └── views/              # Templates Blade (optionnel)
    └── assets/                 # Assets du thème
```

**Priorité d'Override des Pages :**
1. Page du thème actif (si existe)
2. Page du plugin (si la route appartient à un plugin)
3. Page du CMS core (fallback)

Cela signifie que vous pouvez override N'IMPORTE QUELLE page (core, plugin, ou admin) en créant un fichier correspondant dans le dossier `resources/js/pages/` de votre thème.

---

## 🔄 Mises à Jour

ExilonCMS supporte les mises à jour automatiques via GitHub :

1. Allez sur `/admin/updates` dans votre panneau admin
2. Vérifiez les mises à jour disponibles
3. Téléchargez la mise à jour (sauvegarde automatique créée)
4. Installez et appliquez

Ou manuellement :

```bash
git pull origin main
composer install
npm run build
php artisan migrate --force
php artisan optimize:clear
```

---

## 📚 Documentation

La documentation complète est disponible sur : [https://exiloncms.fr/docs](https://exiloncms.fr/docs)

### Zones de Documentation

- **Premiers Pas** - Installation et configuration de base
- **Développement de Plugins** - Créer des plugins personnalisés
- **Développement de Thèmes** - Créer des thèmes personnalisés
- **Référence API** - API REST et hooks
- **Configuration** - Paramètres système et options

---

## 🛠️ Stack Technique

### Backend
- **Framework** : Laravel 12
- **Langage** : PHP 8.2+
- **Base de données** : SQLite / PostgreSQL / MySQL
- **Architecture** : Orientée services avec injection de dépendances

### Frontend
- **Framework** : React 19
- **Langage** : TypeScript (mode strict)
- **Routing** : Inertia.js v2 (SPA sans API)
- **Styling** : Tailwind CSS v3.4
- **UI Components** : shadcn/ui (primitives Radix UI)
- **Rich Text** : Éditeur Tiptap
- **Forms** : React Hook Form + validation Zod
- **Build Tool** : Vite 7

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Nous acceptons les contributions pour :
- Corrections de bugs et améliorations
- Nouveaux plugins et thèmes
- Améliorations de la documentation
- Optimisations de performance

1. Fork le repository
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Style de Code

- Exécutez `./vendor/bin/pint` avant de commit (requis dans la CI)
- Suivez les standards de codage PSR-12
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire

---

## 🌐 Communauté

- **Site Web** : [https://exiloncms.fr](https://exiloncms.fr)
- **Documentation** : [https://exiloncms.fr/docs](https://exiloncms.fr/docs)
- **Marketplace** : [https://exiloncms.fr/marketplace](https://exiloncms.fr/marketplace)
- **GitHub Issues** : [Rapports de bugs et demandes de fonctionnalités](https://github.com/Exilon-Studios/exiloncms.fr/issues)
- **Discussions** : [Discussions communautaires](https://github.com/Exilon-Studios/exiloncms.fr/discussions)

---

## 📄 Licence

ExilonCMS est un logiciel open-source sous licence [GPL-3.0-or-later](LICENSE).

Cela signifie :
- ✅ Gratuit à utiliser pour des projets personnels et commerciaux
- ✅ Gratuit à modifier et étendre
- ✅ Gratuit à distribuer (avec code source)
- ❌ Ne peut pas fermer le code source de travaux dérivés

Voir [LICENSE](LICENSE) pour le texte complet.

---

## 🙏 Remerciements

Inspiré par :
- [Laravel](https://laravel.com) - The PHP Framework For Web Artisans
- [React](https://react.dev) - The library for web and native user interfaces
- [Inertia.js](https://inertiajs.com) - Build single-page apps without building an API
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Azuriom](https://azuriom.com) - Inspiration pour le CMS de serveurs de jeu
- [Paymenter](https://paymenter.org) - Inspiration pour la plateforme de facturation

---

<div align="center">

**Développé avec ❤️ par Exilon Studios**

[Site Web](https://exiloncms.fr) • [Documentation](https://exiloncms.fr/docs) • [Marketplace](https://exiloncms.fr/marketplace)

</div>
