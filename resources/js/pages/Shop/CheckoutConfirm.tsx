import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShoppingBag, Gamepad2, Calendar, Receipt, Home, Package, User } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface OrderItem {
    name: string;
    description: string | null;
    quantity: number;
    price: number | string;
    subtotal: number | string;
}

interface OrderProps {
    order: {
        id: number;
        minecraft_username: string;
        status: string;
        total: number | string;
        paid_at: string;
        created_at: string;
    };
    items: OrderItem[];
    money: string;
}

const statusBadges: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    completed: { label: 'Complétée', variant: 'default' },
    cancelled: { label: 'Annulée', variant: 'outline' },
    refunded: { label: 'Remboursée', variant: 'outline' },
};

export default function CheckoutConfirm({ order, items, money }: OrderProps) {
    const status = statusBadges[order.status] || statusBadges.pending;

    return (
        <AuthenticatedLayout>
            <Head title="Commande confirmée" />

            <div className="container mx-auto px-4 pt-2 pb-8">
                {/* Success Message */}
                <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-500">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    Commande passée avec succès !
                                </h1>
                                <p className="text-green-700 dark:text-green-300 mt-1">
                                    Vos articles seront livrés sur votre compte Minecraft sous peu.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Info */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Détails de la commande</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Numéro de commande</p>
                                            <p className="font-semibold">#{order.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date</p>
                                            <p className="font-semibold">{order.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pseudo Minecraft</p>
                                            <p className="font-semibold">{order.minecraft_username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ordered Items */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Articles commandés</h2>
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-lg bg-primary/10">
                                                    <Package className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Quantité: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">
                                                    {Number(item.subtotal).toFixed(2)} {money}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {Number(item.price).toFixed(2)} {money} / unité
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Résumé</h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total des articles</span>
                                        <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total payé</span>
                                        <span className="text-primary">
                                            {Number(order.total).toFixed(2)} {money}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                        <p className="text-sm text-green-900 dark:text-green-100">
                                            Votre paiement a été reçu et votre commande est en cours de traitement.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Link href="/dashboard/orders">
                                        <Button variant="outline" className="w-full">
                                            <Receipt className="h-4 w-4 mr-2" />
                                            Mes commandes
                                        </Button>
                                    </Link>
                                    <Link href="/shop">
                                        <Button className="w-full">
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            Retour à la boutique
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
