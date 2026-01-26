import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    locales: string[];
    groups: string[];
}

export default function CreateTranslation({ locales, groups }: PageProps & Props) {
    const { data, setData, post, processing, errors } = useForm({
        locale: 'en',
        group: 'messages',
        key: '',
        value: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.translations.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Translation" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.translations.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Add Translation</h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new translation key
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="locale" className="mb-2 block text-sm font-medium">
                                    Language
                                </label>
                                <select
                                    id="locale"
                                    value={data.locale}
                                    onChange={(e) => setData('locale', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    required
                                >
                                    {locales.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {errors.locale && (
                                    <p className="mt-1 text-sm text-red-600">{errors.locale}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="group" className="mb-2 block text-sm font-medium">
                                    Group
                                </label>
                                <select
                                    id="group"
                                    value={data.group}
                                    onChange={(e) => setData('group', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    required
                                >
                                    {groups.map((grp) => (
                                        <option key={grp} value={grp}>
                                            {grp}
                                        </option>
                                    ))}
                                </select>
                                {errors.group && (
                                    <p className="mt-1 text-sm text-red-600">{errors.group}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="key" className="mb-2 block text-sm font-medium">
                                Translation Key
                            </label>
                            <input
                                id="key"
                                type="text"
                                value={data.key}
                                onChange={(e) => setData('key', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2 font-mono"
                                placeholder="e.g., messages.welcome"
                                required
                            />
                            {errors.key && (
                                <p className="mt-1 text-sm text-red-600">{errors.key}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                Use dot notation for nested keys (e.g., messages.welcome)
                            </p>
                        </div>

                        <div>
                            <label htmlFor="value" className="mb-2 block text-sm font-medium">
                                Translation Value
                            </label>
                            <textarea
                                id="value"
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                                rows={4}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="Enter the translated text..."
                                required
                            />
                            {errors.value && (
                                <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link
                                href={route('admin.translations.index')}
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
                                Create Translation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
