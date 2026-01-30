import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { PageProps, PluginFeaturesProps } from '@/types';

/**
 * PluginFeatures - Shared component to display enabled plugin features
 * Dynamically shows shop, blog, votes features based on enabled plugins
 */
export default function PluginFeatures({ enabledPlugins, variant = 'grid' }: PluginFeaturesProps) {
    const { trans } = usePage<PageProps>().props;

    const hasShop = enabledPlugins.includes('shop');
    const hasBlog = enabledPlugins.includes('blog');
    const hasVotes = enabledPlugins.includes('votes');

    const features = [];

    if (hasShop) {
        features.push({
            id: 'shop',
            icon: '🛒',
            title: trans.theme?.features?.shop?.title || 'Shop',
            description: trans.theme?.features?.shop?.description || 'Browse our store',
            href: '/shop',
        });
    }

    if (hasBlog) {
        features.push({
            id: 'blog',
            icon: '📝',
            title: trans.theme?.features?.blog?.title || 'Blog',
            description: trans.theme?.features?.blog?.description || 'Latest news',
            href: '/blog',
        });
    }

    if (hasVotes) {
        features.push({
            id: 'votes',
            icon: '⭐',
            title: trans.theme?.features?.votes?.title || 'Vote',
            description: trans.theme?.features?.votes?.description || 'Vote and earn rewards',
            href: '/votes',
        });
    }

    if (features.length === 0) {
        return null;
    }

    if (variant === 'flex') {
        return (
            <div className="flex gap-4 justify-center flex-wrap">
                {features.map((feature) => (
                    <Link
                        key={feature.id}
                        href={feature.href}
                        className="flex items-center gap-2 p-4 border-2 border-gray-200 hover:border-black rounded-lg transition-all hover:shadow-lg"
                    >
                        <span className="text-2xl">{feature.icon}</span>
                        <div className="text-left">
                            <div className="font-bold">{feature.title}</div>
                            <div className="text-sm text-gray-600">{feature.description}</div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
                <Link
                    key={feature.id}
                    href={feature.href}
                    className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </Link>
            ))}
        </div>
    );
}
