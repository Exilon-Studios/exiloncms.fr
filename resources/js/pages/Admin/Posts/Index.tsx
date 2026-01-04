/**
 * Admin Posts Index - List all posts
 */

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Post } from '@/types';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, Pin, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface PostsIndexProps extends PageProps {
  posts: Post[];
}

export default function PostsIndex({ posts }: PostsIndexProps) {
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; postId: number | null; postTitle: string }>({
    open: false,
    postId: null,
    postTitle: '',
  });

  const deletePost = (postId: number, postTitle: string) => {
    setDeleteModal({ open: true, postId, postTitle });
  };

  const confirmDelete = () => {
    if (deleteModal.postId) {
      const postId = deleteModal.postId;
      const postTitle = deleteModal.postTitle;

      // Fermer la modal immédiatement
      setDeleteModal({ open: false, postId: null, postTitle: '' });

      router.delete(route('admin.posts.destroy', postId), {
        onSuccess: () => {
          toast.success(trans('admin.posts.index.deleted', { title: postTitle }));
        },
        onError: () => {
          toast.error(trans('admin.posts.index.delete_failed'));
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, postId: null, postTitle: '' });
  };

  const isPublished = (publishedAt: string) => {
    return new Date(publishedAt) <= new Date();
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.posts.index.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.posts.index.title')}
            description={trans('admin.posts.index.description', { count: posts.length })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.posts.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.posts.index.create')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{trans('admin.posts.index.table.title')}</TableHead>
                  <TableHead>{trans('admin.posts.index.table.author')}</TableHead>
                  <TableHead>{trans('admin.posts.index.table.status')}</TableHead>
                  <TableHead>{trans('admin.posts.index.table.published')}</TableHead>
                  <TableHead className="text-right">{trans('admin.posts.index.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {trans('admin.posts.index.no_posts')}
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{post.title}</span>
                          {post.is_pinned && (
                            <Pin className="h-3 w-3 text-primary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.author.name}
                      </TableCell>
                      <TableCell>
                        {isPublished(post.published_at) ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                            {trans('admin.posts.index.status_published')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            {trans('admin.posts.index.status_scheduled')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('admin.posts.edit', post.id)}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {trans('admin.posts.index.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePost(post.id, post.title)}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {trans('admin.posts.index.delete_confirm_title')}
            </DialogTitle>
            <DialogDescription>
              {trans('admin.posts.index.delete_confirm_message', { title: deleteModal.postTitle })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              {trans('admin.posts.index.delete_cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              {trans('admin.posts.index.delete_confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
