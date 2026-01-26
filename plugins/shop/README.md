# Shop Plugin

Système de boutique pour ExilonCMS - Permet aux utilisateurs d'acheter des items avec leur monnaie virtuelle.

## Installation

Le plugin est déjà inclus dans le CMS. Pour l'activer :

1. Exécutez les migrations :
```bash
php artisan migrate
```

2. Videz le cache :
```bash
php artisan cache:clear
php artisan config:clear
```

## Fonctionnalités

- **Catégories** : Organisez vos items en catégories
- **Panier** : Système de panier persistant
- **Commandes** : Suivi des commandes des utilisateurs
- **Stock** : Gestion des stocks (illimité ou limité)
- **Paiement** : Intégration avec la monnaie virtuelle du CMS

## Structure

```
plugins/shop/
├── plugin.json              # Métadonnées du plugin
├── src/Providers/           # Service Provider
├── routes/                  # Routes du plugin
├── resources/
│   ├── lang/               # Traductions
│   └── js/pages/           # Pages React (à créer)
└── database/migrations/     # Migrations de base de données
```

## API

Le plugin expose les routes suivantes :

- `GET /shop` - Liste des items
- `GET /shop/category/{category}` - Items par catégorie
- `GET /shop/item/{item}` - Détail d'un item
- `GET /shop/cart` - Panier de l'utilisateur
- `POST /shop/cart/add/{item}` - Ajouter au panier
- `POST /shop/cart/remove/{itemId}` - Retirer du panier
- `POST /shop/cart/clear` - Vider le panier
- `GET /shop/orders` - Commandes de l'utilisateur
- `GET /shop/orders/{order}` - Détail d'une commande

## Personnalisation

Pour personnaliser le plugin, vous pouvez :

1. Créer vos propres pages React dans `resources/js/pages/`
2. Modifier les traductions dans `resources/lang/`
3. Ajouter des colonnes dans les tables via des migrations

## License

MIT License - ExilonCMS
