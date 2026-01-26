import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, FileText, FolderOpen, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    icon: string | null;
    is_published: boolean;
    category: DocumentCategory | null;
    children: Document[];
}

interface DocumentCategory {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    documents: Document[];
}

interface Props {
    categories: DocumentCategory[];
    documents: Document[];
}

export default function DocsIndex({ categories, documents }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.documents.some(doc =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <AuthenticatedLayout>
            <Head title="Documentation" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Documentation</h1>
                    <p className="text-muted-foreground">Manage your documentation content</p>
                </div>

                {/* Actions Bar */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.docs.categories.index')}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <FolderOpen className="h-4 w-4" />
                            Categories
                        </Link>
                        <Link
                            href={route('admin.docs.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            New Document
                        </Link>
                    </div>
                </div>

                {/* Categories and Documents */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredCategories.map((category) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-lg border bg-card overflow-hidden"
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {category.icon && (
                                            <span className="text-2xl">{category.icon}</span>
                                        )}
                                        <div>
                                            <h3 className="font-semibold">{category.name}</h3>
                                            {category.description && (
                                                <p className="text-sm text-muted-foreground">{category.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expandedCategories.has(category.id) ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </motion.div>
                                </button>

                                {/* Documents List */}
                                <AnimatePresence>
                                    {expandedCategories.has(category.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t divide-y overflow-hidden"
                                        >
                                            {category.documents.map((doc) => (
                                                <motion.div
                                                    key={doc.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className={`h-4 w-4 ${doc.is_published ? 'text-green-600' : 'text-gray-400'}`} />
                                                        <div>
                                                            <p className="font-medium">{doc.title}</p>
                                                            {doc.excerpt && (
                                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                                    {doc.excerpt}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('admin.docs.show', doc)}
                                                            className="p-2 rounded-lg hover:bg-accent"
                                                            title="View"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.docs.edit', doc)}
                                                            className="p-2 rounded-lg hover:bg-accent"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p>No documents found</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
