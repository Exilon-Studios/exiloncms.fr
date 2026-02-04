/**
 * Admin Roles Edit - Edit existing role
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface Permission {
  id: number;
  permission: string;
}

interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

interface RolesEditProps extends PageProps {
  role: RoleWithPermissions;
  permissions: Record<string, string>;
}

export default function RolesEdit({ role, permissions }: RolesEditProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, setData, put, processing, errors } = useForm({
    name: role.name || '',
    icon: role.icon || '',
    is_admin: role.is_admin || false,
    permissions: role.permissions?.map(p => p.permission) || [],
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.roles.edit.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.roles.update', role.id), {
      onSuccess: () => toast.success(trans('admin.roles.edit.success')),
      onError: () => toast.error(trans('admin.roles.edit.error')),
    });
  };

  const handleDelete = () => {
    router.delete(route('admin.roles.destroy', role.id), {
      onSuccess: () => {
        toast.success(trans('admin.roles.index.deleted', { role: role.name }));
        setDeleteDialogOpen(false);
      },
      onError: () => toast.error(trans('admin.roles.index.delete_failed')),
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

  // Group permissions by category
  const permissionGroups: Record<string, string[]> = {
    'users': Object.entries(permissions).filter(([k]) => k.startsWith('admin.users')).map(([k, v]) => k),
    'content': Object.entries(permissions).filter(([k]) => k.startsWith('admin.pages') || k.startsWith('admin.posts') || k.startsWith('admin.images')).map(([k, v]) => k),
    'admin': Object.entries(permissions).filter(([k]) => k.startsWith('admin.admin') || k.startsWith('admin.settings') || k.startsWith('admin.roles')).map(([k, v]) => k),
    'other': Object.entries(permissions).filter(([k]) => !k.startsWith('admin.users') && !k.startsWith('admin.pages') && !k.startsWith('admin.posts') && !k.startsWith('admin.images') && !k.startsWith('admin.admin') && !k.startsWith('admin.settings') && !k.startsWith('admin.roles')).map(([k, v]) => k),
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.roles.edit.title', { role: role.name })} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('admin.roles.index')}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {trans('admin.roles.edit.title', { role: role.name })}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {data.permissions.length} {data.permissions.length > 1 ? 'permissions' : 'permission'}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {trans('admin.roles.edit.delete')}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information - Simplified */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{trans('admin.roles.edit.name')}</Label>
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
              </CardContent>
            </Card>

            {/* Permissions */}
            {!data.is_admin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{trans('admin.roles.edit.permissions_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(permissionGroups).map(([category, perms]) => (
                    perms.length > 0 && (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          {category === 'users' && 'Utilisateurs'}
                          {category === 'content' && 'Contenu'}
                          {category === 'admin' && 'Administration'}
                          {category === 'other' && 'Autres'}
                        </h4>
                        <div className="space-y-2">
                          {perms.map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <Checkbox
                                id={`perm-${permission}`}
                                checked={data.permissions.includes(permission)}
                                onCheckedChange={() => togglePermission(permission)}
                              />
                              <Label
                                htmlFor={`perm-${permission}`}
                                className="cursor-pointer font-normal text-sm"
                              >
                                {permissions[permission]}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  {errors.permissions && (
                    <p className="text-sm text-destructive mt-2">{errors.permissions}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Administrator Switch */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_admin"
                    checked={data.is_admin}
                    onCheckedChange={(checked) => setData('is_admin', checked)}
                  />
                  <div>
                    <Label htmlFor="is_admin" className="cursor-pointer font-medium">
                      {trans('admin.roles.edit.administrator')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {trans('admin.roles.edit.administrator_description')}
                    </p>
                  </div>
                </div>
                {errors.is_admin && (
                  <p className="text-sm text-destructive mt-2">{errors.is_admin}</p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Permissions</span>
                  <span className="font-medium">{data.permissions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{data.is_admin ? 'Admin' : 'Custom'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Power</span>
                  <span className="font-medium">{role.power}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button
                    form="edit-role-form"
                    type="submit"
                    disabled={processing}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? trans('admin.roles.edit.saving') : trans('admin.roles.edit.save')}
                  </Button>
                  <Link href={route('admin.roles.index')} className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                      {trans('admin.roles.edit.cancel')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden form for submit */}
        <form onSubmit={handleSubmit} id="edit-role-form" className="hidden" />
      </div>
    </AuthenticatedLayout>
  );
}
