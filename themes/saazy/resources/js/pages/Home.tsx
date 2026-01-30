import { Head, usePage } from '@inertiajs/react';
import HeroSaazy from '@/components/HeroSaazy';
import { PageProps, ServerStatus } from '@/types';
import PreviewBanner from '@/components/theme/PreviewBanner';
import PluginFeatures from '@/components/theme/PluginFeatures';

interface Props {
    siteName?: string;
    servers: ServerStatus[];
    posts: any[];
    settings?: {
        description?: string;
        logo?: string;
        background?: string;
    };
    enabledPlugins?: string[];
    isPreviewMode?: boolean;
}

export default function ThemeHome({ siteName, servers, posts, settings, enabledPlugins = [], isPreviewMode = false }: Props) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title={siteName || 'ExilonCMS'} />

            {/* Preview banner */}
            {isPreviewMode && <PreviewBanner />}

            {/* Hero Saazy Component with all sections */}
            <HeroSaazy
                siteName={siteName}
                servers={servers}
                showCustomizationNote={true}
            />

            {/* Dynamic Plugin Features */}
            <div className="container mx-auto px-4 py-12">
                <PluginFeatures enabledPlugins={enabledPlugins} variant="grid" />
            </div>
        </>
    );
}
