import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Power, PowerOff, Eye } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface PageData {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    is_enabled: boolean;
    created_at: string;
    user: User;
    roles: Role[];
}

interface Props {
    pages: {
        data: PageData[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number;
        to: number;
        total: number;
    };
}

export default function PagesIndex({ pages }: PageProps & Props) {
    const handleToggle = (page: PageData) => {
        router.post(
            route('admin.pages.toggle', page.slug),
            {},
            {
                onSuccess: () => {
                    // Success
                },
            }
        );
    };

    const handleDelete = (page: PageData) => {
        if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
            router.delete(route('admin.pages.destroy', page.slug));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pages" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Pages</h1>
                        <p className="text-muted-foreground">
                            Manage static pages for your website
                        </p>
                    </div>
                    <Link
                        href={route('admin.pages.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        New Page
                    </Link>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Author</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Roles</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.data.map((page) => (
                                    <tr key={page.id} className="border-b hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{page.title}</p>
                                                {page.excerpt && (
                                                    <p className="max-w-md truncate text-xs text-muted-foreground">
                                                        {page.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                                            /{page.slug}
                                        </td>
                                        <td className="px-4 py-3 text-sm">{page.user.name}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleToggle(page)}
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${
                                                    page.is_enabled
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}
                                            >
                                                {page.is_enabled ? (
                                                    <Power className="h-4 w-4" />
                                                ) : (
                                                    <PowerOff className="h-4 w-4" />
                                                )}
                                                {page.is_enabled ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {page.roles.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {page.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Public</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('pages.show', page.slug)}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1 text-sm hover:bg-accent"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.pages.edit', page.slug)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1 text-sm hover:bg-accent"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(page)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pages.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            No pages found. Create your first page to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pages.links && pages.links.length > 0 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Showing {pages.from} to {pages.to} of {pages.total} results
                            </span>
                            <div className="flex gap-2">
                                {pages.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`rounded-lg px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
