/**
 * Admin Redirects Edit - Edit existing redirect
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

interface Redirect {
  id: number;
  source: string;
  destination: string;
  code: number;
  is_enabled: boolean;
}

interface RedirectsEditProps extends PageProps {
  redirect: Redirect;
}

export default function RedirectsEdit({ redirect }: RedirectsEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    source: redirect.source,
    destination: redirect.destination,
    code: redirect.code.toString(),
    is_enabled: redirect.is_enabled,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.redirects.update', redirect.id));
  };

  const deleteRedirect = () => {
    if (confirm(trans('admin.redirects.edit.delete_confirm'))) {
      router.delete(route('admin.redirects.destroy', redirect.id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.redirects.edit.title', { source: redirect.source })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.redirects.edit.title_page')}
            description={trans('admin.redirects.edit.description', { source: redirect.source })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.redirects.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.redirects.edit.back')}
              </Button>
            </Link>
            <Button variant="destructive" onClick={deleteRedirect}>
              <Trash2 className="mr-2 h-4 w-4" />
              {trans('admin.redirects.edit.delete')}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.redirects.edit.form_title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="edit-redirect-form">
              {/* Source Path */}
              <div className="space-y-2">
                <Label htmlFor="source">{trans('admin.redirects.edit.source')} *</Label>
                <Input
                  id="source"
                  type="text"
                  value={data.source}
                  onChange={(e) => setData('source', e.target.value)}
                  required
                />
                {errors.source && (
                  <p className="text-sm text-destructive">{errors.source}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {trans('admin.redirects.edit.source_help')}
                </p>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">{trans('admin.redirects.edit.destination')} *</Label>
                <Input
                  id="destination"
                  type="text"
                  value={data.destination}
                  onChange={(e) => setData('destination', e.target.value)}
                  required
                />
                {errors.destination && (
                  <p className="text-sm text-destructive">{errors.destination}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {trans('admin.redirects.edit.destination_help')}
                </p>
              </div>

              {/* Redirect Code */}
              <div className="space-y-2">
                <Label htmlFor="code">{trans('admin.redirects.edit.type')} *</Label>
                <Select
                  value={data.code}
                  onValueChange={(value) => setData('code', value)}
                >
                  <SelectTrigger id="code">
                    <SelectValue placeholder={trans('admin.redirects.edit.type_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">{trans('admin.redirects.edit.type_301')}</SelectItem>
                    <SelectItem value="302">{trans('admin.redirects.edit.type_302')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {trans('admin.redirects.edit.type_help')}
                </p>
              </div>

              {/* Enabled Status */}
              <div className="flex items-center gap-2">
                <input
                  id="is_enabled"
                  type="checkbox"
                  checked={data.is_enabled}
                  onChange={(e) => setData('is_enabled', e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="is_enabled" className="cursor-pointer">
                  {trans('admin.redirects.edit.enabled')}
                </Label>
              </div>
              {errors.is_enabled && (
                <p className="text-sm text-destructive">{errors.is_enabled}</p>
              )}
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.redirects.index')}>
            <Button type="button" variant="outline">
              {trans('admin.redirects.edit.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="edit-redirect-form" disabled={processing}>
            {processing ? trans('admin.redirects.edit.saving') : trans('admin.redirects.edit.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
