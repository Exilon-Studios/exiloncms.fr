import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import PreviewBanner from '@/components/theme/PreviewBanner';
import PluginFeatures from '@/components/theme/PluginFeatures';

export default function Home() {
    const { auth, settings, enabledPlugins, isPreviewMode } = usePage<PageProps>().props;

    return (
        <>
            <Head title={settings?.name || 'ExilonCMS'} />

            {/* Preview banner */}
            {isPreviewMode && <PreviewBanner />}

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
                    <div className="container mx-auto px-4 py-24 relative">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                                {settings?.name}
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                {settings?.description}
                            </p>
                            <div className="flex gap-4 justify-center">
                                {auth?.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white font-bold py-3 px-8 rounded-lg transition-all"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="container mx-auto px-4 py-16">
                    <PluginFeatures enabledPlugins={enabledPlugins || []} variant="grid" />
                </div>

                {/* Footer */}
                <footer className="border-t border-purple-500/20 mt-16">
                    <div className="container mx-auto px-4 py-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} {settings?.name}. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

Home.layout = (page: React.ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
