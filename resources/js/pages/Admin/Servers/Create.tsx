/**
 * Admin Servers Create - Create new server
 * Matches Azuriom base project structure
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { trans } from '@/lib/i18n';

interface ServersCreateProps extends PageProps {
  serverTypes: Record<string, string>;
}

export default function ServersCreate({ serverTypes }: ServersCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    type: Object.keys(serverTypes)[0] || 'mc-ping',
    address: '',
    port: '',
    token: '',
    join_url: '',
    data: '{}',
    home_display: true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.servers.store'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.servers.create.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle title={trans('admin.servers.create.title')} />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4" id="create-server-form">
                {/* Name and Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Server Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{trans('admin.servers.create.fields.name')}</Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Server Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">{trans('admin.servers.create.fields.type')}</Label>
                    <Select
                      value={data.type}
                      onValueChange={(value) => setData('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serverTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>
                </div>

                {/* Address and Port Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Server Address */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">{trans('admin.servers.create.fields.address')}</Label>
                    <Input
                      id="address"
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      required
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>

                  {/* Server Port */}
                  <div className="space-y-2">
                    <Label htmlFor="port">{trans('admin.servers.create.fields.port')}</Label>
                    <Input
                      id="port"
                      type="number"
                      value={data.port}
                      onChange={(e) => setData('port', e.target.value)}
                      min="1"
                      max="65535"
                    />
                    {errors.port && (
                      <p className="text-sm text-destructive">{errors.port}</p>
                    )}
                  </div>
                </div>

                {/* Home Display Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="home_display"
                    checked={data.home_display}
                    onCheckedChange={(checked) => setData('home_display', checked)}
                  />
                  <Label htmlFor="home_display" className="cursor-pointer">
                    {trans('admin.servers.create.fields.home_display')}
                  </Label>
                </div>

                {/* Join URL */}
                <div className="space-y-2">
                  <Label htmlFor="join_url">{trans('admin.servers.create.fields.join_url')}</Label>
                  <Input
                    id="join_url"
                    type="url"
                    value={data.join_url}
                    onChange={(e) => setData('join_url', e.target.value)}
                  />
                  {errors.join_url && (
                    <p className="text-sm text-destructive">{errors.join_url}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={processing}>
                    {processing ? trans('admin.servers.create.submitting') : trans('admin.servers.create.submit')}
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
