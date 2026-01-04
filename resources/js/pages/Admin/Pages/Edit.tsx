/**
 * Admin Pages Edit - Edit existing page
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Page } from '@/types';
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

interface PagesEditProps extends PageProps {
  page: Page;
}

export default function PagesEdit({ page }: PagesEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    title: page.title,
    slug: page.slug,
    description: page.description,
    content: page.content,
    is_enabled: page.is_enabled,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.pages.edit.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.pages.update', page.id), {
      onSuccess: () => toast.success(trans('admin.pages.edit.success')),
      onError: () => toast.error(trans('admin.pages.edit.error')),
    });
  };

  const deletePage = () => {
    if (confirm(trans('admin.pages.edit.confirm_delete'))) {
      router.delete(route('admin.pages.destroy', page.id), {
        onSuccess: () => {
          toast.success(trans('admin.pages.edit.deleted', { title: page.title }));
          router.visit(route('admin.pages.index'));
        },
        onError: () => toast.error(trans('admin.pages.edit.delete_failed')),
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.pages.edit.title', { title: page.title })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.pages.edit.heading')}
            description={trans('admin.pages.edit.description', { title: page.title })}
          />
          <AdminLayoutActions>
            {page.is_enabled && (
              <Link href={route('pages.show', page.slug)} target="_blank">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {trans('admin.pages.edit.view')}
                </Button>
              </Link>
            )}
            <Link href={route('admin.pages.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.pages.edit.back')}
              </Button>
            </Link>
            <Button variant="destructive" onClick={deletePage}>
              <Trash2 className="mr-2 h-4 w-4" />
              {trans('admin.pages.edit.delete')}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Page Status */}
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{trans('admin.pages.edit.status_label')}:</span>
                  {page.is_enabled ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {trans('admin.pages.edit.status_published')}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{trans('admin.pages.edit.status_draft')}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {trans('admin.pages.edit.last_updated')}: {new Date(page.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.pages.edit.form_heading')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6" id="edit-page-form">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">{trans('admin.pages.edit.field_title')}</Label>
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
                  <Label htmlFor="slug">{trans('admin.pages.edit.field_slug')}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/</span>
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
                    {trans('admin.pages.edit.slug_help')}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{trans('admin.pages.edit.field_description')}</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder={trans('admin.pages.edit.description_placeholder')}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">{trans('admin.pages.edit.field_content')}</Label>
                  <TipTapEditor
                    content={data.content}
                    onChange={(content) => setData('content', content)}
                    placeholder={trans('admin.pages.edit.content_placeholder')}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                </div>

                {/* Published Status */}
                <div className="flex items-center gap-2">
                  <input
                    id="is_enabled"
                    type="checkbox"
                    checked={data.is_enabled}
                    onChange={(e) => setData('is_enabled', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="is_enabled" className="cursor-pointer">
                    {trans('admin.pages.edit.field_published')}
                  </Label>
                </div>
                {errors.is_enabled && (
                  <p className="text-sm text-destructive">{errors.is_enabled}</p>
                )}
              </form>
            </div>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.pages.index')}>
            <Button type="button" variant="outline">
              {trans('admin.pages.edit.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="edit-page-form" disabled={processing}>
            {processing ? trans('admin.pages.edit.saving') : trans('admin.pages.edit.save')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
