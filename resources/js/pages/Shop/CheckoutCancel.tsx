import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ShoppingBag, Home, RefreshCw } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function CheckoutCancel() {
    return (
        <AuthenticatedLayout>
            <Head title="Commande annulée" />

            <div className="container mx-auto px-4 pt-2 pb-8">
                {/* Cancellation Message */}
                <Card className="mb-6 max-w-2xl mx-auto">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="p-4 rounded-full bg-destructive/10">
                                <XCircle className="h-16 w-16 text-destructive" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Commande annulée</h1>
                                <p className="text-muted-foreground">
                                    Votre commande a été annulée. Aucun montant n'a été débité de votre compte.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Que souhaitez-vous faire ?</h2>
                        <div className="space-y-3">
                            <Link href="/cart">
                                <Button variant="outline" className="w-full">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Retourner au panier
                                </Button>
                            </Link>
                            <Link href="/shop">
                                <Button className="w-full">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Continuer mes achats
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="w-full">
                                    <Home className="h-4 w-4 mr-2" />
                                    Retour à l'accueil
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Help */}
                <Card className="max-w-2xl mx-auto mt-6 bg-muted/50">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
                        <p className="text-sm text-muted-foreground">
                            Si vous avez rencontré un problème lors du paiement, n'hésitez pas à nous contacter.
                            Notre équipe est là pour vous aider.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
