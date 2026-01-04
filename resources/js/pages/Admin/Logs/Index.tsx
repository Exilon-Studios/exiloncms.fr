/**
 * Admin Logs Index - View action logs
 */

import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, FileText } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface User {
  id: number;
  name: string;
}

interface ActionLog {
  id: number;
  user: User | null;
  action: string;
  target_type: string | null;
  target_id: number | null;
  created_at: string;
}

interface LogsIndexProps extends PageProps {
  logs: PaginatedData<ActionLog>;
  search: string | null;
}

export default function LogsIndex({ logs, search: initialSearch }: LogsIndexProps) {
  const [search, setSearch] = useState(initialSearch || '');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.get(route('admin.logs.index'), { search }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes('deleted') || action.includes('banned')) {
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
    if (action.includes('created') || action.includes('added')) {
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
    if (action.includes('updated') || action.includes('edited')) {
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
    return '';
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.nav.other.logs')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.logs.index.title')}
            description={trans('admin.logs.index.description', { count: logs.total })}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Search */}
            <div className="border border-border rounded-lg p-4 bg-card">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={trans('admin.logs.index.search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">{trans('admin.logs.index.search')}</Button>
                {initialSearch && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      router.get(route('admin.logs.index'));
                    }}
                  >
                    {trans('admin.logs.index.clear')}
                  </Button>
                )}
              </form>
            </div>

            {/* Logs Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{trans('admin.logs.index.user')}</TableHead>
                    <TableHead>{trans('admin.logs.index.action')}</TableHead>
                    <TableHead>{trans('admin.logs.index.target')}</TableHead>
                    <TableHead>{trans('admin.logs.index.date')}</TableHead>
                    <TableHead className="text-right">{trans('admin.logs.index.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {trans('admin.logs.index.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.data.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {log.user ? (
                            <span className="font-medium">{log.user.name}</span>
                          ) : (
                            <span className="text-muted-foreground italic">{trans('admin.logs.index.system')}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.target_type && log.target_id ? (
                            <span className="text-xs">
                              {log.target_type} #{log.target_id}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Link href={route('admin.logs.show', log.id)}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                {trans('admin.logs.index.view')}
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {logs.last_page > 1 && (
                <div className="border-t border-border bg-muted/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {trans('admin.logs.index.showing', { from: logs.from, to: logs.to, total: logs.total })}
                    </p>
                    <div className="flex gap-2">
                      {logs.current_page > 1 && (
                        <Link
                          href={route('admin.logs.index', {
                            page: logs.current_page - 1,
                            search: initialSearch,
                          })}
                        >
                          <Button variant="outline" size="sm">
                            {trans('admin.logs.index.previous')}
                          </Button>
                        </Link>
                      )}
                      {logs.current_page < logs.last_page && (
                        <Link
                          href={route('admin.logs.index', {
                            page: logs.current_page + 1,
                            search: initialSearch,
                          })}
                        >
                          <Button variant="outline" size="sm">
                            {trans('admin.logs.index.next')}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
