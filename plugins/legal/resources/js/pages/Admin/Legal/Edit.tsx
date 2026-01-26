import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Save, Eye, Globe } from 'lucide-js';

interface LegalPage {
    id: number;
    type: 'privacy' | 'terms' | 'cookies' | 'refund';
    locale: string;
    title: string;
    content: string;
    is_enabled: boolean;
}

interface Props {
    page: LegalPage;
    availableLocales: string[];
}

// Simple WYSIWYG editor component
function SimpleEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const [isHtmlMode, setIsHtmlMode] = useState(false);

    return (
        <div className="rounded-lg border border-input">
            <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => onChange(value + '<h2>Heading</h2>')}
                        className="rounded px-2 py-1 text-sm hover:bg-accent"
                        title="Heading"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange(value + '<p>Paragraph</p>')}
                        className="rounded px-2 py-1 text-sm hover:bg-accent"
                        title="Paragraph"
                    >
                        P
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange(value + '<ul><li>List item</li></ul>')}
                        className="rounded px-2 py-1 text-sm hover:bg-accent"
                        title="Bullet List"
                    >
                        •
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange(value + '<a href="#">Link</a>')}
                        className="rounded px-2 py-1 text-sm hover:bg-accent"
                        title="Link"
                    >
                        🔗
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setIsHtmlMode(!isHtmlMode)}
                    className="rounded px-2 py-1 text-xs hover:bg-accent"
                >
                    {isHtmlMode ? 'Visual' : 'HTML'}
                </button>
            </div>
            {isHtmlMode ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-[400px] w-full rounded-b-lg border-0 bg-background p-4 font-mono text-sm focus:ring-0"
                />
            ) : (
                <div
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                        const target = e.target as HTMLDivElement;
                        onChange(target.innerHTML);
                    }}
                    className="min-h-[400px] w-full rounded-b-lg border-0 bg-background p-4 focus:ring-0"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            )}
        </div>
    );
}

export default function LegalEdit({ page, availableLocales }: PageProps & Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        content: page.content,
        is_enabled: page.is_enabled,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.legal.update', page));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${page.title}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.legal.index')}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Edit {page.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Locale: {page.locale.toUpperCase()} • Type: {page.type}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('legal.show', page.type)}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="mb-2 block text-sm font-medium">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-4 py-2"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Content
                        </label>
                        <SimpleEditor
                            value={data.content}
                            onChange={(value) => setData('content', value)}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                        )}
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
                            Published (visible on website)
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link
                            href={route('admin.legal.index')}
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
        </AuthenticatedLayout>
    );
}
