/**
 * Admin Settings - Simplified interface
 */

import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

interface SiteSettings {
  name: string;
  description: string;
  url: string;
  icon: string | null;
  logo: string | null;
  background: string | null;
  locale: string;
  timezone: string;
  copyright: string | null;
  conditions: string | null;
  money: string;
  site_key: string | null;
  user_money_transfer: boolean;
  posts_webhook: string | null;
  keywords: string;
}

interface SettingsIndexProps extends PageProps {
  settings: SiteSettings;
  locales: Record<string, string>;
  timezones: string[];
}

export default function SettingsIndex({
  settings: initialSettings,
  locales,
  timezones,
}: SettingsIndexProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: initialSettings.name || 'ExilonCMS',
    description: initialSettings.description || '',
    url: initialSettings.url || window.location.origin,
    locale: initialSettings.locale || 'en',
    timezone: initialSettings.timezone || 'UTC',
    money: initialSettings.money || 'Points',
    copyright: initialSettings.copyright || '',
    conditions: initialSettings.conditions || '',
    keywords: initialSettings.keywords || '',
    user_money_transfer: initialSettings.user_money_transfer || false,
    icon: initialSettings.icon || '',
    logo: initialSettings.logo || '',
    background: initialSettings.background || '',
    site_key: initialSettings.site_key || '',
    posts_webhook: initialSettings.posts_webhook || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.nav.settings.settings')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.nav.settings.settings')}
            description={trans('admin.settings.index.title')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <form onSubmit={handleSubmit} id="settings-form" className="space-y-6 overflow-y-auto">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{trans('admin.settings.index.title')}</CardTitle>
                <CardDescription>{trans('admin.settings.index.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{trans('admin.settings.index.name')} *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      required
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="money">{trans('admin.settings.index.money')} *</Label>
                    <Input
                      id="money"
                      type="text"
                      value={data.money}
                      onChange={(e) => setData('money', e.target.value)}
                      required
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{trans('admin.settings.index.description')}</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    maxLength={255}
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">{trans('admin.settings.index.url')} *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    required
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="locale">{trans('admin.settings.index.locale')}</Label>
                    <Select
                      value={data.locale}
                      onValueChange={(value) => setData('locale', value)}
                    >
                      <SelectTrigger id="locale">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">{trans('admin.settings.index.timezone')}</Label>
                    <Select
                      value={data.timezone}
                      onValueChange={(value) => setData('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
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
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="copyright">{trans('admin.settings.index.copyright')}</Label>
                  <Input
                    id="copyright"
                    type="text"
                    value={data.copyright}
                    onChange={(e) => setData('copyright', e.target.value)}
                    maxLength={150}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">{trans('admin.settings.index.meta')}</Label>
                  <Input
                    id="keywords"
                    type="text"
                    value={data.keywords}
                    onChange={(e) => setData('keywords', e.target.value)}
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground">{trans('admin.settings.index.meta_info')}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user_money_transfer">{trans('admin.settings.index.user_money_transfer')}</Label>
                  </div>
                  <Switch
                    id="user_money_transfer"
                    checked={data.user_money_transfer}
                    onCheckedChange={(checked) => setData('user_money_transfer', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" form="settings-form" disabled={processing}>
              <Save className="mr-2 h-4 w-4" />
              {processing ? trans('admin.settings.index.saving') : trans('admin.settings.index.save')}
            </Button>
          </form>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <div></div>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
