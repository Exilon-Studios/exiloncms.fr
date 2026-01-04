/**
 * Admin Posts Edit - Edit existing post
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Post } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent,
  AdminLayoutFooter
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { trans } from '@/lib/i18n';

interface PostsEditProps extends PageProps {
  post: Post;
}

export default function PostsEdit({ post }: PostsEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    title: post.title,
    slug: post.slug,
    description: post.description,
    content: post.content,
    published_at: new Date(post.published_at).toISOString().slice(0, 16),
    is_pinned: post.is_pinned,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.posts.edit.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.posts.update', post.id), {
      onSuccess: () => toast.success(trans('admin.posts.edit.success')),
      onError: () => toast.error(trans('admin.posts.edit.error')),
    });
  };

  const deletePost = () => {
    if (confirm(trans('admin.posts.edit.confirm_delete'))) {
      router.delete(route('admin.posts.destroy', post.id), {
        onSuccess: () => {
          toast.success(trans('admin.posts.edit.deleted', { title: post.title }));
          router.visit(route('admin.posts.index'));
        },
        onError: () => toast.error(trans('admin.posts.edit.delete_failed')),
      });
    }
  };

  const isPublished = () => {
    return new Date(data.published_at) <= new Date();
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.posts.edit.title', { title: post.title })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.posts.edit.heading')}
            description={trans('admin.posts.edit.description', { title: post.title })}
          />
          <AdminLayoutActions>
            {isPublished() && (
              <Link href={route('posts.show', post.slug)} target="_blank">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {trans('admin.posts.edit.view')}
                </Button>
              </Link>
            )}
            <Link href={route('admin.posts.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.posts.edit.back')}
              </Button>
            </Link>
            <Button variant="destructive" onClick={deletePost}>
              <Trash2 className="mr-2 h-4 w-4" />
              {trans('admin.posts.edit.delete')}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Post Status */}
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{trans('admin.posts.edit.status_label')}:</span>
                  {isPublished() ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {trans('admin.posts.edit.status_published')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      {trans('admin.posts.edit.status_scheduled')}
                    </Badge>
                  )}
                  {post.is_pinned && (
                    <Badge>{trans('admin.posts.edit.status_pinned')}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {trans('admin.posts.edit.author_label')}: {post.author.name} • {trans('admin.posts.edit.last_updated')}: {new Date(post.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.posts.edit.form_heading')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6" id="edit-post-form">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">{trans('admin.posts.edit.field_title')}</Label>
                  <Input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">{trans('admin.posts.edit.field_slug')}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/posts/</span>
                    <Input
                      id="slug"
                      type="text"
                      value={data.slug}
                      onChange={(e) => setData('slug', e.target.value)}
                      required
                      className="flex-1"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.posts.edit.slug_help')}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{trans('admin.posts.edit.field_description')}</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">{trans('admin.posts.edit.field_content')}</Label>
                  <TipTapEditor
                    content={data.content}
                    onChange={(content) => setData('content', content)}
                    placeholder={trans('admin.posts.edit.content_placeholder')}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                </div>

                {/* Publish Date */}
                <div className="space-y-2">
                  <Label htmlFor="published_at">{trans('admin.posts.edit.field_published_at')}</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={data.published_at}
                    onChange={(e) => setData('published_at', e.target.value)}
                    required
                  />
                  {errors.published_at && (
                    <p className="text-sm text-destructive">{errors.published_at}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.posts.edit.published_at_help')}
                  </p>
                </div>

                {/* Pinned Status */}
                <div className="flex items-center gap-2">
                  <input
                    id="is_pinned"
                    type="checkbox"
                    checked={data.is_pinned}
                    onChange={(e) => setData('is_pinned', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="is_pinned" className="cursor-pointer">
                    {trans('admin.posts.edit.field_pinned')}
                  </Label>
                </div>
                {errors.is_pinned && (
                  <p className="text-sm text-destructive">{errors.is_pinned}</p>
                )}
              </form>
            </div>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.posts.index')}>
            <Button type="button" variant="outline">
              {trans('admin.posts.edit.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="edit-post-form" disabled={processing}>
            {processing ? trans('admin.posts.edit.saving') : trans('admin.posts.edit.save')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
