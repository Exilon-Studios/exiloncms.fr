/**
 * Admin Social Links Edit - Edit existing social link
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface SocialLink {
  id: number;
  type: string;
  title: string;
  value: string;
  icon: string;
  color: string;
  position: number;
}

interface SocialLinksEditProps extends PageProps {
  link: SocialLink;
  types: Record<string, string>;
}

export default function SocialLinksEdit({ link, types }: SocialLinksEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    type: link.type,
    value: link.value,
    title: link.title,
    icon: link.icon,
    color: link.color,
    position: link.position,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.social-links.update', link.id));
  };

  const deleteLink = () => {
    if (confirm(trans('admin.social_links.edit.confirm_delete'))) {
      router.delete(route('admin.social-links.destroy', link.id));
    }
  };

  const isCustomType = data.type === 'other';

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.social_links.edit.page_title', { title: link.title })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.social_links.edit.title')}
            description={trans('admin.social_links.edit.description', { title: link.title })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.social-links.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.social_links.edit.back_button')}
              </Button>
            </Link>
            <Button variant="destructive" onClick={deleteLink}>
              <Trash2 className="mr-2 h-4 w-4" />
              {trans('admin.social_links.edit.delete_button')}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.social_links.edit.form_title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="edit-social-link-form">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">{trans('admin.social_links.edit.fields.type')}</Label>
                <Select
                  value={data.type}
                  onValueChange={(value) => setData('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={trans('admin.social_links.edit.fields.type_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(types).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">{trans('admin.social_links.edit.fields.type_custom')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {isCustomType ? trans('admin.social_links.edit.fields.type_help_custom') : trans('admin.social_links.edit.fields.type_help_preset')}
                </p>
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="value">{trans('admin.social_links.edit.fields.url')}</Label>
                <Input
                  id="value"
                  type="url"
                  value={data.value}
                  onChange={(e) => setData('value', e.target.value)}
                  required
                />
                {errors.value && (
                  <p className="text-sm text-destructive">{errors.value}</p>
                )}
              </div>

              {/* Custom fields only for "other" type */}
              {isCustomType && (
                <>
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">{trans('admin.social_links.edit.fields.title')}</Label>
                    <Input
                      id="title"
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      required={isCustomType}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <Label htmlFor="icon">{trans('admin.social_links.edit.fields.icon')}</Label>
                    <Input
                      id="icon"
                      type="text"
                      value={data.icon}
                      onChange={(e) => setData('icon', e.target.value)}
                      required={isCustomType}
                    />
                    {errors.icon && (
                      <p className="text-sm text-destructive">{errors.icon}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {trans('admin.social_links.edit.fields.icon_help')}
                    </p>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">{trans('admin.social_links.edit.fields.color')}</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="color"
                        type="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="w-16 h-10"
                        required={isCustomType}
                      />
                      <Input
                        type="text"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                    {errors.color && (
                      <p className="text-sm text-destructive">{errors.color}</p>
                    )}
                  </div>
                </>
              )}

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">{trans('admin.social_links.edit.fields.position')}</Label>
                <Input
                  id="position"
                  type="number"
                  value={data.position}
                  onChange={(e) => setData('position', parseInt(e.target.value))}
                  min="0"
                />
                {errors.position && (
                  <p className="text-sm text-destructive">{errors.position}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {trans('admin.social_links.edit.fields.position_help')}
                </p>
              </div>
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.social-links.index')}>
            <Button type="button" variant="outline">
              {trans('admin.social_links.edit.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="edit-social-link-form" disabled={processing}>
            {processing ? trans('admin.social_links.edit.submitting') : trans('admin.social_links.edit.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
