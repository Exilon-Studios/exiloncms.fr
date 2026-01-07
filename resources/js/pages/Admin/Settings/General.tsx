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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTrans } from '@/hooks/useTrans';

interface GeneralSettingsProps extends PageProps {
  settings: any;
  images: any[];
  locales: Record<string, string>;
  timezones: string[];
}

export default function GeneralSettings({
  settings: initialSettings,
  images,
  locales,
  timezones,
}: GeneralSettingsProps) {
  const { trans } = useTrans();

  const { data, setData, post, processing, errors, reset } = useForm({
    name: initialSettings.name || 'ExilonCMS',
    description: initialSettings.description || '',
    url: initialSettings.url || window.location.origin,
    locale: initialSettings.locale || 'en',
    timezone: initialSettings.timezone || 'UTC',
    money: initialSettings.money || 'Points',
    copyright: initialSettings.copyright || '',
    keywords: initialSettings.keywords || '',
    user_money_transfer: initialSettings.user_money_transfer || false,
  });

  // IMPORTANT: Reset form data when page props change (after save/reload)
  useEffect(() => {
    reset({
      name: initialSettings.name || 'ExilonCMS',
      description: initialSettings.description || '',
      url: initialSettings.url || window.location.origin,
      locale: initialSettings.locale || 'en',
      timezone: initialSettings.timezone || 'UTC',
      money: initialSettings.money || 'Points',
      copyright: initialSettings.copyright || '',
      keywords: initialSettings.keywords || '',
      user_money_transfer: initialSettings.user_money_transfer || false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSettings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.general.update'), {
      // Force complete page reload to get fresh data from server
      preserveScroll: true,
      preserveState: false,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.settings.index.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.settings.index.title')}
            description={trans('admin.nav.settings.general')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Settings Form - Following Maintenance.tsx pattern */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.settings.index.title')}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Site Name & URL - Side by side */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Site Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{trans('admin.settings.index.name')}</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  {/* URL */}
                  <div className="space-y-2">
                    <Label htmlFor="url">{trans('admin.settings.index.url')}</Label>
                    <Input
                      id="url"
                      type="url"
                      value={data.url}
                      onChange={(e) => setData('url', e.target.value)}
                    />
                    {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
                  </div>
                </div>

                {/* Description - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="description">{trans('admin.settings.index.description')}</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    className="bg-background"
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Locale & Timezone - Side by side */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Locale */}
                  <div className="space-y-2">
                    <Label htmlFor="locale">{trans('admin.settings.index.locale')}</Label>
                    <Select
                      value={data.locale}
                      onValueChange={(value) => setData('locale', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(locales).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.locale && <p className="text-sm text-destructive">{errors.locale}</p>}
                  </div>

                  {/* Timezone */}
                  <div className="space-y-2">
                    <Label htmlFor="timezone">{trans('admin.settings.index.timezone')}</Label>
                    <Select
                      value={data.timezone}
                      onValueChange={(value) => setData('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timezone && <p className="text-sm text-destructive">{errors.timezone}</p>}
                  </div>
                </div>

                {/* Money & Copyright - Side by side */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Money */}
                  <div className="space-y-2">
                    <Label htmlFor="money">{trans('admin.settings.index.money')}</Label>
                    <Input
                      id="money"
                      value={data.money}
                      onChange={(e) => setData('money', e.target.value)}
                    />
                    {errors.money && <p className="text-sm text-destructive">{errors.money}</p>}
                  </div>

                  {/* Copyright */}
                  <div className="space-y-2">
                    <Label htmlFor="copyright">{trans('admin.settings.index.copyright')}</Label>
                    <Input
                      id="copyright"
                      value={data.copyright}
                      onChange={(e) => setData('copyright', e.target.value)}
                    />
                    {errors.copyright && <p className="text-sm text-destructive">{errors.copyright}</p>}
                  </div>
                </div>

                {/* Keywords - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="keywords">{trans('admin.settings.index.meta')}</Label>
                  <Textarea
                    id="keywords"
                    value={data.keywords}
                    onChange={(e) => setData('keywords', e.target.value)}
                    rows={2}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">{trans('admin.settings.index.meta_info')}</p>
                  {errors.keywords && <p className="text-sm text-destructive">{errors.keywords}</p>}
                </div>

                {/* User Money Transfer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="user_money_transfer"
                      checked={data.user_money_transfer}
                      onCheckedChange={(checked) => setData('user_money_transfer', !!checked)}
                    />
                    <Label htmlFor="user_money_transfer" className="cursor-pointer">
                      {trans('admin.settings.index.user_money_transfer')}
                    </Label>
                  </div>
                  {errors.user_money_transfer && (
                    <p className="text-sm text-destructive ml-6">{errors.user_money_transfer}</p>
                  )}
                </div>

                {/* Submit Button - Inside the form like Maintenance.tsx */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="submit" disabled={processing}>
                    {processing ? trans('admin.settings.updated') : trans('messages.actions.save')}
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
