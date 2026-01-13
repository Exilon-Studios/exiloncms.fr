import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { IconBell, IconBellRinging, IconX, IconCheck, IconDots } from '@tabler/icons-react';
import { trans } from '@/lib/i18n';
import { clsx } from 'clsx';

interface Notification {
  id: string;
  level: 'info' | 'success' | 'warning' | 'danger';
  content: string;
  link?: string;
  read_at: string | null;
  created_at: string;
}

interface NotificationDropdownProps {
  unreadCount: number;
}

// Simple relative time formatter without date-fns
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "À l'instant";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Il y a ${diffInDays}j`;
  }

  // For older dates, show the actual date
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export function NotificationDropdown({ unreadCount: initialUnreadCount }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open && notifications.length === 0) {
      fetchNotifications();
    }
  }, [open]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/user/notifications/recent');
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/user/notifications/unread-count');
      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    try {
      await router.post(`/user/notifications/${id}/read`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        },
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await router.post(
        '/user/notifications/read-all',
        {},
        {
          preserveScroll: true,
          onSuccess: () => {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
          },
        }
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      await router.delete(`/user/notifications/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setNotifications((prev) => {
            const notification = prev.find((n) => n.id === id);
            const newNotifications = prev.filter((n) => n.id !== id);
            if (notification && !notification.read_at) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
            return newNotifications;
          });
        },
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <IconCheck className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <IconDots className="h-4 w-4 text-yellow-500" />;
      case 'danger':
        return <IconX className="h-4 w-4 text-red-500" />;
      default:
        return <IconBell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'border-l-green-500 bg-green-500/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'danger':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center rounded-md p-2 hover:bg-accent transition-colors"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <IconBellRinging className="h-5 w-5 text-foreground animate-pulse" />
        ) : (
          <IconBell className="h-5 w-5 text-foreground" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown Content */}
          <div className="absolute right-0 top-12 z-50 w-80 md:w-96 max-h-[500px] bg-background border border-border rounded-lg shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <IconBell className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent transition-colors"
                  >
                    Tout lire
                  </button>
                )}
                <Link
                  href="/notifications"
                  className="text-xs text-primary hover:underline px-2 py-1"
                >
                  Voir tout
                </Link>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        'relative p-3 border-l-2 hover:bg-muted/50 transition-colors cursor-pointer',
                        getLevelColor(notification.level),
                        !notification.read_at && 'bg-muted/30'
                      )}
                      onClick={() => {
                        if (!notification.read_at) {
                          markAsRead(notification.id);
                        }
                        if (notification.link) {
                          router.visit(notification.link);
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getLevelIcon(notification.level)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={clsx(
                              'text-sm line-clamp-2',
                              !notification.read_at && 'font-medium'
                            )}
                          >
                            {notification.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(notification.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {!notification.read_at && (
                            <button
                              onClick={(e) => markAsRead(notification.id, e)}
                              className="p-1 hover:bg-accent rounded transition-colors"
                              title="Marquer comme lu"
                            >
                              <IconCheck className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="p-1 hover:bg-accent rounded transition-colors"
                            title="Supprimer"
                          >
                            <IconX className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read_at && (
                        <div className="absolute top-3 right-3">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <IconBell className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucune notification
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vous serez notifié des événements importants
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border text-center">
                <Link
                  href="/notifications"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Voir toutes les notifications →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
