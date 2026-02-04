import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Trash2, Check } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { trans } from '@/lib/i18n';

interface Notification {
  id: string;
  level: 'info' | 'success' | 'warning' | 'danger';
  content: string;
  link?: string;
  read_at: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  author: {
    id: number;
    name: string;
    email: string;
  } | null;
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

export default function AdminNotificationsIndex({ notifications, pagination }: Props) {
  const levelLabels: Record<string, string> = {
    info: trans('admin.notifications.level.info'),
    success: trans('admin.notifications.level.success'),
    warning: trans('admin.notifications.level.warning'),
    danger: trans('admin.notifications.level.danger'),
  };

  const handleDelete = (id: string) => {
    if (!confirm(trans('admin.notifications.delete_confirm'))) return;
    router.delete(route('admin.notifications.destroy', id));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.notifications.title')} />

      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{trans('admin.notifications.title')}</h1>
                <p className="text-muted-foreground">
                  {trans('admin.notifications.description')}
                </p>
              </div>
            </div>
            <Link href={route('admin.notifications.create')}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {trans('admin.notifications.create')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">{trans('admin.notifications.table.level')}</th>
                    <th className="text-left p-4 font-medium">{trans('admin.notifications.table.message')}</th>
                    <th className="text-left p-4 font-medium">{trans('admin.notifications.table.recipient')}</th>
                    <th className="text-left p-4 font-medium">{trans('admin.notifications.table.sender')}</th>
                    <th className="text-left p-4 font-medium">{trans('admin.notifications.table.status')}</th>
                    <th className="text-left p-4 font-medium">{trans('admin.notifications.table.date')}</th>
                    <th className="text-right p-4 font-medium">{trans('admin.notifications.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Badge variant="outline" className={levelColors[notification.level]}>
                          {levelLabels[notification.level]}
                        </Badge>
                      </td>
                      <td className="p-4 max-w-md">
                        <p className="text-sm truncate">{notification.content}</p>
                        {notification.link && (
                          <p className="text-xs text-muted-foreground truncate">{notification.link}</p>
                        )}
                      </td>
                      <td className="p-4">
                        {notification.user ? (
                          <div>
                            <div className="font-medium text-sm">{notification.user.name}</div>
                            <div className="text-xs text-muted-foreground">{notification.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {notification.author ? (
                          <div>
                            <div className="font-medium text-sm">{notification.author.name}</div>
                            <div className="text-xs text-muted-foreground">{notification.author.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">{trans('admin.notifications.system')}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {notification.read_at ? (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Check className="h-3 w-3" />
                            {trans('admin.notifications.status.read')}
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-xs">{trans('admin.notifications.status.unread')}</Badge>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {notifications.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>{trans('admin.notifications.empty')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {pagination.current_page > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.visit(`/admin/notifications?page=${pagination.current_page - 1}`)}
              >
                {trans('admin.notifications.pagination.previous')}
              </Button>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              {trans('admin.notifications.pagination.page_x_of_y', { current: pagination.current_page, last: pagination.last_page })}
            </span>
            {pagination.current_page < pagination.last_page && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.visit(`/admin/notifications?page=${pagination.current_page + 1}`)}
              >
                {trans('admin.notifications.pagination.next')}
              </Button>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
