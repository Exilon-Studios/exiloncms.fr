import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    BarChart3,
    Users,
    MousePointerClick,
    Clock,
    Download,
    Eye,
    TrendingUp,
    Globe,
    Monitor,
} from 'lucide-react';

interface Stats {
    page_views: number;
    unique_visitors: number;
    events: number;
    avg_session_duration: number;
}

interface PageViewsOverTime {
    date: string;
    count: number;
}

interface TopPage {
    page_url: string;
    page_title: string | null;
    total_views: number;
    total_unique: number;
}

interface EventType {
    event_type: string;
    count: number;
}

interface Referrer {
    referrer: string;
    count: number;
}

interface Browser {
    browser: string;
    count: number;
}

interface Props {
    stats: Stats;
    pageViewsOverTime: PageViewsOverTime[];
    topPages: TopPage[];
    eventTypes: EventType[];
    topReferrers: Referrer[];
    browsers: Browser[];
    period: string;
}

export default function AnalyticsIndex({
    stats,
    pageViewsOverTime,
    topPages,
    eventTypes,
    topReferrers,
    browsers,
    period,
}: PageProps & Props) {
    const { post, processing } = useForm({ period, format: 'csv' });

    const handleExport = (format: 'csv' | 'json') => {
        post(route('admin.analytics.export'), {
            data: { period, format },
        });
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const statCards = [
        {
            title: 'Page Views',
            value: stats.page_views.toLocaleString(),
            icon: Eye,
            color: 'text-blue-600',
        },
        {
            title: 'Unique Visitors',
            value: stats.unique_visitors.toLocaleString(),
            icon: Users,
            color: 'text-green-600',
        },
        {
            title: 'Total Events',
            value: stats.events.toLocaleString(),
            icon: MousePointerClick,
            color: 'text-purple-600',
        },
        {
            title: 'Avg Session Duration',
            value: formatDuration(stats.avg_session_duration),
            icon: Clock,
            color: 'text-orange-600',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Analytics" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Track your website traffic and user behavior
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.analytics.events')}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <Eye className="h-4 w-4" />
                            View Events
                        </Link>
                        <button
                            onClick={() => handleExport('csv')}
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="mb-6 rounded-lg border bg-card p-4">
                    <div className="flex gap-2">
                        {(['today', 'week', 'month', 'year'] as const).map((p) => (
                            <Link
                                key={p}
                                href={route('admin.analytics.index', { period: p })}
                                className={`rounded-lg px-4 py-2 capitalize ${
                                    period === p
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent'
                                }`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.title}
                            className="rounded-lg border bg-card p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Pages */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                            <TrendingUp className="h-5 w-5" />
                            Top Pages
                        </h2>
                        <div className="space-y-3">
                            {topPages.map((page, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {page.page_title || page.page_url}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {page.page_url}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{page.total_views}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {page.total_unique} unique
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Event Types */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                            <MousePointerClick className="h-5 w-5" />
                            Event Types
                        </h2>
                        <div className="space-y-3">
                            {eventTypes.map((event) => (
                                <div
                                    key={event.event_type}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <p className="font-medium capitalize">{event.event_type.replace('_', ' ')}</p>
                                    <p className="text-lg font-bold">{event.count.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Referrers */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                            <Globe className="h-5 w-5" />
                            Top Referrers
                        </h2>
                        <div className="space-y-3">
                            {topReferrers.map((ref, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <p className="flex-1 truncate text-sm">{ref.referrer}</p>
                                    <p className="font-bold">{ref.count.toLocaleString()}</p>
                                </div>
                            ))}
                            {topReferrers.length === 0 && (
                                <p className="text-center text-muted-foreground">No referrers data</p>
                            )}
                        </div>
                    </div>

                    {/* Browsers */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                            <Monitor className="h-5 w-5" />
                            Top Browsers
                        </h2>
                        <div className="space-y-3">
                            {browsers.map((browser) => (
                                <div
                                    key={browser.browser}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <p className="font-medium">{browser.browser}</p>
                                    <p className="text-lg font-bold">{browser.count.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Page Views Over Time Chart (Simple bar visualization) */}
                <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">Page Views Over Time</h2>
                    <div className="flex items-end gap-1">
                        {pageViewsOverTime.map((data) => {
                            const maxCount = Math.max(...pageViewsOverTime.map((d) => d.count));
                            const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                            return (
                                <div
                                    key={data.date}
                                    className="group relative flex-1"
                                >
                                    <div
                                        className="bg-primary hover:bg-primary/80 rounded-t transition-colors"
                                        style={{ height: `${height}%`, minHeight: '2px' }}
                                    />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs opacity-0 group-hover:opacity-100">
                                        {data.date}: {data.count}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
