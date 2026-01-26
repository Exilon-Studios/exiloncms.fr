import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Rocket, Zap, Rss, Filter } from 'lucide-react';

interface ReleaseChange {
    category: 'feature' | 'fix' | 'change' | 'breaking' | 'performance' | 'security';
    description: string;
    breaking: boolean;
}

interface Release {
    id: number;
    version: string;
    title: string;
    description: string | null;
    content: string;
    type: 'major' | 'minor' | 'patch' | 'prerelease';
    published_at: string;
    changes: ReleaseChange[];
}

// Simulated data - in real app, this comes from props
const releasesData: Release[] = [
    {
        id: 1,
        version: '1.5.0',
        title: 'Major Release - Documentation Plugin',
        description: 'Introducing the new documentation plugin with modern UI',
        content: '# What\'s New\n\n## Features\n\n- New Documentation plugin\n- Release notes management\n- Improved plugin system',
        type: 'minor',
        published_at: '2025-01-26T10:00:00Z',
        changes: [
            { category: 'feature', description: 'Added Documentation plugin with animated sidebar', breaking: false },
            { category: 'feature', description: 'Added Release Notes plugin', breaking: false },
            { category: 'feature', description: 'Added ExilonCLI for plugin development', breaking: false },
            { category: 'fix', description: 'Fixed migration conflicts in plugins', breaking: false },
        ],
    },
    {
        id: 2,
        version: '1.4.2',
        title: 'Bug Fixes and Improvements',
        description: 'Various bug fixes and performance improvements',
        content: '# Bug Fixes\n\n- Fixed plugin loading issues\n- Improved performance',
        type: 'patch',
        published_at: '2025-01-25T10:00:00Z',
        changes: [
            { category: 'fix', description: 'Fixed plugin auto-discovery', breaking: false },
            { category: 'performance', description: 'Optimized database queries', breaking: false },
            { category: 'change', description: 'Updated dependencies', breaking: false },
        ],
    },
];

const categoryConfig = {
    feature: { icon: '✨', label: 'Features', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' },
    fix: { icon: '🐛', label: 'Bug Fixes', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' },
    change: { icon: '🔄', label: 'Changes', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' },
    breaking: { icon: '💥', label: 'Breaking', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800' },
    performance: { icon: '⚡', label: 'Performance', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800' },
    security: { icon: '🔒', label: 'Security', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' },
};

const typeConfig = {
    major: { icon: Rocket, label: 'Major', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    minor: { icon: Zap, label: 'Minor', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    patch: { icon: ChevronRight, label: 'Patch', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    prerelease: { icon: ChevronRight, label: 'Pre-release', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};

export default function ReleasesIndex() {
    const [expandedRelease, setExpandedRelease] = useState<number | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    const filteredReleases = releasesData;

    return (
        <>
            <Head title="Release Notes" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Rocket className="h-12 w-12 text-primary" />
                                <h1 className="text-4xl font-bold">Release Notes</h1>
                            </div>
                            <p className="text-xl text-muted-foreground">
                                Stay up to date with the latest features, improvements, and bug fixes.
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <a
                                    href="/releases/feed/rss"
                                    className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                                >
                                    <Rss className="h-4 w-4" />
                                    RSS Feed
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            <button
                                onClick={() => setFilterCategory(null)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                    filterCategory === null
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                }`}
                            >
                                All
                            </button>
                            {Object.entries(categoryConfig).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterCategory(filterCategory === key ? null : key)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                                        filterCategory === key
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}
                                >
                                    <span>{config.icon}</span>
                                    {config.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

                            <div className="space-y-12">
                                {filteredReleases.map((release, index) => {
                                    const TypeIcon = typeConfig[release.type].icon;
                                    const isExpanded = expandedRelease === release.id;

                                    return (
                                        <motion.div
                                            key={release.id}
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-20"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute left-6 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                            </div>

                                            {/* Date Badge */}
                                            <div className="absolute left-20 -top-3">
                                                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                                    {new Date(release.published_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Release Card */}
                                            <div className="mt-6 rounded-xl border bg-card overflow-hidden shadow-sm">
                                                {/* Header */}
                                                <button
                                                    onClick={() => setExpandedRelease(isExpanded ? null : release.id)}
                                                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${typeConfig[release.type].color}`}>
                                                            <TypeIcon className="h-4 w-4" />
                                                            {release.type}
                                                        </span>
                                                        <div className="text-left">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-2xl font-bold">v{release.version}</h3>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1">{release.title}</p>
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                    </motion.div>
                                                </button>

                                                {/* Expanded Content */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="border-t overflow-hidden"
                                                        >
                                                            <div className="p-6">
                                                                {release.description && (
                                                                    <p className="text-muted-foreground mb-6">
                                                                        {release.description}
                                                                    </p>
                                                                )}

                                                                {/* Changes by Category */}
                                                                {Object.entries(
                                                                    release.changes.reduce((acc, change) => {
                                                                        if (!acc[change.category]) acc[change.category] = [];
                                                                        acc[change.category].push(change);
                                                                        return acc;
                                                                    }, {} as Record<string, ReleaseChange[]>)
                                                                ).map(([category, changes]) => {
                                                                    const config = categoryConfig[category as keyof typeof categoryConfig];
                                                                    return (
                                                                        <div key={category} className={`mb-4 p-4 rounded-lg border ${config.bg}`}>
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <span className="text-xl">{config.icon}</span>
                                                                                <h4 className={`font-semibold ${config.color}`}>
                                                                                    {config.label}
                                                                                </h4>
                                                                                <span className="text-xs bg-white dark:bg-black/20 px-2 py-1 rounded-full">
                                                                                    {changes.length} {changes.length === 1 ? 'change' : 'changes'}
                                                                                </span>
                                                                            </div>
                                                                            <ul className="space-y-2 ml-8">
                                                                                {changes.map((change, idx) => (
                                                                                    <li key={idx} className="flex items-start gap-2">
                                                                                        {change.breaking && (
                                                                                            <span className="text-orange-600 dark:text-orange-400 mt-0.5">
                                                                                                💥
                                                                                            </span>
                                                                                        )}
                                                                                        <span className={change.breaking ? 'text-orange-600 dark:text-orange-400 font-medium' : ''}>
                                                                                            {change.description}
                                                                                        </span>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
