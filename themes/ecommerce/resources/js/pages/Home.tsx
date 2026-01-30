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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to {settings?.name}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {settings?.description}
                        </p>
                    </div>

                    {/* Dynamic Plugin Features */}
                    <div className="container mx-auto px-4 py-16">
                        <PluginFeatures enabledPlugins={enabledPlugins || []} variant="grid" />
                    </div>

                    {/* CTA Section */}
                    {!auth?.user && (
                        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
                            <p className="text-gray-600 mb-6">Create an account to get started</p>
                            <div className="flex gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-all"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-white border-t mt-16">
                    <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                        <p>&copy; {new Date().getFullYear()} {settings?.name}. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

Home.layout = (page: React.ReactNode) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;
