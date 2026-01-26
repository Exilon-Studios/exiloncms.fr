import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Edit, Trash2, Power, PowerOff, Mail, MessageSquare, Send, Webhook } from 'lucide-react';

interface Channel {
    id: number;
    name: string;
    type: 'email' | 'sms' | 'push' | 'webhook';
    config: Record<string, unknown> | null;
    is_enabled: boolean;
}

interface Props {
    channels: Channel[];
}

export default function NotificationChannels({ channels }: PageProps & Props) {
    const handleToggle = (channel: Channel) => {
        router.post(
            route('admin.notifications.channels.toggle', channel),
            {},
            {
                onSuccess: () => {
                    // Success
                },
            }
        );
    };

    const handleDelete = (channel: Channel) => {
        if (confirm(`Are you sure you want to delete "${channel.name}"?`)) {
            router.delete(route('admin.notifications.channels.destroy', channel));
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
                return Mail;
        }
    };

    const getChannelColor = (type: string): string => {
        switch (type) {
            case 'email':
                return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'sms':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            case 'push':
                return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'webhook':
                return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notification Channels" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notification Channels</h1>
                        <p className="text-muted-foreground">
                            Configure how notifications are delivered
                        </p>
                    </div>
                    <Link
                        href={route('admin.notifications.channels.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Channel
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {channels.map((channel) => {
                        const Icon = getChannelIcon(channel.type);
                        return (
                            <div
                                key={channel.id}
                                className="relative rounded-lg border bg-card p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className={`inline-flex rounded-lg p-3 ${getChannelColor(channel.type)}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={() => handleToggle(channel)}
                                        className={`rounded-lg p-2 ${
                                            channel.is_enabled
                                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/20'
                                        }`}
                                    >
                                        {channel.is_enabled ? (
                                            <Power className="h-5 w-5" />
                                        ) : (
                                            <PowerOff className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                <h3 className="mb-2 text-xl font-bold">{channel.name}</h3>

                                <div className="mb-4 space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="font-medium capitalize">{channel.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className={`font-medium ${channel.is_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                            {channel.is_enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={route('admin.notifications.channels.edit', channel)}
                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(channel)}
                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {channels.length === 0 && (
                    <div className="rounded-lg border bg-card p-12 text-center">
                        <Webhook className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No channels configured</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create notification channels to deliver messages to your users
                        </p>
                        <Link
                            href={route('admin.notifications.channels.create')}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Add Your First Channel
                        </Link>
                    </div>
                )}

                {/* Channel Types Info */}
                <div className="mt-8 rounded-lg border bg-blue-50 p-6 dark:bg-blue-900/20">
                    <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                        Available Channel Types
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">Email</p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Send notifications via email
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">SMS</p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Send text messages
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Send className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">Push</p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Browser push notifications
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Webhook className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">Webhook</p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    HTTP POST to external URL
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
