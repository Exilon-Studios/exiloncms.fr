import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Download, ExternalLink } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface OrderItem {
    id: number;
    name: string;
    description?: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: 'pending' | 'completed' | 'cancelled' | 'refunded';
    total: number;
    payment_method?: string;
    paid_at?: string;
    created_at: string;
    items: OrderItem[];
}

interface OrdersProps {
    orders: Order[];
    money: string;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    completed: { label: 'Livré', variant: 'default' },
    cancelled: { label: 'Annulé', variant: 'destructive' },
    refunded: { label: 'Remboursé', variant: 'outline' },
};

export default function Orders({ orders, money }: OrdersProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Mes commandes" />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Mes Commandes</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Consultez l'historique de toutes vos commandes
                    </p>
                </div>

                {/* Back to shop */}
                <div className="mb-6">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Retour à la boutique
                    </Link>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Aucune commande</p>
                                <p className="text-sm mt-2">Vous n'avez pas encore effectué de commande.</p>
                                <Link href="/shop">
                                    <Button className="mt-4">
                                        Découvrir la boutique
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = statusLabels[order.status];
                            return (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Commande #{order.id}
                                                </CardTitle>
                                                <CardDescription>
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={status.variant} className="ml-2">
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Order Items */}
                                        <div className="space-y-3 mb-4">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                                >
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {item.description}
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-muted-foreground">
                                                            Quantité: {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">
                                                            {item.price} {money}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Total & Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="text-lg">
                                                <span className="text-muted-foreground">Total :</span>{' '}
                                                <span className="font-bold text-primary">
                                                    {order.total} {money}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {order.status === 'completed' && (
                                                    <Button variant="outline" size="sm">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Facture
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/shop/orders/${order.id}`}>
                                                        Voir détails
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
