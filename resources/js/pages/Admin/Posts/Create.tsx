/**
 * Admin Posts Create - Create new post
 * Matches Azuriom base project structure
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutContent,
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { trans } from '@/lib/i18n';

interface PostsCreateProps extends PageProps {
  pendingId: string;
}

export default function PostsCreate({ pendingId }: PostsCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: null as File | null,
    published_at: new Date().toISOString().slice(0, 16),
    is_pinned: false,
    pending_id: pendingId || '',
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.posts.create.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.posts.store'), {
      onSuccess: () => toast.success(trans('admin.posts.create.success')),
      onError: () => toast.error(trans('admin.posts.create.error')),
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setData('title', title);
    if (!data.slug) {
      setData('slug', generateSlug(title));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.posts.create.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle title={trans('admin.posts.create.title')} />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" id="create-post-form">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">{trans('admin.posts.create.field_title')}</Label>
                  <Input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{trans('admin.posts.create.field_description')}</Label>
                  <Input
                    id="description"
                    type="text"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label htmlFor="image">{trans('admin.posts.create.field_image')}</Label>
                  <Input
                    id="image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                  />
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">{trans('admin.posts.create.field_slug')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">/posts/</span>
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
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">{trans('admin.posts.create.field_content')}</Label>
                  <TipTapEditor
                    content={data.content}
                    onChange={(content) => setData('content', content)}
                    placeholder={trans('admin.posts.create.content_placeholder')}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                </div>

                {/* Published At */}
                <div className="space-y-2">
                  <Label htmlFor="published_at">{trans('admin.posts.create.field_published_at')}</Label>
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
                </div>

                {/* Pinned Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_pinned"
                    checked={data.is_pinned}
                    onCheckedChange={(checked) => setData('is_pinned', checked)}
                  />
                  <Label htmlFor="is_pinned" className="cursor-pointer">
                    {trans('admin.posts.create.field_pinned')}
                  </Label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={processing}>
                    {processing ? trans('admin.posts.create.saving') : trans('admin.posts.create.save')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
