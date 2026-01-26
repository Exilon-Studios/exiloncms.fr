import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Power, PowerOff, ExternalLink, Hash } from 'lucide-react';

interface VoteSite {
    id: number;
    name: string;
    url: string;
    vote_url: string;
    priority: number;
    is_enabled: boolean;
    votes_count: number;
}

interface Props {
    sites: VoteSite[];
}

export default function VoteSitesIndex({ sites }: PageProps & Props) {
    const handleToggle = (site: VoteSite) => {
        router.post(
            route('admin.votes.sites.toggle', site),
            {},
            {
                onSuccess: () => {
                    // Success
                },
            }
        );
    };

    const handleDelete = (site: VoteSite) => {
        if (confirm(`Are you sure you want to delete "${site.name}"?`)) {
            router.delete(route('admin.votes.sites.destroy', site));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Vote Sites" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Vote Sites</h1>
                        <p className="text-muted-foreground">
                            Manage voting websites where players can vote for your server
                        </p>
                    </div>
                    <Link
                        href={route('admin.votes.sites.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Site
                    </Link>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Votes</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sites.map((site) => (
                                    <tr key={site.id} className="border-b hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{site.priority}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{site.name}</td>
                                        <td className="max-w-xs truncate px-4 py-3 text-sm text-muted-foreground">
                                            <a
                                                href={site.vote_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:underline"
                                            >
                                                {site.vote_url}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleToggle(site)}
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${
                                                    site.is_enabled
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}
                                            >
                                                {site.is_enabled ? (
                                                    <Power className="h-4 w-4" />
                                                ) : (
                                                    <PowerOff className="h-4 w-4" />
                                                )}
                                                {site.is_enabled ? 'Enabled' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{site.votes_count}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('admin.votes.sites.edit', site)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1 text-sm hover:bg-accent"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(site)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sites.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            No vote sites found. Add your first site to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 rounded-lg border bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                        Setup Instructions
                    </h3>
                    <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Register your server on voting sites (e.g., server-list.net, topg.org)</li>
                        <li>Get your API key/secret from the voting site</li>
                        <li>Add the site here with the API URL and callback URL</li>
                        <li>Set the priority to control the order in the voting list</li>
                    </ol>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
