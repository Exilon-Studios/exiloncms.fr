/**
 * Admin Redirects Index - List all redirects
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowRight } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface Redirect {
  id: number;
  source: string;
  destination: string;
  code: number;
  is_enabled: boolean;
  created_at: string;
}

interface RedirectsIndexProps extends PageProps {
  redirects: Redirect[];
}

export default function RedirectsIndex({ redirects }: RedirectsIndexProps) {
  const deleteRedirect = (redirectId: number) => {
    if (confirm(trans('admin.redirects.index.delete_confirm'))) {
      router.delete(route('admin.redirects.destroy', redirectId));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.nav.content.redirects')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.redirects.index.title')}
            description={trans('admin.redirects.index.description', { count: redirects.length })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.redirects.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.redirects.index.create')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{trans('admin.redirects.index.source')}</TableHead>
                  <TableHead></TableHead>
                  <TableHead>{trans('admin.redirects.index.destination')}</TableHead>
                  <TableHead>{trans('admin.redirects.index.code')}</TableHead>
                  <TableHead>{trans('admin.redirects.index.status')}</TableHead>
                  <TableHead className="text-right">{trans('admin.redirects.index.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redirects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {trans('admin.redirects.index.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  redirects.map((redirect) => (
                    <TableRow key={redirect.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {redirect.source}
                      </TableCell>
                      <TableCell className="text-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {redirect.destination}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {redirect.code === 301 ? trans('admin.redirects.index.permanent') : trans('admin.redirects.index.temporary')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {redirect.is_enabled ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                            {trans('admin.redirects.index.active')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{trans('admin.redirects.index.disabled')}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('admin.redirects.edit', redirect.id)}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {trans('admin.redirects.index.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRedirect(redirect.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
