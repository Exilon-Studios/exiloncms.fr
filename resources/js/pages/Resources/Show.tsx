import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/types';
import { motion } from 'framer-motion';
import {
    Download,
    Star,
    Eye,
    Calendar,
    User,
    Tag,
    ExternalLink,
    GitBranch,
    Palette,
    DollarSign,
    ShoppingCart,
    MessageSquare,
    ThumbsUp,
    Share2,
    Flag,
    Edit,
    Trash2,
    Package,
} from 'lucide-react';

interface Author {
    id: number;
    name: string;
    avatar?: string;
    is_seller: boolean;
    seller_verified_at?: string;
}

interface Review {
    id: number;
    rating: number;
    comment?: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
}

interface Update {
    id: number;
    version: string;
    title: string;
    description?: string;
    published_at: string;
    downloads: number;
}

interface Resource {
    id: number;
    title: string;
    slug: string;
    description: string;
    content?: string;
    type: 'plugin' | 'theme';
    pricing_type: 'free' | 'paid';
    price: number;
    currency: string;
    version: string;
    download_url: string;
    demo_url?: string;
    repository_url?: string;
    thumbnail?: string;
    screenshots?: string[];
    tags?: string[];
    downloads: number;
    views: number;
    rating: number;
    reviews_count: number;
    created_at: string;
    author: Author;
    reviews?: Review[];
    updates?: Update[];
}

interface Props {
    resource: Resource;
    hasPurchased: boolean;
    canReview: boolean;
    userReview?: Review;
}

