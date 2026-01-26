import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, FileText, Calendar, User, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface User {
    name: string;
}

interface Parent {
    id: number;
    title: string;
}

interface Document {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category: Category | null;
    parent: Parent | null;
    icon: string | null;
    version: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    user: User;
}

interface Props {
    document: Document;
}

export default function ShowDocument({ document }: Props) {
    // Convert markdown to HTML (simplified - use proper markdown parser in production)
    const renderContent = (content: string) => {
        return content
            .replace(/^### (.*$)/gm, '<h3 className="text-xl font-semibold mt-8 mb-4">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 className="text-2xl font-bold mt-8 mb-4">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 className="text-3xl font-bold mt-8 mb-4">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`{3}([\s\S]*?)`{3}/g, '<pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code className="bg-muted px-2 py-1 rounded text-sm">$1</code>')
            .replace(/\n\n/g, '</p><p className="my-4 leading-relaxed">')
            .replace(/^(?!<)/gm, '<p className="my-4 leading-relaxed">')
            .replace(/$/gm, '</p>');
    };

    return (
        <AuthenticatedLayout>
            <Head title={document.title} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.docs.index')}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{document.title}</h1>
                            <p className="text-sm text-muted-foreground">Document details</p>
                        </div>
                    </div>
                    <Link
                        href={route('admin.docs.edit', document)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Link>
                </div>

                {/* Document Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Metadata Card */}
                    <div className="rounded-xl border bg-card p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Status</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Eye className={`h-4 w-4 ${document.is_published ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span className="font-medium">
                                        {document.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            {document.category && (
                                <div>
                                    <label className="text-sm text-muted-foreground">Category</label>
                                    <p className="font-medium mt-1">{document.category.name}</p>
                                </div>
                            )}
                            {document.parent && (
                                <div>
                                    <label className="text-sm text-muted-foreground">Parent</label>
                                    <p className="font-medium mt-1">{document.parent.title}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm text-muted-foreground">Slug</label>
                                <p className="font-medium mt-1 font-mono text-sm">{document.slug}</p>
                            </div>
                            {document.version && (
                                <div>
                                    <label className="text-sm text-muted-foreground">Version</label>
                                    <p className="font-medium mt-1">v{document.version}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm text-muted-foreground">Author</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{document.user.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="border-b px-6 py-4 bg-muted/30">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Content Preview
                            </h2>
                        </div>
                        <div className="p-8">
                            {document.icon && (
                                <div className="text-6xl mb-4">{document.icon}</div>
                            )}
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: renderContent(document.content) }}
                            />
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(document.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>Last updated: {new Date(document.updated_at).toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
