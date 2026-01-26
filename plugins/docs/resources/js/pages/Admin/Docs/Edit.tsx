import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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
    content: string;
    excerpt: string | null;
    category_id: number | null;
    parent_id: number | null;
    order: number;
    is_published: boolean;
    icon: string | null;
    version: string | null;
}

interface Props {
    document: Document;
    categories: Category[];
    documents: Document[];
}

export default function EditDocument({ document, categories, documents }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: document.title,
        content: document.content,
        excerpt: document.excerpt || '',
        category_id: document.category_id,
        parent_id: document.parent_id,
        order: document.order,
        is_published: document.is_published,
        icon: document.icon || '',
        version: document.version || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.docs.update', document));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${document.title}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.docs.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Document</h1>
                        <p className="text-sm text-muted-foreground">Update documentation page</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg font-semibold"
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Parent Document</label>
                                <select
                                    value={data.parent_id ?? ''}
                                    onChange={(e) => setData('parent_id', e.target.value ? Number(e.target.value) : null)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                >
                                    <option value="">No parent</option>
                                    {documents.filter(d => d.id !== document.id).map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

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

                        <div>
                            <label className="mb-2 block text-sm font-medium">Content (Markdown)</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={15}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm"
                                required
                            />
                            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                        </div>

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
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
