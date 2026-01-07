import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Package, Star, Crown, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Item {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    type: 'item' | 'package' | 'prestige';
    image?: string;
    stock: number;
    metadata?: any;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ShowProps {
    item: Item;
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
};

export default function ShopShow({ item, money }: ShowProps) {
    const badge = typeBadges[item.type];
    const TypeIcon = typeIcons[item.type];

    return (
        <AuthenticatedLayout>
            <Head title={item.name} />

            <div className="container mx-auto px-4 pt-2 pb-8">
                {/* Back button */}
                <Link href="/shop">
                    <Button variant="ghost" className="mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la boutique
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image */}
                    <div>
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full aspect-square object-cover"
                                    />
                                ) : (
                                    <div className="w-full aspect-square bg-muted flex items-center justify-center">
                                        <TypeIcon className="h-32 w-32 text-muted-foreground/30" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant={badge.variant} className="text-sm">
                                    {badge.label}
                                </Badge>
                                {item.stock >= 0 && (
                                    <Badge variant="outline" className="text-sm">
                                        Stock: {item.stock}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold text-primary">
                                    {item.price} {money}
                                </div>
                            </div>
                        </div>

                        {item.description && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {item.category && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">Catégorie</h3>
                                    <Link
                                        href={`/shop/category/${item.category.slug}`}
                                        className="text-primary hover:underline"
                                    >
                                        {item.category.name}
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => {
                                router.post(route('cart.add'), {
                                    item_id: item.id,
                                    quantity: 1,
                                });
                            }}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Ajouter au panier
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
