import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

/**
 * PreviewBanner - Shared component for theme preview mode
 * Displays a banner when in preview mode with exit link
 */
export default function PreviewBanner() {
    const { trans } = usePage<PageProps>().props;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center font-semibold">
            {trans.theme?.preview?.banner || '🎨 Preview Mode'} -{' '}
            <Link href="/admin/themes/preview/exit" className="underline hover:text-yellow-800">
                {trans.theme?.preview?.exit || 'Exit Preview'}
            </Link>
        </div>
    );
}
