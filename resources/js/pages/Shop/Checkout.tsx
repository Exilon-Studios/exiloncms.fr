import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, User, Gamepad2, ArrowLeft, CheckCircle2, Info, CreditCard, MapPin, Wallet } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
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
        type: string;
    };
    quantity: number;
    subtotal: number;
}

interface CheckoutProps {
    items: CartItem[];
    total: number;
    money: string;
    user: {
        name: string;
        minecraft_username?: string;
        balance?: number;
    };
}

export default function Checkout({ items, total, money, user }: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm({
        minecraft_username: user.minecraft_username || '',
        payment_method: 'balance',
        billing_name: user.name || '',
        billing_email: '',
        billing_address: '',
        billing_city: '',
        billing_postal_code: '',
        billing_country: '',
    });

    const [usernameValid, setUsernameValid] = useState<boolean | null>(null);

    const validateMinecraftUsername = (username: string) => {
        // Minecraft username: 3-16 characters, alphanumeric and underscores only
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        return regex.test(username);
    };

    const handleUsernameChange = (value: string) => {
        setData('minecraft_username', value);
        if (value.length > 0) {
            setUsernameValid(validateMinecraftUsername(value));
        } else {
            setUsernameValid(null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateMinecraftUsername(data.minecraft_username)) {
            setUsernameValid(false);
            return;
        }

        post(route('checkout.store'));
    };

    const needsBillingInfo = data.payment_method !== 'stripe';

    return (
        <AuthenticatedLayout>
            <Head title="Finaliser la commande" />

            <div className="container mx-auto px-4 pt-2 pb-8">
                {/* Back button */}
                <Link href="/cart">
                    <Button variant="ghost" className="mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour au panier
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Minecraft Username */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gamepad2 className="h-5 w-5" />
                                    Pseudo Minecraft
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="minecraft_username">
                                            Pseudo Minecraft en jeu <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="minecraft_username"
                                            value={data.minecraft_username}
                                            onChange={(e) => handleUsernameChange(e.target.value)}
                                            placeholder="Ex: Steve"
                                            className={usernameValid === false ? 'border-destructive' : ''}
                                            required
                                        />
                                        {errors.minecraft_username && (
                                            <p className="text-sm text-destructive">{errors.minecraft_username}</p>
                                        )}
                                        {usernameValid === true && (
                                            <p className="text-sm text-green-600 flex items-center gap-1">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Pseudo valide
                                            </p>
                                        )}
                                        {usernameValid === false && (
                                            <p className="text-sm text-destructive">
                                                Le pseudo doit contenir 3 à 16 caractères (lettres, chiffres et _ uniquement)
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Vérifiez bien votre pseudo Minecraft. Les articles seront livrés à ce compte en jeu.
                                                Assurez-vous que le pseudo est correct avant de valider la commande.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Mode de paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="balance"
                                            checked={data.payment_method === 'balance'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">Solde du compte</div>
                                            <div className="text-sm text-muted-foreground">
                                                Payer avec votre solde actuel
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                                            <Wallet className="h-3 w-3" />
                                            {user.balance?.toFixed(2) ?? '0.00'} {money}
                                        </Badge>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="stripe"
                                            checked={data.payment_method === 'stripe'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">Carte bancaire (Stripe)</div>
                                            <div className="text-sm text-muted-foreground">
                                                Paiement sécurisé par carte bancaire
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="paypal"
                                            checked={data.payment_method === 'paypal'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">PayPal</div>
                                            <div className="text-sm text-muted-foreground">
                                                Paiement via votre compte PayPal
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                {errors.payment_method && (
                                    <p className="text-sm text-destructive">{errors.payment_method}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Billing Information (if needed) */}
                        {needsBillingInfo && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Informations de facturation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="billing_name">Nom complet <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="billing_name"
                                                    value={data.billing_name}
                                                    onChange={(e) => setData('billing_name', e.target.value)}
                                                    placeholder="Jean Dupont"
                                                    required={needsBillingInfo}
                                                />
                                                {errors.billing_name && (
                                                    <p className="text-sm text-destructive">{errors.billing_name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="billing_email">Email <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="billing_email"
                                                    type="email"
                                                    value={data.billing_email}
                                                    onChange={(e) => setData('billing_email', e.target.value)}
                                                    placeholder="jean.dupont@example.com"
                                                    required={needsBillingInfo}
                                                />
                                                {errors.billing_email && (
                                                    <p className="text-sm text-destructive">{errors.billing_email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="billing_address">Adresse <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="billing_address"
                                                value={data.billing_address}
                                                onChange={(e) => setData('billing_address', e.target.value)}
                                                placeholder="123 Rue de la Paix"
                                                required={needsBillingInfo}
                                            />
                                            {errors.billing_address && (
                                                <p className="text-sm text-destructive">{errors.billing_address}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="billing_postal_code">Code postal <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="billing_postal_code"
                                                    value={data.billing_postal_code}
                                                    onChange={(e) => setData('billing_postal_code', e.target.value)}
                                                    placeholder="75001"
                                                    required={needsBillingInfo}
                                                />
                                                {errors.billing_postal_code && (
                                                    <p className="text-sm text-destructive">{errors.billing_postal_code}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="billing_city">Ville <span className="text-destructive">*</span></Label>
                                                <Input
                                                    id="billing_city"
                                                    value={data.billing_city}
                                                    onChange={(e) => setData('billing_city', e.target.value)}
                                                    placeholder="Paris"
                                                    required={needsBillingInfo}
                                                />
                                                {errors.billing_city && (
                                                    <p className="text-sm text-destructive">{errors.billing_city}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="billing_country">Pays <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="billing_country"
                                                value={data.billing_country}
                                                onChange={(e) => setData('billing_country', e.target.value)}
                                                placeholder="France"
                                                required={needsBillingInfo}
                                            />
                                            {errors.billing_country && (
                                                <p className="text-sm text-destructive">{errors.billing_country}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Submit Button */}
                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={submit}>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={processing || !data.minecraft_username || usernameValid === false}
                                    >
                                        {processing ? 'Traitement...' : 'Confirmer et payer'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 self-start">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" />
                                    Résumé
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {items.map((cartItem) => (
                                        <div key={cartItem.id} className="flex gap-3">
                                            {cartItem.item.image ? (
                                                <img
                                                    src={cartItem.item.image}
                                                    alt={cartItem.item.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                    <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {cartItem.item.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Qté: {cartItem.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">
                                                    {cartItem.subtotal.toFixed(2)} {money}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Articles ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                        <span>{total.toFixed(2)} {money}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {total.toFixed(2)} {money}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
