import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Home, BookOpen, GitBranch } from 'lucide-react';
import { PageProps } from '@/types';

interface Document {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    icon: string | null;
    version: string | null;
    category: DocumentCategory | null;
    parent: Document | null;
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
    slug: string;
    document: Document;
    categories: DocumentCategory[];
    currentCategory: DocumentCategory | null;
    navigation: Document[];
}

export default function DocsShow({ slug }: { slug: string }) {
    const { url } = usePage<PageProps>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Simulated document data - in real app, this would come from props
    const document = {
        id: 1,
        title: 'Introduction to ExilonCMS',
        slug: 'introduction',
        content: `
# Welcome to ExilonCMS

ExilonCMS is a modern content management system built with Laravel and React.

## Getting Started

### Installation

\`\`\`bash
composer create-project exiloncms/cms
cd cms
npm install
npm run build
php artisan migrate
\`\`\`

### Configuration

Configure your \`.env\` file with your database credentials:

\`\`\`env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=exiloncms
DB_USERNAME=your_username
DB_PASSWORD=your_password
\`\`\`

## Core Concepts

### Plugins

ExilonCMS uses a modular plugin system that allows you to extend functionality:

- **Blog Plugin**: Full-featured blog with categories and tags
- **Shop Plugin**: E-commerce integration
- **Docs Plugin**: Modern documentation system
- **Analytics Plugin**: Track user behavior

### Themes

Customize the appearance with theme templates:

- Blog Theme: Content-focused design
- Gaming Theme: Perfect for gaming servers
- Portfolio Theme: Showcase your work

## Next Steps

- Explore the [Plugin System](/docs/plugins)
- Learn about [Themes](/docs/themes)
- Check the [API Reference](/docs/api)
        `,
        category: { name: 'Getting Started', slug: 'getting-started' },
        version: '1.0.0',
    } as Document;

    const categories: DocumentCategory[] = [
        {
            id: 1,
            name: 'Getting Started',
            slug: 'getting-started',
            icon: '🚀',
            color: 'blue',
            documents: [
                { id: 1, title: 'Introduction', slug: 'introduction' },
                { id: 2, title: 'Installation', slug: 'installation' },
                { id: 3, title: 'Configuration', slug: 'configuration' },
            ],
        },
        {
            id: 2,
            name: 'Core Concepts',
            slug: 'core-concepts',
            icon: '💡',
            color: 'purple',
            documents: [
                { id: 4, title: 'Plugins', slug: 'plugins' },
                { id: 5, title: 'Themes', slug: 'themes' },
                { id: 6, title: 'Architecture', slug: 'architecture' },
            ],
        },
        {
            id: 3,
            name: 'API Reference',
            slug: 'api',
            icon: '🔌',
            color: 'green',
            documents: [
                { id: 7, title: 'Routes', slug: 'routes' },
                { id: 8, title: 'Models', slug: 'models' },
                { id: 9, title: 'Controllers', slug: 'controllers' },
            ],
        },
    ];

    // Convert markdown to HTML (simplified - use a proper markdown parser in production)
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
        <>
            <Head title={`${document.title} - Documentation`} />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-accent"
                            >
                                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <BookOpen className="h-5 w-5" />
                                <span>ExilonCMS Docs</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            {document.version && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <GitBranch className="h-3 w-3" />
                                    v{document.version}
                                </span>
                            )}
                            <Link
                                href="/"
                                className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Home className="h-4 w-4" />
                                Back to Site
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="flex">
                    {/* Sidebar */}
                    <AnimatePresence>
                        {(isSidebarOpen || window.innerWidth >= 1024) && (
                            <motion.aside
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed lg:sticky top-16 left-0 z-40 w-72 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-background p-6"
                            >
                                <nav className="space-y-6">
                                    {categories.map((category) => (
                                        <div key={category.id}>
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: category.id * 0.1 }}
                                            >
                                                <h3 className="flex items-center gap-2 font-semibold mb-3">
                                                    {category.icon && <span>{category.icon}</span>}
                                                    {category.name}
                                                </h3>
                                                <ul className="space-y-1 ml-4">
                                                    {category.documents.map((doc, index) => (
                                                        <motion.li
                                                            key={doc.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            <Link
                                                                href={`/docs/${doc.slug}`}
                                                                className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
                                                                    doc.slug === slug
                                                                        ? 'bg-primary text-primary-foreground font-medium'
                                                                        : 'hover:bg-accent'
                                                                }`}
                                                            >
                                                                <ChevronRight className="h-3 w-3 shrink-0" />
                                                                <span>{doc.title}</span>
                                                            </Link>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        </div>
                                    ))}
                                </nav>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Overlay for mobile */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                            />
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-4xl mx-auto px-4 py-8 lg:px-8 lg:py-12"
                        >
                            {/* Breadcrumb */}
                            {document.category && (
                                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                    <Link href="/docs" className="hover:text-foreground">
                                        Docs
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <Link
                                        href={`/docs/category/${document.category.slug}`}
                                        className="hover:text-foreground"
                                    >
                                        {document.category.name}
                                    </Link>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="text-foreground">{document.title}</span>
                                </nav>
                            )}

                            {/* Title */}
                            <header className="mb-8">
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl font-bold mb-4"
                                >
                                    {document.title}
                                </motion.h1>
                                {document.excerpt && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-xl text-muted-foreground"
                                    >
                                        {document.excerpt}
                                    </motion.p>
                                )}
                            </header>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: renderContent(document.content) }}
                            />

                            {/* Navigation */}
                            <motion.nav
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-12 pt-8 border-t flex justify-between"
                            >
                                <Link
                                    href="/docs/installation"
                                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    <span>Installation</span>
                                </Link>
                                <Link
                                    href="/docs/plugins"
                                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span>Plugins</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </motion.nav>
                        </motion.article>
                    </main>

                    {/* Table of Contents (Desktop) */}
                    <aside className="hidden xl:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="py-8 px-4">
                            <h4 className="font-semibold mb-4 text-sm">On this page</h4>
                            <nav className="space-y-2 text-sm">
                                <a href="#getting-started" className="block text-muted-foreground hover:text-foreground transition-colors">
                                    Getting Started
                                </a>
                                <a href="#installation" className="block text-muted-foreground hover:text-foreground transition-colors">
                                    Installation
                                </a>
                                <a href="#configuration" className="block text-muted-foreground hover:text-foreground transition-colors">
                                    Configuration
                                </a>
                                <a href="#core-concepts" className="block text-muted-foreground hover:text-foreground transition-colors">
                                    Core Concepts
                                </a>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
