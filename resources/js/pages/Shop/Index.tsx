import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Package, FileText, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    items_count: number;
}

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    type: 'item' | 'package' | 'prestige';
    featured?: boolean;
}

interface ShopProps {
    categories: Category[];
    featured_items: Item[];
    money: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    items: Package,
    packages: Star,
    prestiges: Crown,
    boosters: Zap,
};

export default function ShopIndex({ categories, featured_items, money }: ShopProps) {
    const typeBadges: Record<string, { label: string; variant: 'default' | 'secondary' }> = {
        item: { label: 'Article', variant: 'secondary' },
        package: { label: 'Pack', variant: 'default' },
        prestige: { label: 'Prestige', variant: 'default' },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Boutique" />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Boutique</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Achetez des articles, des packs et des prestiges pour améliorer votre expérience
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 group">
                        <Link href="/shop" className="block">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <ShoppingBag className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">Voir la boutique</div>
                                        <div className="text-sm text-muted-foreground">
                                            Parcourir tous les articles
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 group">
                        <Link href="/shop/orders" className="block">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Package className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">Mes commandes</div>
                                        <div className="text-sm text-muted-foreground">
                                            Voir mon historique
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 group">
                        <Link href="/shop/invoices" className="block">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">Mes factures</div>
                                        <div className="text-sm text-muted-foreground">
                                            Télécharger mes PDF
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Catégories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => {
                            const IconComponent = categoryIcons[category.icon] || ShoppingBag;
                            return (
                                <Card
                                    key={category.id}
                                    className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group"
                                >
                                    <Link href={`/shop?category=${category.id}`}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="p-4 rounded-lg bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                                                    <IconComponent className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="font-semibold mb-1">{category.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.description}
                                                </p>
                                                <Badge variant="secondary" className="mt-2">
                                                    {category.items_count} articles
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Featured Items */}
                {featured_items.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Articles en vedette</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {featured_items.map((item) => {
                                const badge = typeBadges[item.type];
                                return (
                                    <Card
                                        key={item.id}
                                        className="hover:shadow-lg transition-all hover:border-primary/50 overflow-hidden group"
                                    >
                                        <Link href={`/shop/items/${item.id}`}>
                                            {item.image && (
                                                <div className="aspect-video bg-muted relative">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    {item.featured && (
                                                        <Badge className="absolute top-2 right-2">
                                                            Vedette
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold line-clamp-1 flex-1">
                                                        {item.name}
                                                    </h3>
                                                    <Badge variant={badge.variant} className="ml-2 shrink-0">
                                                        {badge.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-lg font-bold text-primary">
                                                        {item.price} {money}
                                                    </div>
                                                    <Button size="sm" className="shrink-0">
                                                        Acheter
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
