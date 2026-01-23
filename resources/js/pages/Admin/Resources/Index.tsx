import { Head } from '@inertiajs/react';
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
    Package,
    GitBranch,
    Palette,
    Download,
    Eye,
    Star,
    TrendingUp,
} from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    slug: string;
    description: string;
    type: 'plugin' | 'theme';
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    pricing_type: 'free' | 'paid';
    price: number | null;
    version: string;
    author: {
        id: number;
        name: string;
    };
    downloads: number;
    views: number;
    rating: number;
    reviews_count: number;
    created_at: string;
}

interface Props extends PageProps {
    resources: {
        data: Resource[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ResourcesIndex({ resources }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500">{trans('admin.resources.approved')}</Badge>;
            case 'rejected':
                return <Badge variant="destructive">{trans('admin.resources.rejected')}</Badge>;
            case 'archived':
                return <Badge variant="secondary">{trans('admin.resources.archived')}</Badge>;
            default:
                return <Badge variant="outline">{trans('admin.resources.pending')}</Badge>;
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
            <Head title={trans('admin.resources.heading')} />

            <AdminLayout>
                <AdminLayoutHeader>
                    <AdminLayoutTitle
                        title={trans('admin.resources.heading')}
                        description={trans('admin.marketplace.description')}
                    />
                </AdminLayoutHeader>

                <AdminLayoutContent>
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.all')}</p>
                                            <p className="text-2xl font-bold">{resources.total}</p>
                                        </div>
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.plugins')}</p>
                                            <p className="text-2xl font-bold">
                                                {resources.data.filter(r => r.type === 'plugin').length}
                                            </p>
                                        </div>
                                        <Package className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.themes')}</p>
                                            <p className="text-2xl font-bold">
                                                {resources.data.filter(r => r.type === 'theme').length}
                                            </p>
                                        </div>
                                        <Palette className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{trans('admin.resources.downloads')}</p>
                                            <p className="text-2xl font-bold">
                                                {resources.data.reduce((sum, r) => sum + r.downloads, 0)}
                                            </p>
                                        </div>
                                        <Download className="h-8 w-8 text-green-500" />
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
                                            <p className="text-muted-foreground">{trans('admin.resources.no_resources')}</p>
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
                                                                {getStatusBadge(resource.status)}
                                                                <Badge variant="outline">
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
                                                                <span className="flex items-center gap-1">
                                                                    <Download className="h-3 w-3" />
                                                                    {resource.downloads}
                                                                </span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Eye className="h-3 w-3" />
                                                                    {resource.views}
                                                                </span>
                                                                {resource.rating > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                                            {resource.rating.toFixed(1)}
                                                                        </span>
                                                                    </>
                                                                )}
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
