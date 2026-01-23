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
    Archive,
    Eye,
    Clock,
    Package,
    GitBranch,
    Palette,
    User,
} from 'lucide-react';

interface Author {
    id: number;
    name: string;
    avatar?: string;
}

interface Resource {
    id: number;
    title: string;
    slug: string;
    description: string;
    type: 'plugin' | 'theme';
    pricing_type: 'free' | 'paid';
    price: number;
    version: string;
    status: string;
    created_at: string;
    author: Author;
}

interface Stats {
    pending: number;
    approved: number;
    rejected: number;
}

interface Props {
    resources: {
        data: Resource[];
    };
    stats: Stats;
}

export default function PendingResources({ resources, stats }: Props) {
    const handleApprove = (resourceId: number) => {
        if (confirm(trans('admin.resources.approve_confirm') ?? 'Approuver cette ressource ?')) {
            // Will be implemented with Inertia form
            window.location.href = `/admin/resources/${resourceId}/approve`;
        }
    };

    const handleReject = (resourceId: number) => {
        const reason = prompt(trans('admin.resources.reject_reason') ?? 'Raison du rejet :');
        if (reason) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/admin/resources/${resourceId}/reject`;

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = '_token';
                input.value = csrfToken;
                form.appendChild(input);
            }

            const reasonInput = document.createElement('input');
            reasonInput.type = 'hidden';
            reasonInput.name = 'reason';
            reasonInput.value = reason;
            form.appendChild(reasonInput);

            document.body.appendChild(form);
            form.submit();
        }
    };

    const handleArchive = (resourceId: number) => {
        if (confirm(trans('admin.resources.archive_confirm') ?? 'Archiver cette ressource ?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/admin/resources/${resourceId}/archive`;

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = '_token';
                input.value = csrfToken;
                form.appendChild(input);
            }

            const methodInput = document.createElement('input');
            methodInput.type = 'hidden';
            methodInput.name = '_method';
            methodInput.value = 'POST';
            form.appendChild(methodInput);

            document.body.appendChild(form);
            form.submit();
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'plugin' ? (
            <Package className="h-5 w-5" />
        ) : (
            <Palette className="h-5 w-5" />
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={trans('admin.resources.pending_title')} />

            <AdminLayout>
                <AdminLayoutHeader>
                    <AdminLayoutTitle>{trans('admin.resources.pending_title')}</AdminLayoutTitle>
                </AdminLayoutHeader>

                <AdminLayoutContent>
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid gap-4 md:grid-cols-3">
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
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.approved')}</p>
                                            <p className="text-2xl font-bold">{stats.approved}</p>
                                        </div>
                                        <Check className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.rejected')}</p>
                                            <p className="text-2xl font-bold">{stats.rejected}</p>
                                        </div>
                                        <X className="h-8 w-8 text-red-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Resources List */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {resources.data.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">{trans('admin.resources.no_pending')}</p>
                                        </div>
                                    ) : (
                                        resources.data.map((resource) => (
                                            <div key={resource.id} className="p-6 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className="p-3 bg-primary/10 rounded-lg">
                                                            {getTypeIcon(resource.type)}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold truncate">{resource.title}</h3>
                                                                <Badge variant="outline">
                                                                    {resource.type === 'plugin' ? trans('admin.resources.plugins') : trans('admin.resources.themes')}
                                                                </Badge>
                                                                <Badge variant="secondary">
                                                                    {resource.pricing_type === 'free' ? trans('admin.resources.free') : `${resource.price}€`}
                                                                </Badge>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                                {resource.description}
                                                            </p>

                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <span>v{resource.version}</span>
                                                                <span>•</span>
                                                                <span>{resource.author.name}</span>
                                                                <span>•</span>
                                                                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(`/resources/${resource.slug}`, '_blank')}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            {trans('admin.resources.view')}
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApprove(resource.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            {trans('admin.resources.verify')}
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleReject(resource.id)}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            {trans('admin.resources.reject')}
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleArchive(resource.id)}
                                                        >
                                                            <Archive className="h-4 w-4" />
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
