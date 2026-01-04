/**
 * Admin Settings - Performance & Cache
 */

import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useTrans } from '@/hooks/useTrans';
import { useModal } from '@/lib/modalManager';

interface PerformanceSettingsProps extends PageProps {
  settings: {
    cache_driver: string;
    cache_ttl: number;
  };
  drivers: Record<string, string>;
}

export default function PerformanceSettings({ settings, drivers }: PerformanceSettingsProps) {
  const { trans } = useTrans();
  const { confirm } = useModal();

  const { data, setData, put, processing, errors } = useForm({
    cache_driver: settings.cache_driver,
    cache_ttl: String(settings.cache_ttl),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.settings.performance.update'));
  };

  const clearCache = () => {
    confirm({
      title: trans('admin.delete.title'),
      description: trans('admin.settings.performances.clear_cache_confirm'),
      variant: 'warning',
      confirmLabel: 'Vider le cache',
      cancelLabel: 'Annuler',
      onConfirm: () => {
        router.post(route('admin.settings.cache.clear'));
      },
    });
  };

  const optimize = () => {
    router.post(route('admin.settings.cache.optimize'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.settings.performances.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.settings.performances.title')}
            description={trans('admin.settings.performances.description')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Cache Settings */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.settings.performances.cache_config_title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6" id="performance-form">
                <div className="space-y-2">
                  <Label htmlFor="cache_driver">{trans('admin.settings.performances.cache_driver')}</Label>
                  <Select
                    value={data.cache_driver}
                    onValueChange={(value) => setData('cache_driver', value)}
                  >
                    <SelectTrigger id="cache_driver">
                      <SelectValue placeholder={trans('admin.settings.performances.cache_driver_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(drivers).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cache_driver && (
                    <p className="text-sm text-destructive">{errors.cache_driver}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.settings.performances.cache_driver_help')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cache_ttl">{trans('admin.settings.performances.cache_ttl')}</Label>
                  <Select
                    value={data.cache_ttl}
                    onValueChange={(value) => setData('cache_ttl', value)}
                  >
                    <SelectTrigger id="cache_ttl">
                      <SelectValue placeholder={trans('admin.settings.performances.cache_ttl_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">{trans('admin.settings.performances.cache_ttl_5min')}</SelectItem>
                      <SelectItem value="600">{trans('admin.settings.performances.cache_ttl_10min')}</SelectItem>
                      <SelectItem value="1800">{trans('admin.settings.performances.cache_ttl_30min')}</SelectItem>
                      <SelectItem value="3600">{trans('admin.settings.performances.cache_ttl_1hour')}</SelectItem>
                      <SelectItem value="7200">{trans('admin.settings.performances.cache_ttl_2hours')}</SelectItem>
                      <SelectItem value="86400">{trans('admin.settings.performances.cache_ttl_24hours')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.cache_ttl && (
                    <p className="text-sm text-destructive">{errors.cache_ttl}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.settings.performances.cache_ttl_help')}
                  </p>
                </div>
              </form>
            </div>

            {/* Cache Actions */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{trans('admin.settings.performances.cache_management_title')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{trans('admin.settings.performances.clear_cache_title')}</p>
                    <p className="text-xs text-muted-foreground">
                      {trans('admin.settings.performances.clear_cache_description')}
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearCache}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {trans('admin.settings.performances.clear_cache_button')}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{trans('admin.settings.performances.optimize_title')}</p>
                    <p className="text-xs text-muted-foreground">
                      {trans('admin.settings.performances.optimize_description')}
                    </p>
                  </div>
                  <Button variant="outline" onClick={optimize}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {trans('admin.settings.performances.optimize_button')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <div></div>
          <Button type="submit" form="performance-form" disabled={processing}>
            {processing ? trans('admin.settings.performances.saving') : trans('admin.settings.performances.save')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
