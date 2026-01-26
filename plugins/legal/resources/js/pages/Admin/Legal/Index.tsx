import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, FileText, Shield, Cookie, RefreshCw, Edit, Globe } from 'lucide-react';

interface LegalPage {
    id: number;
    type: 'privacy' | 'terms' | 'cookies' | 'refund';
    locale: string;
    title: string;
    is_enabled: boolean;
    updated_at: string;
}

interface Props {
    pages: LegalPage[];
    locale: string;
    availableLocales: string[];
}

const pageTypes = [
    { type: 'privacy', label: 'Privacy Policy', icon: Shield, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' },
    { type: 'terms', label: 'Terms of Service', icon: FileText, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20' },
    { type: 'cookies', label: 'Cookie Policy', icon: Cookie, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20' },
    { type: 'refund', label: 'Refund Policy', icon: RefreshCw, color: 'text-green-600 bg-green-100 dark:bg-green-900/20' },
];

export default function LegalIndex({ pages, locale, availableLocales }: PageProps & Props) {
    const [selectedLocale, setSelectedLocale] = useState(locale);

    const handleLocaleChange = (newLocale: string) => {
        router.get(route('admin.legal.index'), { locale: newLocale }, { preserveState: true });
        setSelectedLocale(newLocale);
    };

    const handleCreateDefault = (type: string) => {
        router.post(
            route('admin.legal.create-default'),
            { type, locale: selectedLocale },
            {
                onSuccess: () => {
                    // Success
                },
            }
        );
    };

    const pagesByType = pages.reduce((acc, page) => {
        acc[page.type] = page;
        return acc;
    }, {} as Record<string, LegalPage>);

    return (
        <AuthenticatedLayout>
            <Head title="Legal Pages" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Legal Pages</h1>
                        <p className="text-muted-foreground">
                            Manage GDPR-compliant legal pages for your website
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <select
                            value={selectedLocale}
                            onChange={(e) => handleLocaleChange(e.target.value)}
                            className="rounded-lg border border-input bg-background px-4 py-2"
                        >
                            {availableLocales.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {pageTypes.map((pageType) => {
                        const Icon = pageType.icon;
                        const page = pagesByType[pageType.type];

                        return (
                            <div
                                key={pageType.type}
                                className="relative rounded-lg border bg-card p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className={`inline-flex rounded-lg p-3 ${pageType.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    {page?.is_enabled ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            Published
                                        </span>
                                    ) : page ? (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                                            Draft
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                            Missing
                                        </span>
                                    )}
                                </div>

                                <h3 className="mb-2 text-xl font-bold">{pageType.label}</h3>

                                {page ? (
                                    <>
                                        <p className="mb-1 text-sm text-muted-foreground">{page.title}</p>
                                        <p className="mb-4 text-xs text-muted-foreground">
                                            Last updated: {new Date(page.updated_at).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('legal.show', pageType.type)}
                                                target="_blank"
                                                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
                                            >
                                                <Globe className="h-4 w-4" />
                                                View
                                            </Link>
                                            <Link
                                                href={route('admin.legal.edit', page)}
                                                className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            This legal page has not been created yet.
                                        </p>
                                        <button
                                            onClick={() => handleCreateDefault(pageType.type)}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Create Default Page
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-lg border bg-blue-50 p-6 dark:bg-blue-900/20">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                        <Shield className="h-5 w-5" />
                        GDPR Compliance
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <li>• Ensure all legal pages are published before launching your website</li>
                        <li>• Customize the default content to match your specific requirements</li>
                        <li>• Include your contact information in all legal pages</li>
                        <li>• Review and update legal pages regularly</li>
                        <li>• Consider consulting a legal professional for your specific jurisdiction</li>
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
