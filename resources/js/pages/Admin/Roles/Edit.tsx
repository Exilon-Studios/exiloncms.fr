/**
 * Admin Roles Edit - Edit existing role
 */

import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Role } from '@/types';
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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
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
    color: role.color || '#2196f3',
    is_admin: role.is_admin || false,
    permissions: role.permissions?.map(p => p.permission) || [],
  });

  // Call trans() during render
  const t = {
    fixErrors: trans('admin.roles.edit.fix_errors'),
    success: trans('admin.roles.edit.success'),
    error: trans('admin.roles.edit.error'),
    deleted: trans('admin.roles.edit.deleted', { role: role.name }),
    deleteFailed: trans('admin.roles.edit.delete_failed'),
    title: trans('admin.roles.edit.title', { role: role.name }),
    description: trans('admin.roles.edit.description'),
    delete: trans('admin.roles.edit.delete'),
    name: trans('admin.roles.edit.name'),
    icon: trans('admin.roles.edit.icon'),
    iconPlaceholder: trans('admin.roles.edit.icon_placeholder'),
    iconHelp: trans('admin.roles.edit.icon_help'),
    color: trans('admin.roles.edit.color'),
    permissionsTitle: trans('admin.roles.edit.permissions_title'),
    administrator: trans('admin.roles.edit.administrator'),
    administratorDescription: trans('admin.roles.edit.administrator_description'),
    cancel: trans('admin.roles.edit.cancel'),
    saving: trans('admin.roles.edit.saving'),
    save: trans('admin.roles.edit.save'),
    deleteTitle: trans('admin.roles.edit.delete_title'),
    deleteDescription: trans('admin.roles.edit.delete_description'),
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(t.fixErrors);
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.roles.update', role.id), {
      onSuccess: () => toast.success(t.success),
      onError: () => toast.error(t.error),
    });
  };

  const handleDelete = () => {
    router.delete(route('admin.roles.destroy', role.id), {
      onSuccess: () => {
        toast.success(t.deleted);
        setDeleteDialogOpen(false);
      },
      onError: () => toast.error(t.deleteFailed),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={t.title} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={t.title}
            description={t.description}
          />
          <AdminLayoutActions>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t.delete}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} id="edit-role-form" className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-3 md:grid-cols-12">
                  <div className="space-y-2 md:col-span-5">
                    <Label htmlFor="name">{t.name}</Label>
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
                    <Label htmlFor="icon">{t.icon}</Label>
                    <Input
                      id="icon"
                      type="text"
                      value={data.icon}
                      onChange={(e) => setData('icon', e.target.value)}
                      placeholder={t.iconPlaceholder}
                    />
                    {errors.icon && (
                      <p className="text-sm text-destructive">{errors.icon}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t.iconHelp}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="color">{t.color}</Label>
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
                  <h3 className="text-lg font-medium">{t.permissionsTitle}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="is_admin"
                        checked={data.is_admin}
                        onCheckedChange={(checked) => setData('is_admin', checked)}
                      />
                      <div>
                        <Label htmlFor="is_admin" className="cursor-pointer font-semibold">
                          {t.administrator}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {t.administratorDescription}
                        </p>
                      </div>
                    </div>
                    {errors.is_admin && (
                      <p className="text-sm text-destructive">{errors.is_admin}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.roles.index')}>
            <Button type="button" variant="outline">
              {t.cancel}
            </Button>
          </Link>
          <Button type="submit" form="edit-role-form" disabled={processing}>
            {processing ? t.saving : t.save}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
