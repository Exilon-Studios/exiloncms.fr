/**
 * Admin Users Edit - Edit existing user
 * Matches Azuriom base project structure
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, AdminUser, Role, PaginatedData } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent,
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
import { Mail, Trash2, UserX, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface ActionLog {
  id: number;
  action: string;
  created_at: string;
  target?: {
    type: string;
    name: string;
  };
}

interface UsersEditProps extends PageProps {
  user: AdminUser;
  roles: Role[];
  logs: PaginatedData<ActionLog>;
  notificationLevels: string[];
}

export default function UsersEdit({ user, roles }: UsersEditProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    role: user.role.id.toString(),
    money: user.money.toString(),
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.users.edit.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.users.update', user.id));
  };

  const verifyEmail = () => {
    router.post(route('admin.users.verify', user.id), {
      onSuccess: () => toast.success(trans('admin.users.edit.verify_sent')),
      onError: () => toast.error(trans('admin.users.edit.verify_failed')),
    });
  };

  const deleteUser = () => {
    router.delete(route('admin.users.destroy', user.id), {
      onSuccess: () => {
        toast.success(trans('admin.users.edit.deleted', { user: user.name }));
        router.visit(route('admin.users.index'));
      },
      onError: () => toast.error(trans('admin.users.edit.delete_failed')),
    });
    setDeleteDialogOpen(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.users.edit.title', { user: user.name })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle title={trans('admin.users.edit.title', { user: user.name })} />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - User Profile (Edit Form) */}
            <Card>
              <CardHeader>
                <CardTitle>{trans('admin.users.edit.profile')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{trans('admin.users.edit.name')}</Label>
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

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{trans('admin.users.edit.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">{trans('admin.users.edit.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="**********"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">{trans('admin.users.edit.role')}</Label>
                    <Select
                      value={data.role}
                      onValueChange={(value) => setData('role', value)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder={trans('admin.users.edit.role_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-destructive">{errors.role}</p>
                    )}
                  </div>

                  {/* Money */}
                  <div className="space-y-2">
                    <Label htmlFor="money">{trans('admin.users.edit.money')}</Label>
                    <Input
                      id="money"
                      type="number"
                      value={data.money}
                      onChange={(e) => setData('money', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    {errors.money && (
                      <p className="text-sm text-destructive">{errors.money}</p>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={processing}>
                      {processing ? trans('admin.users.edit.saving') : trans('admin.users.edit.save')}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {trans('admin.users.edit.delete')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Right Column - User Information (Read-only) */}
            <Card>
              <CardHeader>
                <CardTitle>{trans('admin.users.edit.information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registered */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.edit.registered')}</Label>
                  <Input value={formatDate(user.created_at)} disabled />
                </div>

                {/* Last Login */}
                {user.last_login_at && (
                  <div className="space-y-2">
                    <Label>{trans('admin.users.edit.last_login')}</Label>
                    <Input value={formatDate(user.last_login_at)} disabled />
                  </div>
                )}

                {/* Email Verified */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.edit.email_verified')}</Label>
                  {user.email_verified_at ? (
                    <Input
                      value={trans('admin.users.edit.email_verified_yes', { date: formatDate(user.email_verified_at) })}
                      disabled
                      className="text-green-600"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Input value={trans('admin.users.edit.email_verified_no')} disabled className="text-red-600" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={verifyEmail}
                      >
                        {trans('admin.users.edit.verify')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* 2FA Status */}
                <div className="space-y-2">
                  <Label>{trans('admin.users.edit.two_factor')}</Label>
                  <Input
                    value={user.two_factor_secret ? trans('admin.users.edit.two_factor_yes') : trans('admin.users.edit.two_factor_no')}
                    disabled
                    className={user.two_factor_secret ? 'text-green-600' : 'text-red-600'}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </AdminLayoutContent>
      </AdminLayout>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{trans('admin.users.edit.delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {trans('admin.users.edit.delete_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{trans('admin.users.edit.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {trans('admin.users.edit.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
