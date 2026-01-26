import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Pagination } from '@/types/pagination';
import { ArrowLeft, Eye, MousePointerClick, FileText, Download, Star } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AnalyticsEvent {
    id: number;
    event_type: string;
    page_url: string;
    referrer: string | null;
    user_agent: string | null;
    ip_address: string | null;
    session_id: string | null;
    properties: Record<string, unknown> | null;
    created_at: string;
    user: User | null;
}

interface Props {
    events: Pagination<AnalyticsEvent>;
}

export default function AnalyticsEvents({ events }: PageProps & Props) {
    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case 'page_view':
                return Eye;
            case 'click':
                return MousePointerClick;
            case 'form_submit':
                return FileText;
            case 'download':
                return Download;
            default:
                return Star;
        }
    };

    const getEventTypeColor = (type: string): string => {
        switch (type) {
            case 'page_view':
                return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'click':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            case 'form_submit':
                return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'download':
                return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Analytics Events" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href={route('admin.analytics.index')}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Analytics Events</h1>
                        <p className="text-muted-foreground">
                            Detailed view of all tracked events
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Page URL</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Session ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">IP Address</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.data.map((event) => {
                                    const Icon = getEventTypeIcon(event.event_type);
                                    return (
                                        <tr key={event.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 ${getEventTypeColor(event.event_type)}`}>
                                                    <Icon className="h-4 w-4" />
                                                    <span className="text-sm font-medium capitalize">
                                                        {event.event_type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{event.page_url}</span>
                                                    {event.referrer && (
                                                        <span className="text-xs text-muted-foreground">
                                                            from: {event.referrer}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {event.user ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{event.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {event.user.email}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">Guest</span>
                                                )}
                                            </td>
                                            <td className="max-w-[100px] truncate px-4 py-3 text-sm">
                                                {event.session_id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {event.ip_address}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(event.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {events.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            No events found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {events.links && events.links.length > 0 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Showing {events.from} to {events.to} of {events.total} results
                            </span>
                            <div className="flex gap-2">
                                {events.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`rounded-lg px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
