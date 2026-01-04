/**
 * Admin Servers Edit - Edit existing server
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Server } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, TestTube2, Star } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface ServersEditProps extends PageProps {
  server: Server;
  serverTypes: Record<string, string>;
}

export default function ServersEdit({ server, serverTypes }: ServersEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: server.name,
    type: server.type,
    address: server.address,
    port: server.port?.toString() || '',
    token: server.token || '',
    join_url: server.join_url || '',
    data: JSON.stringify(server.data, null, 2),
    home_display: server.home_display,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.servers.update', server.id));
  };

  const testConnection = () => {
    router.post(route('admin.servers.test', server.id), {}, {
      preserveScroll: true,
    });
  };

  const setAsDefault = () => {
    router.post(route('admin.servers.set-default', server.id));
  };

  const deleteServer = () => {
    if (confirm(trans('admin.servers.edit.confirm_delete'))) {
      router.delete(route('admin.servers.destroy', server.id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.servers.edit.page_title', { name: server.name })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.servers.edit.title')}
            description={trans('admin.servers.edit.description', { name: server.name })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.servers.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.servers.edit.back_button')}
              </Button>
            </Link>
            <Button variant="destructive" onClick={deleteServer}>
              <Trash2 className="mr-2 h-4 w-4" />
              {trans('admin.servers.edit.delete_button')}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Server Status */}
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{trans('admin.servers.edit.status_label')}</span>
                  {server.is_online ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {trans('admin.servers.edit.status.online')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
                      {trans('admin.servers.edit.status.offline')}
                    </Badge>
                  )}
                  {server.is_default && (
                    <Badge>
                      <Star className="h-3 w-3 mr-1" />
                      {trans('admin.servers.edit.default_badge')}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={testConnection}>
                  <TestTube2 className="h-4 w-4 mr-2" />
                  {trans('admin.servers.edit.test_connection_button')}
                </Button>
                {!server.is_default && (
                  <Button variant="outline" size="sm" onClick={setAsDefault}>
                    <Star className="h-4 w-4 mr-2" />
                    {trans('admin.servers.edit.set_default_button')}
                  </Button>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.servers.edit.form_title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6" id="edit-server-form">
                {/* Server Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{trans('admin.servers.edit.fields.name')}</Label>
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
                  <Label htmlFor="type">{trans('admin.servers.edit.fields.type')}</Label>
                  <Select
                    value={data.type}
                    onValueChange={(value) => setData('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder={trans('admin.servers.edit.fields.type_placeholder')} />
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

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Server Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">{trans('admin.servers.edit.fields.address')}</Label>
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
                    <Label htmlFor="port">{trans('admin.servers.edit.fields.port')}</Label>
                    <Input
                      id="port"
                      type="number"
                      value={data.port}
                      onChange={(e) => setData('port', e.target.value)}
                      placeholder={trans('admin.servers.edit.fields.port_placeholder')}
                      min="1"
                      max="65535"
                    />
                    {errors.port && (
                      <p className="text-sm text-destructive">{errors.port}</p>
                    )}
                  </div>
                </div>

                {/* Token (for AzLink) */}
                {(data.type === 'mc-azlink' || data.type === 'steam-azlink') && (
                  <div className="space-y-2">
                    <Label htmlFor="token">{trans('admin.servers.edit.fields.token')}</Label>
                    <Input
                      id="token"
                      type="text"
                      value={data.token}
                      onChange={(e) => setData('token', e.target.value)}
                      placeholder={trans('admin.servers.edit.fields.token_placeholder')}
                      readOnly
                      className="font-mono text-sm"
                    />
                    {errors.token && (
                      <p className="text-sm text-destructive">{errors.token}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {trans('admin.servers.edit.fields.token_info')}
                    </p>
                  </div>
                )}

                {/* Join URL */}
                <div className="space-y-2">
                  <Label htmlFor="join_url">{trans('admin.servers.edit.fields.join_url')}</Label>
                  <Input
                    id="join_url"
                    type="url"
                    value={data.join_url}
                    onChange={(e) => setData('join_url', e.target.value)}
                    placeholder={trans('admin.servers.edit.fields.join_url_placeholder')}
                  />
                  {errors.join_url && (
                    <p className="text-sm text-destructive">{errors.join_url}</p>
                  )}
                </div>

                {/* Additional Data (JSON) */}
                <div className="space-y-2">
                  <Label htmlFor="data">{trans('admin.servers.edit.fields.data')}</Label>
                  <Textarea
                    id="data"
                    value={data.data}
                    onChange={(e) => setData('data', e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  {errors.data && (
                    <p className="text-sm text-destructive">{errors.data}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.servers.edit.fields.data_info')}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.servers.index')}>
            <Button type="button" variant="outline">
              {trans('admin.servers.edit.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="edit-server-form" disabled={processing}>
            {processing ? trans('admin.servers.edit.submitting') : trans('admin.servers.edit.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
