import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, FolderOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Document {
    id: number;
    title: string;
    slug: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    order: number;
    documents: Document[];
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Documentation Categories" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Categories</h1>
                        <p className="text-muted-foreground">Manage documentation categories</p>
                    </div>
                    <Link
                        href={route('admin.docs.categories.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        New Category
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-xl border bg-card overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b bg-muted/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {category.icon && (
                                            <span className="text-4xl">{category.icon}</span>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground font-mono">{category.slug}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {category.description && (
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <FileText className="h-4 w-4" />
                                    <span>{category.documents.length} {category.documents.length === 1 ? 'document' : 'documents'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route('admin.docs.categories.edit', category)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2 hover:bg-accent text-sm"
                                    >
                                        <Edit className="h-3 w-3" />
                                        Edit
                                    </Link>
                                    <button
                                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No categories found</p>
                        <Link
                            href={route('admin.docs.categories.create')}
                            className="inline-flex items-center gap-2 mt-4 text-primary"
                        >
                            <Plus className="h-4 w-4" />
                            Create your first category
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
