import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface VoteSite {
    id: number;
    name: string;
    url: string;
    vote_url: string;
    vote_key: string;
    priority: number;
    is_enabled: boolean;
}

interface Props {
    site: VoteSite;
}

export default function EditVoteSite({ site }: PageProps & Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: site.name,
        url: site.url,
        vote_url: site.vote_url,
        vote_key: site.vote_key,
        priority: site.priority,
        is_enabled: site.is_enabled,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.votes.sites.update', site));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${site.name}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.votes.sites.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Vote Site</h1>
                        <p className="text-sm text-muted-foreground">
                            Update voting website configuration
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                Site Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="e.g., Server List.net"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="url" className="mb-2 block text-sm font-medium">
                                API URL
                            </label>
                            <input
                                id="url"
                                type="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="https://server-list.net/api"
                                required
                            />
                            {errors.url && (
                                <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                The API endpoint for verifying votes
                            </p>
                        </div>

                        <div>
                            <label htmlFor="vote_url" className="mb-2 block text-sm font-medium">
                                Vote URL
                            </label>
                            <input
                                id="vote_url"
                                type="url"
                                value={data.vote_url}
                                onChange={(e) => setData('vote_url', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="https://server-list.net/vote/your-server"
                                required
                            />
                            {errors.vote_url && (
                                <p className="mt-1 text-sm text-red-600">{errors.vote_url}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                The URL where users will be redirected to vote
                            </p>
                        </div>

                        <div>
                            <label htmlFor="vote_key" className="mb-2 block text-sm font-medium">
                                API Key
                            </label>
                            <input
                                id="vote_key"
                                type="text"
                                value={data.vote_key}
                                onChange={(e) => setData('vote_key', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="Your API key from the voting site"
                                required
                            />
                            {errors.vote_key && (
                                <p className="mt-1 text-sm text-red-600">{errors.vote_key}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="priority" className="mb-2 block text-sm font-medium">
                                Priority
                            </label>
                            <input
                                id="priority"
                                type="number"
                                min="0"
                                max="999"
                                value={data.priority}
                                onChange={(e) => setData('priority', parseInt(e.target.value) || 0)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            />
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                Lower numbers appear first in the voting list
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="is_enabled"
                                type="checkbox"
                                checked={data.is_enabled}
                                onChange={(e) => setData('is_enabled', e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            <label htmlFor="is_enabled" className="text-sm font-medium">
                                Enable this site
                            </label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link
                                href={route('admin.votes.sites.index')}
                                className="rounded-lg border border-input px-4 py-2 hover:bg-accent"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
