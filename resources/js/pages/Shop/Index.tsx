import { Head } from '@inertiajs/react';
import PublicLayout, { PublicLayoutHeader, PublicLayoutContent, PublicLayoutSection } from '@/layouts/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Star, Zap, Crown } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { trans } from '@/lib/i18n';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    items_count: number;
}

interface Item {
    id: number;
    slug: string;
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
        item: { label: trans('shop.type_badge.item'), variant: 'secondary' },
        package: { label: trans('shop.type_badge.package'), variant: 'default' },
        prestige: { label: trans('shop.type_badge.prestige'), variant: 'default' },
    };

    return (
        <PublicLayout showCart>
            <Head title={trans('shop.title')} />

            <PublicLayoutHeader
                icon={<ShoppingBag className="h-6 w-6" />}
                title={trans('shop.title')}
                description={trans('shop.description')}
            />

            <PublicLayoutContent>
                {/* Categories */}
                <PublicLayoutSection title={trans('shop.categories')}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => {
                            const IconComponent = categoryIcons[category.icon] || ShoppingBag;
                            return (
                                <Card
                                    key={category.id}
                                    className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group"
                                >
                                    <Link href={`/shop/category/${category.slug}`}>
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
                                                    {category.items_count} {trans('shop.items')}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            );
                        })}
                    </div>
                </PublicLayoutSection>

                {/* Featured Items */}
                {featured_items.length > 0 && (
                    <PublicLayoutSection title={trans('shop.featured_items')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {featured_items.map((item) => {
                                const badge = typeBadges[item.type];
                                return (
                                    <Card
                                        key={item.id}
                                        className="hover:shadow-lg transition-all hover:border-primary/50 overflow-hidden group"
                                    >
                                        <Link href={`/shop/item/${item.slug}`}>
                                            {item.image && (
                                                <div className="aspect-video bg-muted relative">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    {item.featured && (
                                                        <Badge className="absolute top-2 right-2">
                                                            {trans('shop.featured')}
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
                                                        {trans('shop.buy')}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                );
                            })}
                        </div>
                    </PublicLayoutSection>
                )}
            </PublicLayoutContent>
        </PublicLayout>
    );
}
