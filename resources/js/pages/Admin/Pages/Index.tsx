/**
 * Admin Pages Index - List all pages
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Page } from '@/types';
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
import { Plus, Edit, Trash2, FileText, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';
import { useTrans } from '@/hooks/useTrans';
import { useModal } from '@/lib/modalManager';

interface PagesIndexProps extends PageProps {
  pages: Page[];
}

export default function PagesIndex({ pages }: PagesIndexProps) {
  const { trans } = useTrans();
  const { confirm } = useModal();

  const deletePage = (pageId: number, pageTitle: string) => {
    confirm({
      title: trans('admin.delete.title'),
      description: trans('admin.pages.index.confirm_delete'),
      variant: 'danger',
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      onConfirm: () => {
        router.delete(route('admin.pages.destroy', pageId), {
          onSuccess: () => toast.success(trans('admin.pages.index.deleted', { title: pageTitle })),
          onError: (errors) => {
            console.error('Delete error:', errors);
            toast.error(trans('admin.pages.index.delete_failed'));
          },
        });
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.pages.index.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.pages.index.title')}
            description={trans('admin.pages.index.description', { count: pages.length })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.pages.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.pages.index.create')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{trans('admin.pages.index.table.title')}</TableHead>
                  <TableHead>{trans('admin.pages.index.table.slug')}</TableHead>
                  <TableHead>{trans('admin.pages.index.table.status')}</TableHead>
                  <TableHead>{trans('admin.pages.index.table.created')}</TableHead>
                  <TableHead className="text-right">{trans('admin.pages.index.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {trans('admin.pages.index.no_pages')}
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{page.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        /{page.slug}
                      </TableCell>
                      <TableCell>
                        {page.is_enabled ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                            {trans('admin.pages.index.status_published')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{trans('admin.pages.index.status_draft')}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(page.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('admin.pages.puck-editor', page.id)}>
                            <Button variant="default" size="sm">
                              <Paintbrush className="h-4 w-4 mr-1" />
                              Puck
                            </Button>
                          </Link>
                          <Link href={route('admin.pages.edit', page.id)}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {trans('admin.pages.index.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePage(page.id, page.title)}
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
