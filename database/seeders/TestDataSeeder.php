<?php

namespace Database\Seeders;

use ExilonCMS\Models\Page;
use ExilonCMS\Models\Post;
use ExilonCMS\Models\User;
use ExilonCMS\Models\Ban;
use ExilonCMS\Models\Notification;
use ExilonCMS\Plugins\Shop\Models\PromoCode;
use ExilonCMS\Plugins\Shop\Models\Order;
use ExilonCMS\Plugins\Shop\Models\OrderItem;
use ExilonCMS\Plugins\Shop\Models\Category;
use ExilonCMS\Plugins\Shop\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding test data...');

        // Get or create test users (we don't delete existing ones)
        $admin = User::where('email', 'admin@exilonstudios.com')->first();
        $client = User::where('email', 'client@test.com')->first();

        // Seed blog posts
        $this->seedPosts();

        // Seed pages
        $this->seedPages();

        // Seed promo codes
        $this->seedPromoCodes();

        // Seed test bans
        $this->seedBans($admin);

        // Seed test notifications
        $this->seedNotifications($admin, $client);

        // Seed test orders (if shop has items)
        $this->seedOrders($client);

        // Add money to test accounts
        if ($admin) {
            $admin->money = 10000;
            $admin->save();
        }
        if ($client) {
            $client->money = 5000;
            $client->save();
        }

        $this->command->info('Test data seeded successfully!');
    }

    protected function seedPosts(): void
    {
        $adminId = User::where('email', 'admin@exilonstudios.com')->first()?->id;
        if (!$adminId) return;

        $posts = [
            [
                'title' => 'Bienvenue sur ExilonCMS',
                'slug' => 'bienvenue-sur-exiloncms',
                'description' => 'Découvrez ExilonCMS, un serveur Minecraft unique avec économie, événements et bien plus.',
                'content' => "## Bienvenue sur notre serveur Minecraft\n\nNous sommes ravis de vous accueillir sur ExilonCMS. Découvrez nos fonctionnalités exclusives :\n\n- **Survie**: Un monde ouvert avec des zones PvP et PvE\n- **Économie**: Marché dynamique et boutique en ligne\n- **Événements**: Des événements hebdomadaires avec des récompenses\n\nRejoignez-nous dès maintenant !",
                'author_id' => $adminId,
                'is_pinned' => true,
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Mise à jour majeure 2.0',
                'slug' => 'mise-a-jour-majeure-2-0',
                'description' => 'Découvrez les nouvelles fonctionnalités de la version 2.0 du serveur.',
                'content' => "## Nouveautés de la version 2.0\n\nNous sommes fiers de vous annoncer la sortie de la version 2.0 d'ExilonCMS !\n\n### Nouvelles fonctionnalités :\n- Nouvelle boutique en ligne\n- Système de codes promo\n- Amélioration des performances\n- Nouveaux rangs prestige\n\n### Comment mettre à jour ?\nRejoignez le serveur pour profiter immédiatement de ces nouveautés.",
                'author_id' => $adminId,
                'is_pinned' => true,
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Guide du débutant',
                'slug' => 'guide-du-debutant',
                'description' => 'Tout ce que vous devez savoir pour commencer votre aventure.',
                'content' => "## Comment bien débuter sur ExilonCMS ?\n\n### 1. Créez votre compte\nCommencez par vous inscrire sur notre site web.\n\n### 2. Rejoignez le serveur\nConnectez-vous avec l'adresse IP : play.exiloncms.com\n\n### 3. Gagnez de l'argent\n- Votez chaque jour pour des récompenses\n- Participez aux événements\n- Achetez et vendez des items\n\n### 4. Progresssez\n- Obtenez des rangs prestige\n- Débloquez des avantages exclusifs\n- Rejoignez ou créez un clan\n\nBonne aventure !",
                'author_id' => $adminId,
                'is_pinned' => false,
                'published_at' => now()->subDay(),
            ],
            [
                'title' => 'Événement Halloween bientôt disponible',
                'slug' => 'evenement-halloween',
                'description' => 'Un événement spécial arrive avec des récompenses exclusives.',
                'content' => "## Préparez-vous pour Halloween !\n\nDu 25 au 31 octobre, participez à notre événement spécial Halloween :\n\n- 🎃 Chasse aux citrouilles\n- 👻 Quêtes spéciales\n- 🦇 Boss exclusifs\n- 🎁 Récompenses limitées\n\nRendez-vous sur le spawn pour commencer les quêtes !",
                'author_id' => $adminId,
                'is_pinned' => true,
                'published_at' => now(),
            ],
        ];

        foreach ($posts as $postData) {
            $existing = Post::where('slug', $postData['slug'])->first();
            if (!$existing) {
                Post::create($postData);
            }
        }

        $this->command->info('Posts seeded!');
    }

    protected function seedPages(): void
    {
        $pages = [
            [
                'title' => 'Règlement',
                'slug' => 'reglement',
                'description' => 'Règles à respecter sur le serveur',
                'content' => "## Règlement du serveur\n\n### Règles générales\n1. Le respect est obligatoire envers tous les joueurs\n2. Interdiction d'utiliser des cheats ou des mods non autorisés\n3. Pas de spam ou de publicité\n4. Le griefing est interdit\n5. Écoutez et respectez les membres du staff\n\n### Sanctions\n- Avertissement\n- Mute temporaire\n- Ban temporaire\n- Ban définitif\n\nTout manquement au règlement sera sanctionné.",
                'is_enabled' => true,
            ],
            [
                'title' => 'À propos',
                'slug' => 'a-propos',
                'description' => 'En savoir plus sur ExilonCMS',
                'content' => "## À propos d'ExilonCMS\n\nExilonCMS est un serveur Minecraft fondé en 2024 par une équipe passionnée.\n\n### Notre mission\nOffrir la meilleure expérience de jeu possible avec des fonctionnalités innovantes et une communauté active.\n\n### L'équipe\n- **Fondateur**: Admin\n- **Développeurs**: Notre équipe technique\n- **Modérateurs**: Toujours disponibles pour vous aider\n\n### Contact\n- Discord: discord.exiloncms.com\n- Email: contact@exiloncms.com",
                'is_enabled' => true,
            ],
            [
                'title' => 'Support',
                'slug' => 'support',
                'description' => 'Comment obtenir de l\'aide',
                'content' => "## Besoin d'aide ?\n\n### Comment nous contacter\n\n**Sur Discord**\nRejoignez notre serveur Discord et ouvrez un ticket.\n\n**Sur le forum**\nPosez vos questions dans la section appropriée.\n\n**En jeu**\nUtilisez la commande `/helpop` pour contacter un modérateur.\n\n### Temps de réponse\n- Discord: Quelques minutes\n- Forum: Quelques heures\n- En jeu: Variable selon la disponibilité du staff",
                'is_enabled' => true,
            ],
        ];

        foreach ($pages as $pageData) {
            $existing = Page::where('slug', $pageData['slug'])->first();
            if (!$existing) {
                Page::create($pageData);
            }
        }

        $this->command->info('Pages seeded!');
    }

    protected function seedPromoCodes(): void
    {
        $promoCodes = [
            [
                'code' => 'BIENVENUE10',
                'description' => '10% de réduction pour votre première commande',
                'type' => 'percentage',
                'value' => 10,
                'min_amount' => 50,
                'max_uses' => 100,
                'valid_from' => now(),
                'valid_until' => now()->addDays(30),
                'is_active' => true,
            ],
            [
                'code' => 'SOLDE2025',
                'description' => '20% de réduction sur tout le site',
                'type' => 'percentage',
                'value' => 20,
                'min_amount' => 100,
                'max_uses' => 50,
                'valid_from' => now(),
                'valid_until' => now()->addDays(7),
                'is_active' => true,
            ],
            [
                'code' => 'FIXE50',
                'description' => '50 Points de réduction',
                'type' => 'fixed',
                'value' => 50,
                'min_amount' => 200,
                'max_uses' => null,
                'valid_from' => now(),
                'valid_until' => now()->addDays(14),
                'is_active' => true,
            ],
            [
                'code' => 'VIP25',
                'description' => '25% sur les rangs VIP',
                'type' => 'percentage',
                'value' => 25,
                'min_amount' => 500,
                'max_uses' => 25,
                'valid_from' => now(),
                'valid_until' => now()->addMonth(),
                'is_active' => true,
            ],
            [
                'code' => 'EXPIRED',
                'description' => 'Code promo expiré (pour test)',
                'type' => 'percentage',
                'value' => 50,
                'min_amount' => null,
                'max_uses' => null,
                'valid_from' => now()->subDays(30),
                'valid_until' => now()->subDays(1),
                'is_active' => false,
            ],
        ];

        foreach ($promoCodes as $promoData) {
            $existing = PromoCode::where('code', $promoData['code'])->first();
            if (!$existing) {
                PromoCode::create($promoData);
            }
        }

        $this->command->info('Promo codes seeded!');
    }

    protected function seedBans(?User $admin): void
    {
        if (!$admin) return;

        $bans = [
            [
                'reason' => 'Utilisation de cheats',
                'author_id' => $admin->id,
            ],
            [
                'reason' => 'Griefing - Destruction de constructions',
                'author_id' => $admin->id,
            ],
            [
                'reason' => 'Insultes et comportement toxique',
                'author_id' => $admin->id,
            ],
        ];

        // Get default role or first role
        $defaultRole = \ExilonCMS\Models\Role::first();

        // Create dummy users for bans or use existing ones
        foreach ($bans as $banData) {
            $existingCount = Ban::where('reason', $banData['reason'])->count();
            if ($existingCount === 0) {
                // Create a dummy banned user
                $bannedUser = User::firstOrCreate(
                    ['email' => 'banned_' . strtolower(str_replace(' ', '_', $banData['reason'])) . '@test.com'],
                    [
                        'name' => 'BannedUser_' . rand(1000, 9999),
                        'password' => bcrypt('password'),
                        'role_id' => $defaultRole?->id,
                        'game_id' => 'BannedPlayer' . rand(100, 999),
                    ]
                );

                Ban::create([
                    'user_id' => $bannedUser->id,
                    'reason' => $banData['reason'],
                    'author_id' => $banData['author_id'],
                ]);
            }
        }

        $this->command->info('Bans seeded!');
    }

    protected function seedNotifications(?User $admin, ?User $client): void
    {
        if (!$admin || !$client) return;

        $notifications = [
            [
                'user_id' => $client->id,
                'level' => 'success',
                'content' => 'Bienvenue ! Merci pour votre inscription. Profitez de 10% de réduction avec le code BIENVENUE10',
                'read_at' => null,
            ],
            [
                'user_id' => $client->id,
                'level' => 'info',
                'content' => 'Nouveau rang disponible : Le rang MVP est maintenant disponible dans la boutique !',
                'read_at' => null,
            ],
            [
                'user_id' => $admin->id,
                'level' => 'info',
                'content' => 'Nouvelle commande : Un joueur vient de passer une commande de 500 Points',
                'read_at' => now(),
            ],
        ];

        foreach ($notifications as $notifData) {
            $existing = Notification::where('content', $notifData['content'])
                ->where('user_id', $notifData['user_id'])
                ->first();
            if (!$existing) {
                Notification::create($notifData);
            }
        }

        $this->command->info('Notifications seeded!');
    }

    protected function seedOrders(?User $client): void
    {
        if (!$client) return;

        // Get shop items
        $item1 = Item::where('slug', 'ender-pearl')->first();
        $item2 = Item::where('slug', 'starter-pack')->first();

        if (!$item1 || !$item2) {
            $this->command->warn('Shop items not found. Skipping order seeding.');
            return;
        }

        $orders = [
            [
                'status' => 'completed',
                'total' => 50,
                'paid_at' => now()->subDays(2),
                'items' => [
                    [
                        'name' => $item1->name,
                        'description' => $item1->description,
                        'quantity' => 1,
                        'price' => 50,
                        'type' => $item1->type,
                        'metadata' => $item1->metadata,
                    ],
                ],
            ],
            [
                'status' => 'completed',
                'total' => 500,
                'paid_at' => now()->subDay(),
                'items' => [
                    [
                        'name' => $item2->name,
                        'description' => $item2->description,
                        'quantity' => 1,
                        'price' => 500,
                        'type' => $item2->type,
                        'metadata' => $item2->metadata,
                    ],
                ],
            ],
            [
                'status' => 'pending',
                'total' => 150,
                'paid_at' => null,
                'items' => [
                    [
                        'name' => $item1->name,
                        'description' => $item1->description,
                        'quantity' => 3,
                        'price' => 50,
                        'type' => $item1->type,
                        'metadata' => $item1->metadata,
                    ],
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $existingCount = Order::where('user_id', $client->id)
                ->where('total', $orderData['total'])
                ->count();

            if ($existingCount === 0) {
                $order = Order::create([
                    'user_id' => $client->id,
                    'minecraft_username' => $client->game_id,
                    'status' => $orderData['status'],
                    'total' => $orderData['total'],
                    'paid_at' => $orderData['paid_at'],
                ]);

                foreach ($orderData['items'] as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                        'type' => $item['type'],
                        'metadata' => $item['metadata'],
                    ]);
                }
            }
        }

        $this->command->info('Orders seeded!');
    }
}
