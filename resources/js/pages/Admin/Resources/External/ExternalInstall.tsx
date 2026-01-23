import { Head, router } from '@inertiajs/react';
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
import { Input } from '@/components/ui/input';
import {
    Package,
    Palette,
    Download,
    RefreshCw,
    Search,
    Check,
    Star,
    ExternalLink,
    CloudDownload,
} from 'lucide-react';
import { useState } from 'react';

interface ExternalResource {
    id: string;
    slug: string;
    title: string;
    description: string;
    type: 'plugin' | 'theme';
    version: string;
    pricing_type: 'free' | 'paid';
    price: number | null;
    thumbnail?: string;
    author: {
        name: string;
    };
    downloads: number;
    rating: number;
    reviews_count: number;
    repository_url?: string;
}

interface Props extends PageProps {
    resources: ExternalResource[];
    installedResources: string[];
    filters: {
        type: string;
        search: string;
    };
}

export default function ExternalInstall({ resources, installedResources, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || 'all');
    const [installing, setInstalling] = useState<string | null>(null);

    const filteredResources = resources.filter((resource) => {
        const matchesSearch = !searchQuery ||
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || resource.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const isInstalled = (slug: string) => installedResources.includes(slug);

    const handleInstall = (resourceId: string, type: string) => {
        setInstalling(resourceId);

        router.post(`/admin/resources/external/install/${resourceId}`, {
            type,
        }, {
            onFinish: () => {
                setInstalling(null);
            },
            onError: (errors) => {
                setInstalling(null);
                console.error('Installation failed:', errors);
            },
        });
    };

    const handleSync = () => {
        if (confirm(trans('admin.resources.sync_confirm') ?? 'Sync with external server?')) {
            router.post('/admin/resources/external/sync');
        }
    };

    const handleSearch = () => {
        router.get('/admin/resources/external/install', {
            type: typeFilter,
            search: searchQuery,
        });
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
            <Head title={trans('admin.resources.external_title')} />

            <AdminLayout>
                <AdminLayoutHeader>
                    <AdminLayoutTitle
                        title={trans('admin.resources.external_title')}
                        description={trans('admin.resources.external_description')}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSync} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {trans('admin.resources.sync')}
                        </Button>
                    </div>
                </AdminLayoutHeader>

                <AdminLayoutContent>
                    <div className="space-y-6">
                        {/* Filters */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant={typeFilter === 'all' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setTypeFilter('all')}
                                        >
                                            {trans('admin.resources.all')}
                                        </Button>
                                        <Button
                                            variant={typeFilter === 'theme' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setTypeFilter('theme')}
                                        >
                                            <Palette className="h-4 w-4 mr-2" />
                                            {trans('admin.resources.themes')}
                                        </Button>
                                    </div>

                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={trans('admin.resources.search_placeholder')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="pl-10"
                                        />
                                    </div>

                                    <Button onClick={handleSearch}>
                                        {trans('admin.resources.sync')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Banner */}
                        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <CloudDownload className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                                            {trans('admin.resources.info_title')}
                                        </p>
                                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                            {trans('admin.resources.info_description')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resources Grid */}
                        {filteredResources.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        {searchQuery || typeFilter !== 'all'
                                            ? trans('admin.resources.no_results')
                                            : trans('admin.resources.no_resources')
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredResources.map((resource) => {
                                    const installed = isInstalled(resource.slug);

                                    return (
                                        <Card key={resource.id} className={installed ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : ''}>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="p-3 bg-primary/10 rounded-lg">
                                                            {getTypeIcon(resource.type)}
                                                        </div>
                                                        {installed && (
                                                            <Badge className="bg-green-600">
                                                                <Check className="h-3 w-3 mr-1" />
                                                                {trans('admin.resources.installed')}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div>
                                                        <h3 className="font-semibold mb-1">{resource.title}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {resource.description}
                                                        </p>
                                                    </div>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <span>v{resource.version}</span>
                                                        <span>•</span>
                                                        <span>{resource.author.name}</span>
                                                        {resource.pricing_type === 'free' ? (
                                                            <Badge variant="secondary">{trans('admin.resources.free')}</Badge>
                                                        ) : (
                                                            <Badge variant="outline">{resource.price}€</Badge>
                                                        )}
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Download className="h-3 w-3" />
                                                            {resource.downloads}
                                                        </span>
                                                        {resource.rating > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                                {resource.rating.toFixed(1)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => handleInstall(resource.id, resource.type)}
                                                            disabled={installed || installing === resource.id}
                                                        >
                                                            {installing === resource.id ? (
                                                                <>
                                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                                    {trans('admin.resources.installing')}
                                                                </>
                                                            ) : installed ? (
                                                                <>
                                                                    <Check className="h-4 w-4 mr-2" />
                                                                    {trans('admin.resources.installed')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    {trans('admin.resources.install')}
                                                                </>
                                                            )}
                                                        </Button>

                                                        {resource.repository_url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => window.open(resource.repository_url, '_blank')}
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </AdminLayoutContent>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
