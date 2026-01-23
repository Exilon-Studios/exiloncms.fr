import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PageProps } from '@/types';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
    Star,
    Eye,
    TrendingUp,
    Package,
    Palette,
    DollarSign,
    GitBranch,
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
    currency: string;
    thumbnail?: string;
    downloads: number;
    views: number;
    rating: number;
    reviews_count: number;
    author: Author;
    created_at: string;
}

interface Props {
    resources: {
        data: Resource[];
        links: any;
        meta: any;
    };
    filters: {
        type: string;
        pricing: string;
        search: string | null;
        sort: string;
        tags: string | null;
    };
}

const RESOURCE_TYPES = [
    { value: 'all', label: 'Tous', icon: Package },
    { value: 'plugin', label: 'Plugins', icon: GitBranch },
    { value: 'theme', label: 'Thèmes', icon: Palette },
];

const PRICING_TYPES = [
    { value: 'all', label: 'Tous les prix' },
    { value: 'free', label: 'Gratuit' },
    { value: 'paid', label: 'Payant' },
];

const SORT_OPTIONS = [
    { value: 'latest', label: 'Plus récents' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'rating', label: 'Mieux notés' },
];

const POPULAR_TAGS = [
    'essentials',
    'pvp',
    'economy',
    'admin',
    'cosmetics',
    'discord',
    'modern',
    'dark',
    'responsive',
];

function ResourceCard({ resource }: { resource: Resource }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all"
        >
            <Link href={route('resources.show', resource.slug)} className="block">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                    {resource.thumbnail ? (
                        <img
                            src={`/storage/${resource.thumbnail}`}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            {resource.type === 'plugin' ? (
                                <GitBranch className="h-16 w-16 text-primary/30" />
                            ) : (
                                <Palette className="h-16 w-16 text-primary/30" />
                            )}
                        </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            resource.type === 'plugin'
                                ? 'bg-blue-500/80 text-white'
                                : 'bg-purple-500/80 text-white'
                        }`}>
                            {resource.type === 'plugin' ? (
                                <><GitBranch className="h-3 w-3" /> Plugin</>
                            ) : (
                                <><Palette className="h-3 w-3" /> Thème</>
                            )}
                        </span>
                    </div>

                    {/* Pricing Badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            resource.pricing_type === 'free'
                                ? 'bg-green-500/80 text-white'
                                : 'bg-orange-500/80 text-white'
                        }`}>
                            {resource.pricing_type === 'free' ? (
                                <><DollarSign className="h-3 w-3" /> Gratuit</>
                            ) : (
                                <>{resource.price.toFixed(2)} {resource.currency}</>
                            )}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {resource.description}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                                {resource.author.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{resource.author.name}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{resource.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{resource.rating.toFixed(1)}</span>
                            <span className="text-xs">({resource.reviews_count})</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{resource.views}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function ResourcesIndex({ resources, filters }: Props) {
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [selectedTags, setSelectedTags] = useState<string[]>(
        filters.tags ? filters.tags.split(',') : []
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();
            if (filters.type !== 'all') params.set('type', filters.type);
            if (filters.pricing !== 'all') params.set('pricing', filters.pricing);
            if (searchInput) params.set('search', searchInput);
            if (filters.sort !== 'latest') params.set('sort', filters.sort);
            if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
            router.get(route('resources.index'), Object.fromEntries(params), {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput, selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams();
        if (key !== 'type' && filters.type !== 'all') params.set('type', filters.type);
        if (key !== 'pricing' && filters.pricing !== 'all') params.set('pricing', filters.pricing);
        if (key !== 'sort' && filters.sort !== 'latest') params.set('sort', filters.sort);
        if (searchInput) params.set('search', searchInput);
        if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
        params.set(key, value);
        router.get(route('resources.index'), Object.fromEntries(params), {
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Marketplace - Ressources" />

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
                    <div className="container mx-auto px-4 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Marketplace ExilonCMS
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Découvrez des plugins et thèmes pour personnaliser votre CMS
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Rechercher des plugins, thèmes..."
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Filters */}
                <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            {/* Type Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Filter className="h-5 w-5 text-muted-foreground" />
                                {RESOURCE_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.value}
                                            onClick={() => updateFilter('type', type.value)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filters.type === type.value
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Pricing & Sort */}
                            <div className="flex flex-wrap items-center gap-2">
                                {PRICING_TYPES.map((pricing) => (
                                    <button
                                        key={pricing.value}
                                        onClick={() => updateFilter('pricing', pricing.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            filters.pricing === pricing.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                    >
                                        {pricing.label}
                                    </button>
                                ))}

                                <select
                                    value={filters.sort}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                    className="px-4 py-2 rounded-lg bg-muted text-sm font-medium border-0 outline-none cursor-pointer"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className="text-sm text-muted-foreground">Tags:</span>
                            {POPULAR_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                        selectedTags.includes(tag)
                                            ? 'bg-primary/20 text-primary border border-primary/50'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="container mx-auto px-4 py-12">
                    {resources.data.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resources.data.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {resources.links && (
                                <div className="flex justify-center mt-12 gap-2">
                                    {resources.links.map((link: any, index: number) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-4 py-2 rounded-lg ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-4 py-2 text-muted-foreground"
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <Package className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Aucune ressource trouvée</h3>
                            <p className="text-muted-foreground">
                                Essayez de modifier vos filtres de recherche
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
