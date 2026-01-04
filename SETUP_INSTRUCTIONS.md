# Instructions de Configuration - MC-CMS V2

## 🚀 Setup Rapide

### 1. Démarrer Docker

```bash
docker-compose up -d
```

Attendez quelques secondes que PostgreSQL démarre (vérifiez avec `docker ps`).

### 2. Configuration initiale

```bash
# Installer les dépendances
composer install
npm install

# Copier le fichier .env (si ce n'est pas déjà fait)
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### 3. Base de données

```bash
# Exécuter les migrations
php artisan migrate:fresh

# Créer un utilisateur admin
php artisan user:create --admin --name="Admin" --email="admin@example.com" --password="password"

# Créer la permission Puck
php artisan db:seed --class=PuckPermissionSeeder
```

### 4. Lancer l'application

```bash
# Terminal 1 - Backend Laravel
php artisan serve --port=8002

# Terminal 2 - Frontend Vite (dans un autre terminal)
npm run dev
```

### 5. Accéder à l'application

- **Frontend** : http://localhost:8002
- **Admin** : http://localhost:8002/admin
  - Email : `admin@example.com`
  - Password : `password`
- **pgAdmin** : http://localhost:5050
  - Email : `admin@mccms.local`
  - Password : `admin`

## 🎨 Utiliser Puck Editor

1. Connectez-vous en tant qu'admin
2. Allez dans **Admin → Pages**
3. Cliquez sur le bouton **"Puck"** sur une page
4. L'éditeur s'ouvre en plein écran
5. Glissez-déposez des composants depuis la barre latérale
6. Configurez les propriétés
7. Cliquez sur **"Publish"** pour sauvegarder

## 🐳 Commandes Docker Utiles

```bash
# Voir l'état des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f postgres

# Arrêter les conteneurs
docker-compose down

# Redémarrer
docker-compose restart

# Supprimer tout (avec volumes)
docker-compose down -v
```

## 🔧 Commandes Laravel Utiles

```bash
# Créer un utilisateur
php artisan user:create --admin --name="NomUtilisateur" --email="email@example.com" --password="motdepasse"

# Vider le cache
php artisan optimize:clear

# Lancer les tests
php artisan test

# Voir les routes
php artisan route:list

# Accéder à tinker
php artisan tinker
```

## 📦 Développement Puck

### Créer un nouveau composant

Voir le guide complet : [PUCK_COMPONENT_GUIDE.md](./PUCK_COMPONENT_GUIDE.md)

Exemple rapide :

```typescript
// 1. Créer le composant
// resources/js/puck/components/MonComposant.tsx
export const MonComposant = ({ titre }: { titre: string }) => (
  <h2 className="text-foreground">{titre}</h2>
);

// 2. Ajouter à la config
// resources/js/puck/config.tsx
import { MonComposant } from "./components/MonComposant";

export const puckConfig: Config = {
  components: {
    MonComposant: {
      fields: {
        titre: { type: "text" },
      },
      defaultProps: {
        titre: "Mon titre",
      },
      render: MonComposant,
    },
  },
};
```

## 🐛 Dépannage

### PostgreSQL ne démarre pas

```bash
# Vérifier les logs
docker-compose logs postgres

# Redémarrer
docker-compose restart postgres

# Recréer le conteneur
docker-compose down
docker-compose up -d
```

### Erreur de connexion à la base

Vérifiez le `.env` :
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mccms_v2
DB_USERNAME=mccms
DB_PASSWORD=mccms_secret
```

### Erreur "puck_data not found"

```bash
php artisan migrate
```

### Permission Puck manquante

```bash
php artisan db:seed --class=PuckPermissionSeeder
```

### CSS Puck ne se charge pas

Vérifiez que `@import "@measured/puck/puck.css";` est dans `resources/css/app.css`

```bash
npm run build
```

## 📚 Documentation

- [PUCK_INTEGRATION.md](./PUCK_INTEGRATION.md) - Vue d'ensemble de l'intégration Puck
- [PUCK_COMPONENT_GUIDE.md](./PUCK_COMPONENT_GUIDE.md) - Guide développeur pour créer des composants
- [CLAUDE.md](./CLAUDE.md) - Instructions pour Claude Code

## 🆘 Support

- Documentation Puck : https://puckeditor.com/docs
- Laravel Docs : https://laravel.com/docs
- React Docs : https://react.dev
- Inertia.js : https://inertiajs.com

## 🎯 Checklist de Setup

- [ ] Docker démarré (`docker-compose up -d`)
- [ ] Dépendances installées (`composer install` + `npm install`)
- [ ] Fichier `.env` configuré
- [ ] Clé générée (`php artisan key:generate`)
- [ ] Migrations exécutées (`php artisan migrate:fresh`)
- [ ] Utilisateur admin créé (`php artisan user:create --admin`)
- [ ] Permission Puck créée (`php artisan db:seed --class=PuckPermissionSeeder`)
- [ ] Serveurs lancés (Laravel + Vite)
- [ ] Connexion réussie à l'admin
- [ ] Éditeur Puck accessible

🎉 Bon développement !
