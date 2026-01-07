import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Star, Crown, Zap, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    type: 'item' | 'package' | 'prestige';
    image?: string;
    stock: number;
}

interface CategoryData {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon?: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
}

interface CategoryProps {
    category: CategoryData;
    items: CategoryItem[];
    pagination: Pagination;
    money: string;
}

const typeBadges: Record<string, { label: string; variant: 'default' | 'secondary' }> = {
    item: { label: 'Article', variant: 'secondary' },
    package: { label: 'Pack', variant: 'default' },
    prestige: { label: 'Prestige', variant: 'default' },
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    item: Package,
    package: Star,
    prestige: Crown,
    booster: Zap,
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    package: Package,
    star: Star,
    crown: Crown,
    zap: Zap,
};

export default function ShopCategory({ category, items, pagination, money }: CategoryProps) {
    const IconComponent = category.icon ? iconMap[category.icon] : Package;

    return (
        <AuthenticatedLayout>
            <Head title={category.name} />

            <div className="container mx-auto py-8 px-4">
                {/* Back button */}
                <Link href="/shop">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la boutique
                    </Button>
                </Link>

                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-primary/10">
                        <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{category.name}</h1>
                        {category.description && (
                            <p className="text-muted-foreground">{category.description}</p>
                        )}
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                        {pagination.total} article{pagination.total > 1 ? 's' : ''}
                    </Badge>
                </div>

                {/* Items Grid */}
                {items.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                            {items.map((item) => {
                                const badge = typeBadges[item.type];
                                const ItemTypeIcon = typeIcons[item.type];
                                return (
                                    <Card
                                        key={item.id}
                                        className="hover:shadow-lg transition-all hover:border-primary/50 overflow-hidden group"
                                    >
                                        <Link href={`/shop/item/${item.slug}`}>
                                            {item.image ? (
                                                <div className="aspect-video bg-muted relative">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-muted flex items-center justify-center">
                                                    <ItemTypeIcon className="h-16 w-16 text-muted-foreground/30" />
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
                                                    {item.stock >= 0 && item.stock <= 5 && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Stock: {item.stock}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                {pagination.current_page > 1 && (
                                    <Link
                                        href={`/shop/category/${category.slug}?page=${pagination.current_page - 1}`}
                                    >
                                        <Button variant="outline">Précédent</Button>
                                    </Link>
                                )}
                                <span className="px-4 py-2">
                                    Page {pagination.current_page} / {pagination.last_page}
                                </span>
                                {pagination.current_page < pagination.last_page && (
                                    <Link
                                        href={`/shop/category/${category.slug}?page=${pagination.current_page + 1}`}
                                    >
                                        <Button variant="outline">Suivant</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                            <h3 className="text-lg font-semibold mb-2">Aucun article</h3>
                            <p className="text-muted-foreground">
                                Cette catégorie ne contient aucun article pour le moment.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
