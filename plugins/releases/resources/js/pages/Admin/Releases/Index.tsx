import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Tag, Calendar, Eye, EyeOff, Rocket, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReleaseChange {
    id: number;
    category: 'feature' | 'fix' | 'change' | 'breaking' | 'performance' | 'security';
    description: string;
    breaking: boolean;
}

interface Release {
    id: number;
    version: string;
    title: string;
    description: string | null;
    type: 'major' | 'minor' | 'patch' | 'prerelease';
    status: 'draft' | 'published';
    published_at: string | null;
    changes: ReleaseChange[];
    user: {
        name: string;
    };
}

interface Props {
    releases: {
        data: Release[];
        links: any;
    };
}

const categoryConfig = {
    feature: { icon: '✨', label: 'Features', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
    fix: { icon: '🐛', label: 'Bug Fixes', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' },
    change: { icon: '🔄', label: 'Changes', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
    breaking: { icon: '💥', label: 'Breaking', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
    performance: { icon: '⚡', label: 'Performance', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
    security: { icon: '🔒', label: 'Security', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
};

const typeConfig = {
    major: { icon: Rocket, label: 'Major', color: 'text-red-600' },
    minor: { icon: Zap, label: 'Minor', color: 'text-blue-600' },
    patch: { icon: Tag, label: 'Patch', color: 'text-green-600' },
    prerelease: { icon: AlertTriangle, label: 'Pre-release', color: 'text-orange-600' },
};

export default function ReleasesIndex({ releases }: Props) {
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

    return (
        <AuthenticatedLayout>
            <Head title="Release Notes" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Release Notes</h1>
                        <p className="text-muted-foreground">Manage changelog and releases</p>
                    </div>
                    <Link
                        href={route('admin.releases.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        New Release
                    </Link>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-8">
                        {releases.data.map((release, index) => {
                            const TypeIcon = typeConfig[release.type].icon;
                            const isExpanded = selectedRelease?.id === release.id;

                            return (
                                <motion.div
                                    key={release.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-20"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-6 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>

                                    {/* Release Card */}
                                    <div className="rounded-lg border bg-card overflow-hidden">
                                        {/* Header */}
                                        <button
                                            onClick={() => setSelectedRelease(isExpanded ? null : release)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${typeConfig[release.type].color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                                                    <TypeIcon className="h-5 w-5" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-semibold">v{release.version}</h3>
                                                        <span className={`text-sm ${typeConfig[release.type].color}`}>
                                                            {typeConfig[release.type].label}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            {release.status === 'published' ? (
                                                                <>
                                                                    <Eye className="h-3 w-3" />
                                                                    Published
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <EyeOff className="h-3 w-3" />
                                                                    Draft
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{release.title}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {release.published_at && (
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(release.published_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        {/* Changes */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t divide-y"
                                                >
                                                    {/* Categories */}
                                                    {Object.entries(
                                                        release.changes.reduce((acc, change) => {
                                                            if (!acc[change.category]) acc[change.category] = [];
                                                            acc[change.category].push(change);
                                                            return acc;
                                                        }, {} as Record<string, ReleaseChange[]>)
                                                    ).map(([category, changes]) => {
                                                        const config = categoryConfig[category as keyof typeof categoryConfig];
                                                        return (
                                                            <div key={category} className="p-6">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className="text-lg">{config.icon}</span>
                                                                    <h4 className={`font-semibold ${config.color}`}>{config.label}</h4>
                                                                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                                                        {changes.length}
                                                                    </span>
                                                                </div>
                                                                <ul className="space-y-2 ml-7">
                                                                    {changes.map((change) => (
                                                                        <li key={change.id} className="flex items-start gap-2">
                                                                            {change.breaking && (
                                                                                <span className="text-orange-600">💥</span>
                                                                            )}
                                                                            <span className={change.breaking ? 'text-orange-600 font-medium' : ''}>
                                                                                {change.description}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Actions */}
                                        <div className="border-t px-6 py-3 bg-muted/30 flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {release.changes.length} changes • by {release.user.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('admin.releases.show', release)}
                                                    className="p-2 rounded-lg hover:bg-accent"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.releases.edit', release)}
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
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
