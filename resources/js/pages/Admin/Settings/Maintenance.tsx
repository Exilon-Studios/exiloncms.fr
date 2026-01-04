/**
 * Admin Settings - Maintenance Mode
 * Following the same pattern as Index.tsx that works
 */

import { Head, useForm } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';

interface MaintenanceSettingsProps extends PageProps {
  status: boolean;
  title: string | null;
  subtitle: string | null;
  paths: string[] | null;
}

export default function MaintenanceSettings({ status, paths, title, subtitle }: MaintenanceSettingsProps) {
  const { trans } = useTrans();

  const { data, setData, post, processing, errors, reset } = useForm({
    maintenance_status: status,
    maintenance_title: title || '',
    maintenance_subtitle: subtitle || '',
    retry_after: '3600',
    is_global: !paths || paths.length === 0,
  });

  // IMPORTANT: Reset form data when page props change (after save/reload)
  useEffect(() => {
    reset({
      maintenance_status: status,
      maintenance_title: title || '',
      maintenance_subtitle: subtitle || '',
      retry_after: '3600',
      is_global: !paths || paths.length === 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, title, subtitle, paths]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.maintenance.update'), {
      // Force complete page reload to get fresh data from server
      preserveScroll: true,
      preserveState: false,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.settings.maintenance.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.settings.maintenance.title')}
            description={trans('admin.settings.maintenance.description')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Status Banner */}
            {status && (
              <div className="border border-destructive bg-destructive/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      {trans('admin.settings.maintenance.active_banner')}
                    </p>
                    <p className="text-xs text-destructive/80">
                      {trans('admin.settings.maintenance.active_description')}
                    </p>
                  </div>
                  <Badge variant="destructive">{trans('admin.settings.maintenance.active_badge')}</Badge>
                </div>
              </div>
            )}

            {/* Settings Form - Following Index.tsx pattern */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.settings.maintenance.configuration_title')}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Enable Maintenance Mode */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="maintenance_status"
                      checked={data.maintenance_status}
                      onCheckedChange={(checked) => setData('maintenance_status', !!checked)}
                    />
                    <Label htmlFor="maintenance_status" className="cursor-pointer">
                      {trans('admin.settings.maintenance.enable_mode')}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    {trans('admin.settings.maintenance.enable_help')}
                  </p>
                  {errors.maintenance_status && (
                    <p className="text-sm text-destructive ml-6">{errors.maintenance_status}</p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="maintenance_title">{trans('admin.settings.maintenance.title_label')}</Label>
                  <Input
                    id="maintenance_title"
                    value={data.maintenance_title}
                    onChange={(e) => setData('maintenance_title', e.target.value)}
                    placeholder={trans('admin.settings.maintenance.title_placeholder')}
                    className="max-w-md"
                  />
                  {errors.maintenance_title && (
                    <p className="text-sm text-destructive">{errors.maintenance_title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.settings.maintenance.title_help')}
                  </p>
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="maintenance_subtitle">{trans('admin.settings.maintenance.subtitle_label')}</Label>
                  <Textarea
                    id="maintenance_subtitle"
                    value={data.maintenance_subtitle}
                    onChange={(e) => setData('maintenance_subtitle', e.target.value)}
                    placeholder={trans('admin.settings.maintenance.subtitle_placeholder')}
                    rows={3}
                    className="bg-background"
                  />
                  {errors.maintenance_subtitle && (
                    <p className="text-sm text-destructive">{errors.maintenance_subtitle}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.settings.maintenance.subtitle_help')}
                  </p>
                </div>

                {/* Retry After */}
                <div className="space-y-2">
                  <Label htmlFor="retry_after">{trans('admin.settings.maintenance.retry_after')}</Label>
                  <Input
                    id="retry_after"
                    type="number"
                    value={data.retry_after}
                    onChange={(e) => setData('retry_after', e.target.value)}
                    placeholder="3600"
                    min="0"
                    className="max-w-xs"
                  />
                  {errors.retry_after && (
                    <p className="text-sm text-destructive">{errors.retry_after}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.settings.maintenance.retry_after_help')}
                  </p>
                </div>

                {/* Submit Button - Inside the form like Index.tsx */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="submit" disabled={processing}>
                    {processing ? trans('admin.settings.maintenance.saving') : trans('admin.settings.maintenance.save')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <div></div>
          <div></div>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
