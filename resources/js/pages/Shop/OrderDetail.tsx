import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface OrderItem {
    id: number;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    metadata?: any;
}

interface Order {
    id: number;
    status: 'pending' | 'completed' | 'cancelled' | 'refunded';
    total: number;
    payment_method?: string;
    paid_at?: string;
    created_at: string;
    items: OrderItem[];
    minecraft_username?: string;
}

interface OrderDetailProps {
    order: Order;
    money: string;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    completed: { label: 'Livré', variant: 'default' },
    cancelled: { label: 'Annulé', variant: 'destructive' },
    refunded: { label: 'Remboursé', variant: 'outline' },
};

export default function OrderDetail({ order, money }: OrderDetailProps) {
    const status = statusLabels[order.status];

    return (
        <AuthenticatedLayout>
            <Head title={`Commande #${order.id}`} />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Commande #{order.id}</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Détails de votre commande
                    </p>
                </div>

                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href="/dashboard/orders"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux commandes
                    </Link>
                </div>

                {/* Order Info */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Informations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="text-sm text-muted-foreground">Statut</div>
                                <Badge variant={status.variant} className="mt-1">
                                    {status.label}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Date</div>
                                <div className="font-medium">
                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                            {order.minecraft_username && (
                                <div>
                                    <div className="text-sm text-muted-foreground">Joueur</div>
                                    <div className="font-medium">{order.minecraft_username}</div>
                                </div>
                            )}
                            {order.payment_method && (
                                <div>
                                    <div className="text-sm text-muted-foreground">Moyen de paiement</div>
                                    <div className="font-medium capitalize">{order.payment_method}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {order.total} {money}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                >
                                    <div className="flex-1">
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
                                            {(Number(item.price) * item.quantity).toFixed(2)} {money}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {Number(item.price).toFixed(2)} {money} / unité
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-6 mt-6 border-t">
                            <div className="text-lg">
                                <span className="text-muted-foreground">Total :</span>{' '}
                                <span className="font-bold text-primary">
                                    {order.total} {money}
                                </span>
                            </div>
                            {order.status === 'completed' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.visit(route('dashboard.invoices.download', order.id))}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger la facture
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
