import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

interface Notification {
    id: string;
    level: 'info' | 'success' | 'warning' | 'danger';
    content: string;
    link?: string;
    read_at: string | null;
    created_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    notifications: Notification[];
    pagination: Pagination;
}

const levelColors = {
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const levelLabels = {
    info: 'Info',
    success: 'Succès',
    warning: 'Attention',
    danger: 'Erreur',
};

export default function NotificationsIndex({ notifications, pagination }: Props) {
    const markAsRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post('/notifications/read', {}, { preserveScroll: true });
    };

    return (
        <DashboardLayout>
            <Head title="Notifications" />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Bell className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Notifications</h1>
                                <p className="text-muted-foreground">
                                    {pagination.total} notification{pagination.total > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            className="flex items-center gap-2"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Tout marquer comme lu
                        </Button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center text-muted-foreground">
                                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Aucune notification</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={clsx(
                                    'transition-all hover:shadow-md',
                                    !notification.read_at && 'border-primary/50 bg-primary/5'
                                )}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Level Badge */}
                                        <div className="flex-shrink-0">
                                            <Badge
                                                variant="outline"
                                                className={clsx('font-medium', levelColors[notification.level])}
                                            >
                                                {levelLabels[notification.level]}
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground mb-2">
                                                {notification.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(notification.created_at).toLocaleString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {notification.link && (
                                                <a
                                                    href={notification.link}
                                                    className="inline-flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                </a>
                                            )}
                                            {!notification.read_at && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Marquer comme lu
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {pagination.current_page > 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(`/notifications?page=${pagination.current_page - 1}`)}
                            >
                                Précédent
                            </Button>
                        )}
                        <span className="flex items-center px-4 text-sm text-muted-foreground">
                            Page {pagination.current_page} sur {pagination.last_page}
                        </span>
                        {pagination.current_page < pagination.last_page && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(`/notifications?page=${pagination.current_page + 1}`)}
                            >
                                Suivant
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
