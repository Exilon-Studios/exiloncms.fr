import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    AdminLayout,
    AdminLayoutHeader,
    AdminLayoutTitle,
    AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Check,
    X,
    UserX,
    Shield,
    Star,
    Users,
    Clock,
} from 'lucide-react';

interface Seller {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
    is_seller: boolean;
    seller_verified_at?: string;
    created_at: string;
    resources_count?: number;
}

interface Stats {
    pending: number;
    verified: number;
}

interface Props {
    sellers: {
        data: Seller[];
    };
    stats: Stats;
}

export default function SellerRequests({ sellers, stats }: Props) {
    const handleVerify = (userId: number) => {
        if (confirm(trans('admin.resources.verify_confirm') ?? 'Vérifier ce vendeur ?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/admin/resources/sellers/${userId}/verify`;

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = '_token';
                input.value = csrfToken;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        }
    };

    const handleRevoke = (userId: number) => {
        if (confirm(trans('admin.resources.revoke_confirm') ?? 'Révoquer la vérification de ce vendeur ?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/admin/resources/sellers/${userId}/revoke`;

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = '_token';
                input.value = csrfToken;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        }
    };

    const handleRemove = (userId: number) => {
        if (confirm(trans('admin.resources.remove_confirm') ?? 'Retirer le statut de vendeur à cet utilisateur ?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/admin/resources/sellers/${userId}`;
            form.appendChild(createHiddenInput('_method', 'DELETE'));

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = '_token';
                input.value = csrfToken;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        }
    };

    const createHiddenInput = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        return input;
    };

    return (
        <AuthenticatedLayout>
            <Head title={trans('admin.resources.sellers_title')} />

            <AdminLayout>
                <AdminLayoutHeader>
                    <AdminLayoutTitle>{trans('admin.resources.sellers_title')}</AdminLayoutTitle>
                </AdminLayoutHeader>

                <AdminLayoutContent>
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.pending')}</p>
                                            <p className="text-2xl font-bold">{stats.pending}</p>
                                        </div>
                                        <Clock className="h-8 w-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.verified')}</p>
                                            <p className="text-2xl font-bold">{stats.verified}</p>
                                        </div>
                                        <Shield className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sellers List */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {sellers.data.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">{trans('admin.resources.no_sellers')}</p>
                                        </div>
                                    ) : (
                                        sellers.data.map((seller) => (
                                            <div key={seller.id} className="p-6 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className="p-3 bg-primary/10 rounded-lg">
                                                            <User className="h-6 w-6 text-primary" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold truncate">{seller.name}</h3>
                                                                <Badge variant="secondary">
                                                                    {trans('admin.resources.unverified')}
                                                                </Badge>
                                                            </div>

                                                            {seller.email && (
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    {seller.email}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Star className="h-3 w-3" />
                                                                    {seller.resources_count || 0} {trans('admin.resources.resources_count')}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{new Date(seller.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleVerify(seller.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            {trans('admin.resources.verify')}
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRevoke(seller.id)}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            {trans('admin.resources.revoke')}
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRemove(seller.id)}
                                                        >
                                                            <UserX className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </AdminLayoutContent>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
