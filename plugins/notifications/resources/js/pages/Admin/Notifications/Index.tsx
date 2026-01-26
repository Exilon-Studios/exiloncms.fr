import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Bell, Mail, MessageSquare, Send, Webhook, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Channel {
    id: number;
    name: string;
    type: 'email' | 'sms' | 'push' | 'webhook';
    is_enabled: boolean;
}

interface NotificationLog {
    id: number;
    type: string;
    subject: string | null;
    content: string;
    status: 'pending' | 'sent' | 'failed';
    error_message: string | null;
    sent_at: string | null;
    created_at: string;
    user: User | null;
    channel: Channel;
}

interface Props {
    logs: {
        data: NotificationLog[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        from: number;
        to: number;
        total: number;
    };
    channels: Channel[];
    templates: any[];
}

export default function NotificationsIndex({ logs, channels, templates }: PageProps & Props) {
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return CheckCircle;
            case 'failed':
                return XCircle;
            default:
                return Clock;
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'sent':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            case 'failed':
                return 'text-red-600 bg-red-100 dark:bg-red-900/20';
            default:
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
        }
    };

    const getChannelIcon = (type: string) => {
        switch (type) {
            case 'email':
                return Mail;
            case 'sms':
                return MessageSquare;
            case 'push':
                return Send;
            case 'webhook':
                return Webhook;
            default:
                return Bell;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground">
                            Monitor and manage system notifications
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.notifications.channels')}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <Webhook className="h-4 w-4" />
                            Channels
                        </Link>
                        <Link
                            href={route('admin.notifications.templates')}
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent"
                        >
                            <FileText className="h-4 w-4" />
                            Templates
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{logs.total}</p>
                            </div>
                            <Bell className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sent</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {logs.data.filter(l => l.status === 'sent').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {logs.data.filter(l => l.status === 'pending').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {logs.data.filter(l => l.status === 'failed').length}
                                </p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-lg border border-input bg-background px-4 py-2"
                    >
                        <option value="all">All Status</option>
                        <option value="sent">Sent</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                {/* Logs Table */}
                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Channel</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Sent At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data
                                    .filter(log => filterStatus === 'all' || log.status === filterStatus)
                                    .map((log) => {
                                        const StatusIcon = getStatusIcon(log.status);
                                        const ChannelIcon = getChannelIcon(log.channel.type);
                                        return (
                                            <tr key={log.id} className="border-b hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                        {log.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">{log.subject || 'No subject'}</p>
                                                        <p className="max-w-md truncate text-xs text-muted-foreground">
                                                            {log.content}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {log.user ? log.user.name : 'Guest'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{log.channel.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${getStatusColor(log.status)}`}>
                                                        <StatusIcon className="h-4 w-4" />
                                                        {log.status}
                                                    </div>
                                                    {log.error_message && (
                                                        <p className="mt-1 text-xs text-red-600">{log.error_message}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {log.sent_at
                                                        ? new Date(log.sent_at).toLocaleString()
                                                        : new Date(log.created_at).toLocaleString()
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                {logs.data.filter(log => filterStatus === 'all' || log.status === filterStatus).length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            No notifications found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.links && logs.links.length > 0 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Showing {logs.from} to {logs.to} of {logs.total} results
                            </span>
                            <div className="flex gap-2">
                                {logs.links.map((link, i) => (
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
