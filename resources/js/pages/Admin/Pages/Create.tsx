/**
 * Admin Pages Create - Create new page
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
  AdminLayoutFooter
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import TipTapEditor from '@/components/admin/TipTapEditor';
import { trans } from '@/lib/i18n';

interface PagesCreateProps extends PageProps {}

export default function PagesCreate({}: PagesCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    slug: '',
    description: '',
    content: '',
    is_enabled: true,
  });

  // Call trans() during render, not in callbacks
  const t = {
    fixErrors: trans('admin.pages.create.fix_errors'),
    success: trans('admin.pages.create.success'),
    error: trans('admin.pages.create.error'),
    title: trans('admin.pages.create.title'),
    fieldTitle: trans('admin.pages.create.field_title'),
    fieldDescription: trans('admin.pages.create.field_description'),
    fieldSlug: trans('admin.pages.create.field_slug'),
    fieldContent: trans('admin.pages.create.field_content'),
    contentPlaceholder: trans('admin.pages.create.content_placeholder'),
    fieldEnabled: trans('admin.pages.create.field_enabled'),
    saving: trans('admin.pages.create.saving'),
    save: trans('admin.pages.create.save'),
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(t.fixErrors);
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.pages.store'), {
      onSuccess: () => toast.success(t.success),
      onError: () => toast.error(t.error),
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
      <Head title={t.title} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle title={t.title} />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" id="create-page-form">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">{t.fieldTitle}</Label>
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
                  <Label htmlFor="description">{t.fieldDescription}</Label>
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

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">{t.fieldSlug}</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">{window.location.origin}/</span>
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
                  <Label htmlFor="content">{t.fieldContent}</Label>
                  <TipTapEditor
                    content={data.content}
                    onChange={(content) => setData('content', content)}
                    placeholder={t.contentPlaceholder}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">{errors.content}</p>
                  )}
                </div>

                {/* Published Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_enabled"
                    checked={data.is_enabled}
                    onCheckedChange={(checked) => setData('is_enabled', checked)}
                  />
                  <Label htmlFor="is_enabled" className="cursor-pointer">
                    {t.fieldEnabled}
                  </Label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={processing}>
                    {processing ? t.saving : t.save}
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
