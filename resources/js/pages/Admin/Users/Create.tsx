/**
 * Admin Users Create - Create new user
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface UsersCreateProps extends PageProps {
  roles: Role[];
}

export default function UsersCreate({ roles }: UsersCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: roles[0]?.id.toString() || '',
    money: '0',
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error(trans('admin.users.create.fix_errors'));
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'), {
      onSuccess: () => toast.success(trans('admin.users.create.success')),
      onError: () => toast.error(trans('admin.users.create.error')),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.users.create.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.users.create.title')}
            description={trans('admin.users.create.description')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <form onSubmit={handleSubmit} id="create-user-form" className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{trans('admin.users.create.basic_info')}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{trans('admin.users.create.username')} *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder={trans('admin.users.create.username_placeholder')}
                    required
                    maxLength={25}
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{trans('admin.users.create.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder={trans('admin.users.create.email_placeholder')}
                    required
                    maxLength={50}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{trans('admin.users.create.security')}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">{trans('admin.users.create.password')} *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">{trans('admin.users.create.password_confirmation')} *</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Permissions & Currency */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{trans('admin.users.create.permissions_currency')}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">{trans('admin.users.create.role')} *</Label>
                  <Select
                    value={data.role}
                    onValueChange={(value) => setData('role', value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder={trans('admin.users.create.role_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name} ({trans('admin.users.create.power')}: {role.power})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="money">{trans('admin.users.create.initial_money')}</Label>
                  <Input
                    id="money"
                    type="number"
                    value={data.money}
                    onChange={(e) => setData('money', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.money && (
                    <p className="text-sm text-destructive">{errors.money}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.users.index')}>
            <Button type="button" variant="outline">
              {trans('admin.users.create.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="create-user-form" disabled={processing}>
            {processing ? trans('admin.users.create.creating') : trans('admin.users.create.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
