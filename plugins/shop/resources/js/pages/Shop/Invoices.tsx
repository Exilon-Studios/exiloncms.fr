import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Calendar, CreditCard } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Invoice {
    id: number;
    order_id: number;
    number: string;
    total: number;
    status: 'paid' | 'pending' | 'cancelled';
    due_date?: string;
    paid_at?: string;
    created_at: string;
}

interface InvoicesProps {
    invoices: Invoice[];
    money: string;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    paid: { label: 'Payée', variant: 'default' },
    pending: { label: 'En attente', variant: 'secondary' },
    cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function Invoices({ invoices, money }: InvoicesProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Mes factures" />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Mes Factures</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Téléchargez vos factures au format PDF
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

                {/* Invoices List */}
                {invoices.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Aucune facture</p>
                                <p className="text-sm mt-2">
                                    Vous n'avez pas encore de facture disponible.
                                </p>
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
                        {invoices.map((invoice) => {
                            const status = statusLabels[invoice.status];
                            return (
                                <Card key={invoice.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Facture {invoice.number}
                                                </CardTitle>
                                                <CardDescription>
                                                    Commande #{invoice.order_id}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={status.variant} className="ml-2">
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Invoice Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Date d'émission
                                                    </div>
                                                    <div className="font-medium">
                                                        {new Date(invoice.created_at).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {invoice.due_date && (
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Date d'échéance
                                                        </div>
                                                        <div className="font-medium">
                                                            {new Date(invoice.due_date).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {invoice.paid_at && (
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Payée le
                                                        </div>
                                                        <div className="font-medium">
                                                            {new Date(invoice.paid_at).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Invoice Total & Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="text-lg">
                                                <span className="text-muted-foreground">Total :</span>{' '}
                                                <span className="font-bold text-primary">
                                                    {invoice.total} {money}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Télécharger PDF
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/shop/orders/${invoice.order_id}`}>
                                                        Voir la commande
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
