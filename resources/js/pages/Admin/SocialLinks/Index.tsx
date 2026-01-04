/**
 * Admin Social Links Index - List all social links
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
import { Plus, Edit, Trash2, Share2 } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface SocialLink {
  id: number;
  title: string;
  value: string;
  icon: string;
  color: string;
  position: number;
  type: string;
}

interface SocialLinksIndexProps extends PageProps {
  links: SocialLink[];
}

export default function SocialLinksIndex({ links }: SocialLinksIndexProps) {
  const deleteLink = (linkId: number) => {
    if (confirm(trans('admin.social_links.index.confirm_delete'))) {
      router.delete(route('admin.social-links.destroy', linkId));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.social_links.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.social_links.index.title')}
            description={trans('admin.social_links.index.description', { count: links.length })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.social-links.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.social_links.index.create_button')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{trans('admin.social_links.index.columns.title')}</TableHead>
                  <TableHead>{trans('admin.social_links.index.columns.url')}</TableHead>
                  <TableHead>{trans('admin.social_links.index.columns.icon')}</TableHead>
                  <TableHead>{trans('admin.social_links.index.columns.color')}</TableHead>
                  <TableHead className="text-center">{trans('admin.social_links.index.columns.order')}</TableHead>
                  <TableHead className="text-right">{trans('admin.social_links.index.columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {trans('admin.social_links.index.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{link.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground max-w-xs truncate">
                        {link.value}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <i className={`${link.icon} text-lg`} style={{ color: link.color }}></i>
                          <span className="text-xs text-muted-foreground">{link.icon}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border border-border"
                            style={{ backgroundColor: link.color }}
                          ></div>
                          <span className="font-mono text-xs text-muted-foreground">{link.color}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{link.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('admin.social-links.edit', link.id)}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {trans('admin.social_links.index.edit_button')}
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteLink(link.id)}
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
