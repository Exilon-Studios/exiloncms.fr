/**
 * Admin Roles Create - Create new role
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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface RolesCreateProps extends PageProps {
  permissions: Record<string, string>;
}

export default function RolesCreate({ permissions }: RolesCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    icon: '',
    color: '#2196f3',
    is_admin: false,
    permissions: [] as string[],
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.roles.create.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.roles.store'), {
      onSuccess: () => toast.success(trans('admin.roles.create.success')),
      onError: () => toast.error(trans('admin.roles.create.error')),
    });
  };

  const togglePermission = (permission: string) => {
    if (data.permissions.includes(permission)) {
      setData('permissions', data.permissions.filter(p => p !== permission));
    } else {
      const newPermissions = [...data.permissions, permission];

      // If adding an admin.* permission (except admin.access), auto-check admin.access
      if (permission.startsWith('admin.') && permission !== 'admin.access') {
        if (!newPermissions.includes('admin.access')) {
          newPermissions.push('admin.access');
        }
      }

      setData('permissions', newPermissions);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.roles.create.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.roles.create.title')}
            description={trans('admin.roles.create.description')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} id="create-role-form" className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-3 md:grid-cols-12">
                  <div className="space-y-2 md:col-span-5">
                    <Label htmlFor="name">{trans('admin.roles.create.name')}</Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      required
                      autoFocus
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-5">
                    <Label htmlFor="icon">{trans('admin.roles.create.icon')}</Label>
                    <Input
                      id="icon"
                      type="text"
                      value={data.icon}
                      onChange={(e) => setData('icon', e.target.value)}
                      placeholder={trans('admin.roles.create.icon_placeholder')}
                    />
                    {errors.icon && (
                      <p className="text-sm text-destructive">{errors.icon}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {trans('admin.roles.create.icon_help')}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="color">{trans('admin.roles.create.color')}</Label>
                    <Input
                      id="color"
                      type="color"
                      value={data.color}
                      onChange={(e) => setData('color', e.target.value)}
                      className="h-10 cursor-pointer"
                      required
                    />
                    {errors.color && (
                      <p className="text-sm text-destructive">{errors.color}</p>
                    )}
                  </div>
                </div>

                {/* Administrator Switch */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{trans('admin.roles.create.permissions_title')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="is_admin"
                        checked={data.is_admin}
                        onCheckedChange={(checked) => setData('is_admin', checked)}
                      />
                      <div>
                        <Label htmlFor="is_admin" className="cursor-pointer font-semibold">
                          {trans('admin.roles.create.administrator')}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {trans('admin.roles.create.administrator_description')}
                        </p>
                      </div>
                    </div>
                    {errors.is_admin && (
                      <p className="text-sm text-destructive">{errors.is_admin}</p>
                    )}
                  </div>
                </div>

                {/* Permissions List */}
                {!data.is_admin && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid gap-3 md:grid-cols-2">
                        {Object.entries(permissions).map(([permission, description]) => (
                          <div key={permission} className="flex items-center gap-2">
                            <Checkbox
                              id={`perm-${permission}`}
                              checked={data.permissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <Label
                              htmlFor={`perm-${permission}`}
                              className="cursor-pointer font-normal"
                            >
                              {description}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.permissions && (
                        <p className="text-sm text-destructive mt-2">{errors.permissions}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </form>
            </CardContent>
          </Card>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.roles.index')}>
            <Button type="button" variant="outline">
              {trans('admin.roles.create.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="create-role-form" disabled={processing}>
            {processing ? trans('admin.roles.create.creating') : trans('admin.roles.create.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