function StarRating({ rating, setRating, readonly = false }: { rating: number; setRating?: (rating: number) => void; readonly?: boolean }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => setRating?.(star)}
                    className={`transition-all ${
                        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                    }`}
                >
                    <Star
                        className={`h-5 w-5 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

export default function ResourceShow({ resource, hasPurchased, canReview, userReview }: Props) {
    const [selectedScreenshot, setSelectedScreenshot] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const reviewForm = useForm({
        rating: userReview?.rating || 5,
        comment: userReview?.comment || '',
    });

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (userReview) {
            router.put(route('resources.reviews.update', [resource.slug, userReview.id]), reviewForm.data, {
                onSuccess: () => {
                    reviewForm.reset();
                    setShowReviewForm(false);
                },
            });
        } else {
            router.post(route('resources.reviews.store', resource.slug), reviewForm.data, {
                onSuccess: () => {
                    reviewForm.reset();
                    setShowReviewForm(false);
                },
            });
        }
    };

    const handleDownload = () => {
        if (hasPurchased) {
            window.location.href = route('resources.download', resource.slug);
        } else {
            // Show purchase modal or redirect
            router.post(route('checkout'), { resource_id: resource.id });
        }
    };

    return (
        <>
            <Head title={`${resource.title} - Marketplace`} />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Screenshots Gallery */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="aspect-video rounded-2xl overflow-hidden bg-muted border border-border"
                                >
                                    {resource.screenshots && resource.screenshots.length > 0 ? (
                                        <img
                                            src={`/storage/${resource.screenshots[selectedScreenshot]}`}
                                            alt={`${resource.title} - Screenshot ${selectedScreenshot + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : resource.thumbnail ? (
                                        <img
                                            src={`/storage/${resource.thumbnail}`}
                                            alt={resource.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {resource.type === 'plugin' ? (
                                                <GitBranch className="h-32 w-32 text-primary/20" />
                                            ) : (
                                                <Palette className="h-32 w-32 text-primary/20" />
                                            )}
                                        </div>
                                    )}
                                </motion.div>

                                {/* Thumbnail Navigation */}
                                {resource.screenshots && resource.screenshots.length > 1 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                        {resource.screenshots.map((shot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedScreenshot(index)}
                                                className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                    selectedScreenshot === index
                                                        ? 'border-primary'
                                                        : 'border-transparent'
                                                }`}
                                            >
                                                <img
                                                    src={`/storage/${shot}`}
                                                    alt={`Screenshot ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Info Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    resource.type === 'plugin'
                                                        ? 'bg-blue-500/20 text-blue-500'
                                                        : 'bg-purple-500/20 text-purple-500'
                                                }`}>
                                                    {resource.type === 'plugin' ? (
                                                        <><GitBranch className="h-3 w-3" /> Plugin</>
                                                    ) : (
                                                        <><Palette className="h-3 w-3" /> Thème</>
                                                    )}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    resource.pricing_type === 'free'
                                                        ? 'bg-green-500/20 text-green-500'
                                                        : 'bg-orange-500/20 text-orange-500'
                                                }`}>
                                                    {resource.pricing_type === 'free' ? (
                                                        <><DollarSign className="h-3 w-3" /> Gratuit</>
                                                    ) : (
                                                        <>{resource.price.toFixed(2)} {resource.currency}</>
                                                    )}
                                                </span>
                                            </div>
                                            <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
                                            <p className="text-muted-foreground">{resource.description}</p>
                                        </div>
                                    </div>

                                    {/* Author */}
                                    <Link
                                        href={route('profile', { id: resource.author.id })}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg font-semibold text-primary">
                                                {resource.author.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{resource.author.name}</span>
                                                {resource.author.seller_verified_at && (
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                )}
                                            </div>
                                            <span className="text-sm text-muted-foreground">Développeur vérifié</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleDownload}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
                                    >
                                        {hasPurchased ? (
                                            <><Download className="h-5 w-5" /> Télécharger</>
                                        ) : resource.pricing_type === 'free' ? (
                                            <><Download className="h-5 w-5" /> Télécharger gratuitement</>
                                        ) : (
                                            <><ShoppingCart className="h-5 w-5" /> Acheter pour {resource.price.toFixed(2)} {resource.currency}</>
                                        )}
                                    </button>

                                    <div className="grid grid-cols-2 gap-3">
                                        {resource.demo_url && (
                                            <a
                                                href={resource.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-muted rounded-lg font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" /> Démo
                                            </a>
                                        )}
                                        {resource.repository_url && (
                                            <a
                                                href={resource.repository_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-muted rounded-lg font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                <GitBranch className="h-4 w-4" /> Code source
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-yellow-400">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-lg font-bold">{resource.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{resource.reviews_count} avis</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Download className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-lg font-bold">{resource.downloads}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">téléchargements</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-lg font-bold">{resource.views}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">vues</div>
                                    </div>
                                </div>

                                {/* Version */}
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm text-muted-foreground">Version</span>
                                    <span className="font-semibold">{resource.version}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            {resource.content && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="prose prose-lg max-w-none"
                                >
                                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                                    <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                                </motion.section>
                            )}

                            {/* Tags */}
                            {resource.tags && resource.tags.length > 0 && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Tag className="h-6 w-6" /> Tags
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {resource.tags.map((tag) => (
                                            <Link
                                                key={tag}
                                                href={route('resources.index', { tags: tag })}
                                                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Updates */}
                            {resource.updates && resource.updates.length > 0 && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Package className="h-6 w-6" /> Mises à jour
                                    </h2>
                                    <div className="space-y-4">
                                        {resource.updates.slice(0, 5).map((update) => (
                                            <div key={update.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-2">
                                                            v{update.version}
                                                        </span>
                                                        <h3 className="font-semibold">{update.title}</h3>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(update.published_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                {update.description && (
                                                    <p className="text-sm text-muted-foreground">{update.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Reviews */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <MessageSquare className="h-6 w-6" /> Avis
                                        <span className="text-lg text-muted-foreground font-normal">
                                            ({resource.reviews_count})
                                        </span>
                                    </h2>
                                    {canReview && !showReviewForm && (
                                        <button
                                            onClick={() => setShowReviewForm(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <ThumbsUp className="h-4 w-4" /> Écrire un avis
                                        </button>
                                    )}
                                </div>

                                {/* Review Form */}
                                {showReviewForm && (
                                    <form onSubmit={submitReview} className="mb-8 p-6 rounded-xl bg-muted/50 border border-border">
                                        <h3 className="text-lg font-semibold mb-4">
                                            {userReview ? 'Modifier votre avis' : 'Partagez votre avis'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Note</label>
                                                <StarRating
                                                    rating={reviewForm.data.rating}
                                                    setRating={(rating) => reviewForm.setData('rating', rating)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Commentaire (optionnel)</label>
                                                <textarea
                                                    value={reviewForm.data.comment}
                                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                                    placeholder="Partagez votre expérience avec cette ressource..."
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={reviewForm.processing}
                                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                                                >
                                                    {userReview ? 'Mettre à jour' : 'Publier'} l'avis
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowReviewForm(false)}
                                                    className="px-6 py-3 bg-muted rounded-lg font-semibold hover:bg-muted/80 transition-all"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {resource.reviews && resource.reviews.length > 0 ? (
                                        resource.reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="p-6 rounded-xl bg-muted/50 border border-border"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-lg font-semibold text-primary">
                                                            {review.user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-semibold">{review.user.name}</span>
                                                            <span className="text-sm text-muted-foreground">
                                                                {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </div>
                                                        <StarRating rating={review.rating} readonly />
                                                        {review.comment && (
                                                            <p className="mt-3 text-muted-foreground">{review.comment}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            Aucun avis pour le moment. Soyez le premier à donner votre avis !
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-6 rounded-xl bg-muted/50 border border-border"
                            >
                                <h3 className="font-semibold mb-4">Informations</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Version</span>
                                        <span className="font-medium">{resource.version}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="font-medium capitalize">{resource.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Publié le</span>
                                        <span className="font-medium">
                                            {new Date(resource.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Licence</span>
                                        <span className="font-medium">MIT</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
