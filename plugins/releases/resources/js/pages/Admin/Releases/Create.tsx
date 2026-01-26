import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, X, Rocket, Zap, AlertTriangle, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    categories: string[];
}

export default function CreateRelease({}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        version: '',
        title: '',
        description: '',
        content: '',
        type: 'patch' as 'major' | 'minor' | 'patch' | 'prerelease',
        status: 'draft' as 'draft' | 'published',
        published_at: '',
        github_tag: '',
        download_url: '',
        changes: [] as Array<{
            category: 'feature' | 'fix' | 'change' | 'breaking' | 'performance' | 'security';
            description: string;
            breaking: boolean;
        }>,
    });

    const [newChange, setNewChange] = useState({
        category: 'feature' as 'feature' | 'fix' | 'change' | 'breaking' | 'performance' | 'security',
        description: '',
        breaking: false,
    });

    const addChange = () => {
        if (newChange.description.trim()) {
            setData('changes', [...data.changes, { ...newChange }]);
            setNewChange({ category: 'feature', description: '', breaking: false });
        }
    };

    const removeChange = (index: number) => {
        setData('changes', data.changes.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.releases.store'));
    };

    const categoryConfig = {
        feature: { icon: '✨', label: 'Feature', color: 'text-green-600' },
        fix: { icon: '🐛', label: 'Bug Fix', color: 'text-red-600' },
        change: { icon: '🔄', label: 'Change', color: 'text-blue-600' },
        breaking: { icon: '💥', label: 'Breaking', color: 'text-orange-600' },
        performance: { icon: '⚡', label: 'Performance', color: 'text-purple-600' },
        security: { icon: '🔒', label: 'Security', color: 'text-amber-600' },
    };

    const typeConfig = {
        major: { icon: Rocket, label: 'Major', color: 'border-red-500', hover: 'hover:bg-red-50 hover:border-red-600' },
        minor: { icon: Zap, label: 'Minor', color: 'border-blue-500', hover: 'hover:bg-blue-50 hover:border-blue-600' },
        patch: { icon: Tag, label: 'Patch', color: 'border-green-500', hover: 'hover:bg-green-50 hover:border-green-600' },
        prerelease: { icon: AlertTriangle, label: 'Pre-release', color: 'border-orange-500', hover: 'hover:bg-orange-50 hover:border-orange-600' },
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Release" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.releases.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">New Release</h1>
                        <p className="text-sm text-muted-foreground">Create a new release note</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Version and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Version</label>
                                <input
                                    type="text"
                                    value={data.version}
                                    onChange={(e) => setData('version', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    placeholder="1.0.0"
                                    required
                                />
                                {errors.version && (
                                    <p className="mt-1 text-sm text-red-600">{errors.version}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as any)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    required
                                >
                                    <option value="patch">Patch (1.0.1)</option>
                                    <option value="minor">Minor (1.1.0)</option>
                                    <option value="major">Major (2.0.0)</option>
                                    <option value="prerelease">Pre-release (1.0.0-beta.1)</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    required
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-lg font-semibold"
                                placeholder="e.g., Introducing new features"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Description (Optional)</label>
                            <input
                                type="text"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                placeholder="Brief summary..."
                            />
                        </div>

                        {/* Changes */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Changes</label>

                            {/* Add New Change */}
                            <div className="rounded-lg border bg-card p-4 space-y-3 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <select
                                        value={newChange.category}
                                        onChange={(e) => setNewChange({ ...newChange, category: e.target.value as any })}
                                        className="rounded-lg border border-input bg-background px-3 py-2"
                                    >
                                        {Object.entries(categoryConfig).map(([key, config]) => (
                                            <option key={key} value={key}>
                                                {config.icon} {config.label}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={newChange.description}
                                        onChange={(e) => setNewChange({ ...newChange, description: e.target.value })}
                                        className="md:col-span-2 rounded-lg border border-input bg-background px-3 py-2"
                                        placeholder="Describe the change..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChange())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addChange}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add
                                    </button>
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={newChange.breaking}
                                        onChange={(e) => setNewChange({ ...newChange, breaking: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                    Breaking change
                                </label>
                            </div>

                            {/* Changes List */}
                            {data.changes.length > 0 && (
                                <div className="space-y-2">
                                    {data.changes.map((change, index) => {
                                        const config = categoryConfig[change.category];
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span>{config.icon}</span>
                                                    <span className={config.color}>{config.label}</span>
                                                    <span className="flex-1">{change.description}</span>
                                                    {change.breaking && (
                                                        <span className="text-orange-600">💥 Breaking</span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeChange(index)}
                                                    className="p-1 rounded hover:bg-destructive/10 text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">Full Release Notes (Markdown)</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={10}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm"
                                placeholder="# What's new&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Fixes&#10;- Bug fix 1"
                                required
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                            )}
                        </div>

                        {/* Optional Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Published At</label>
                                <input
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">GitHub Tag</label>
                                <input
                                    type="text"
                                    value={data.github_tag}
                                    onChange={(e) => setData('github_tag', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2"
                                    placeholder="v1.0.0"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Link
                                href={route('admin.releases.index')}
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
                                Create Release
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
