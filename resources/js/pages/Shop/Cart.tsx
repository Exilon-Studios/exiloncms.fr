import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface CartItem {
    id: number;
    item_id: number;
    item: {
        id: number;
        name: string;
        slug: string;
        price: number;
        image?: string;
        stock: number;
        type: string;
    };
    quantity: number;
    subtotal: number;
}

interface CartProps {
    items: CartItem[];
    total: number;
    money: string;
}

export default function CartIndex({ items, total, money }: CartProps) {
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        setUpdatingId(itemId);
        router.post(route('cart.update', itemId), {
            quantity: newQuantity,
        }, {
            onFinish: () => setUpdatingId(null),
        });
    };

    const removeItem = (itemId: number) => {
        if (!confirm('Supprimer cet article du panier ?')) return;
        router.delete(route('cart.remove', itemId));
    };

    const clearCart = () => {
        if (!confirm('Vider le panier ?')) return;
        router.delete(route('cart.clear'));
    };

    const checkout = () => {
        router.visit('/checkout');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panier" />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Mon Panier</h1>
                    </div>
                    <Link href="/shop">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Continuer mes achats
                        </Button>
                    </Link>
                </div>

                {items.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                            <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
                            <p className="text-muted-foreground mb-6">
                                Ajoutez des articles pour commencer vos achats.
                            </p>
                            <Link href="/shop">
                                <Button>
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Voir la boutique
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((cartItem) => (
                                <Card key={cartItem.id}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <Link
                                                href={`/shop/item/${cartItem.item.slug}`}
                                                className="shrink-0"
                                            >
                                                {cartItem.item.image ? (
                                                    <img
                                                        src={cartItem.item.image}
                                                        alt={cartItem.item.name}
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                                                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/shop/item/${cartItem.item.slug}`}
                                                    className="font-semibold hover:text-primary line-clamp-1"
                                                >
                                                    {cartItem.item.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {cartItem.item.price} {money}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={updatingId === cartItem.id || cartItem.quantity <= 1}
                                                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-12 text-center">
                                                        {cartItem.quantity}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={updatingId === cartItem.id || cartItem.quantity >= 99}
                                                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Price & Remove */}
                                            <div className="text-right">
                                                <div className="font-bold text-lg mb-2">
                                                    {cartItem.subtotal.toFixed(2)} {money}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeItem(cartItem.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Clear Cart Button */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={clearCart}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Vider le panier
                            </Button>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Résumé</h2>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Articles</span>
                                            <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">
                                                {total.toFixed(2)} {money}
                                            </span>
                                        </div>
                                    </div>

                                    <Button className="w-full" size="lg" onClick={checkout}>
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Continuer vers le paiement
                                    </Button>

                                    <div className="mt-4 text-center text-sm text-muted-foreground">
                                        <Link href="/shop" className="hover:underline">
                                            Continuer mes achats
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
