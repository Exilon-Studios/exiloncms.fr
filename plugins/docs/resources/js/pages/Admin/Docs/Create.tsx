import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Document {
    id: number;
    title: string;
    slug: string;
}

interface Props {
    categories: Category[];
    documents: Document[];
}

export default function CreateDocument({ categories, documents }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        category_id: null as number | null,
        parent_id: null as number | null,
        order: 0,
        is_published: true,
        icon: '',
        version: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.docs.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Document" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.docs.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">New Document</h1>
                        <p className="text-sm text-muted-foreground">Create a new documentation page</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg font-semibold"
                                placeholder="Enter document title..."
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">Category</label>
                                <select
                                    value={data.category_id ?? ''}
                                    onChange={(e) => setData('category_id', e.target.value ? Number(e.target.value) : null)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                >
                                    <option value="">No category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Parent */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">Parent Document</label>
                                <select
                                    value={data.parent_id ?? ''}
                                    onChange={(e) => setData('parent_id', e.target.value ? Number(e.target.value) : null)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                >
                                    <option value="">No parent</option>
                                    {documents.map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.parent_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.parent_id}</p>
                                )}
                            </div>

                            {/* Order */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">Order</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData('order', Number(e.target.value))}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                />
                            </div>

                            {/* Version */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">Version</label>
                                <input
                                    type="text"
                                    value={data.version}
                                    onChange={(e) => setData('version', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    placeholder="e.g., 1.0.0"
                                />
                            </div>
                        </div>

                        {/* Icon */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Icon (Emoji)</label>
                            <input
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="e.g., 📚"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Excerpt</label>
                            <textarea
                                value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="Brief description..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Content (Markdown)</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={15}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm"
                                placeholder="# Your content here..."
                                required
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                            )}
                        </div>

                        {/* Published */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            <label htmlFor="is_published" className="text-sm font-medium">
                                Published
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Link
                                href={route('admin.docs.index')}
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
                                Save Document
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
