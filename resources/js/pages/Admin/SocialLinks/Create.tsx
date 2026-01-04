/**
 * Admin Social Links Create - Create new social link
 */

import { Head, Link, useForm } from '@inertiajs/react';
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
import { ArrowLeft } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface SocialLinksCreateProps extends PageProps {
  types: Record<string, string>;
}

export default function SocialLinksCreate({ types }: SocialLinksCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    type: Object.keys(types)[0] || 'twitter',
    value: '',
    title: '',
    icon: '',
    color: '#1da1f2',
    position: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.social-links.store'));
  };

  const isCustomType = data.type === 'other';

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.social_links.create.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.social_links.create.title')}
            description={trans('admin.social_links.create.description')}
          />
          <AdminLayoutActions>
            <Link href={route('admin.social-links.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.social_links.create.back_button')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.social_links.create.form_title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="create-social-link-form">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">{trans('admin.social_links.create.fields.type')}</Label>
                <Select
                  value={data.type}
                  onValueChange={(value) => setData('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={trans('admin.social_links.create.fields.type_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(types).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">{trans('admin.social_links.create.fields.type_custom')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {isCustomType ? trans('admin.social_links.create.fields.type_help_custom') : trans('admin.social_links.create.fields.type_help_preset')}
                </p>
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="value">{trans('admin.social_links.create.fields.url')}</Label>
                <Input
                  id="value"
                  type="url"
                  value={data.value}
                  onChange={(e) => setData('value', e.target.value)}
                  placeholder={trans('admin.social_links.create.fields.url_placeholder')}
                  required
                  autoFocus
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
                    <Label htmlFor="title">{trans('admin.social_links.create.fields.title')}</Label>
                    <Input
                      id="title"
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder={trans('admin.social_links.create.fields.title_placeholder')}
                      required={isCustomType}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <Label htmlFor="icon">{trans('admin.social_links.create.fields.icon')}</Label>
                    <Input
                      id="icon"
                      type="text"
                      value={data.icon}
                      onChange={(e) => setData('icon', e.target.value)}
                      placeholder={trans('admin.social_links.create.fields.icon_placeholder')}
                      required={isCustomType}
                    />
                    {errors.icon && (
                      <p className="text-sm text-destructive">{errors.icon}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {trans('admin.social_links.create.fields.icon_help')}
                    </p>
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">{trans('admin.social_links.create.fields.color')}</Label>
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
                        placeholder={trans('admin.social_links.create.fields.color_placeholder')}
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
                <Label htmlFor="position">{trans('admin.social_links.create.fields.position')}</Label>
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
                  {trans('admin.social_links.create.fields.position_help')}
                </p>
              </div>
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.social-links.index')}>
            <Button type="button" variant="outline">
              {trans('admin.social_links.create.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="create-social-link-form" disabled={processing}>
            {processing ? trans('admin.social_links.create.submitting') : trans('admin.social_links.create.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
