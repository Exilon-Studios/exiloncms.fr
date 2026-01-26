import React from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Plus, Edit, Mail, MessageSquare, Send } from 'lucide-react';

interface Template {
    id: number;
    name: string;
    slug: string;
    subject: string | null;
    type: 'email' | 'sms' | 'push';
    is_enabled: boolean;
}

interface Props {
    templates: Template[];
}

export default function NotificationTemplates({ templates }: PageProps & Props) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'email':
                return Mail;
            case 'sms':
                return MessageSquare;
            case 'push':
                return Send;
            default:
                return Mail;
        }
    };

    const getTypeColor = (type: string): string => {
        switch (type) {
            case 'email':
                return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
            case 'sms':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20';
            case 'push':
                return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notification Templates" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notification Templates</h1>
                        <p className="text-muted-foreground">
                            Manage email and notification templates
                        </p>
                    </div>
                    <Link
                        href={route('admin.notifications.templates.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        New Template
                    </Link>
                </div>

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Template</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template) => {
                                    const Icon = getTypeIcon(template.type);
                                    return (
                                        <tr key={template.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium">{template.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        {template.slug}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {template.subject || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${getTypeColor(template.type)}`}>
                                                    <Icon className="h-4 w-4" />
                                                    {template.type}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {template.is_enabled ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.notifications.templates.edit', template)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1 text-sm hover:bg-accent"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {templates.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No templates found. Create your first template to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
