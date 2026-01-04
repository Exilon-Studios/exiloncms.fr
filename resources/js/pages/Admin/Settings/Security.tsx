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
import { Checkbox } from '@/components/ui/checkbox';
import { useTrans } from '@/hooks/useTrans';

interface SecuritySettingsProps extends PageProps {
  settings: {
    registration_enabled: boolean;
    email_verification: boolean;
    two_factor_enabled: boolean;
    password_min_length: string;
    user_change_name: boolean;
    user_upload_avatar: boolean;
    user_delete: boolean;
    admin_force_2fa: boolean;
  };
}

export default function SecuritySettings({ settings }: SecuritySettingsProps) {
  const { trans } = useTrans();

  const { data, setData, post, processing, errors, reset } = useForm({
    registration_enabled: settings.registration_enabled ?? true,
    email_verification: settings.email_verification ?? false,
    two_factor_enabled: settings.two_factor_enabled ?? false,
    password_min_length: settings.password_min_length || '8',
    user_change_name: settings.user_change_name ?? false,
    user_upload_avatar: settings.user_upload_avatar ?? false,
    user_delete: settings.user_delete ?? false,
    admin_force_2fa: settings.admin_force_2fa ?? false,
  });

  // Reset form data when page props change (after save/reload)
  useEffect(() => {
    reset({
      registration_enabled: settings.registration_enabled ?? true,
      email_verification: settings.email_verification ?? false,
      two_factor_enabled: settings.two_factor_enabled ?? false,
      password_min_length: settings.password_min_length || '8',
      user_change_name: settings.user_change_name ?? false,
      user_upload_avatar: settings.user_upload_avatar ?? false,
      user_delete: settings.user_delete ?? false,
      admin_force_2fa: settings.admin_force_2fa ?? false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.security.update'), {
      preserveScroll: true,
      preserveState: false,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.settings.security.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.settings.security.title')}
            description={trans('admin.nav.settings.security')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Settings Form - Following Maintenance.tsx pattern */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.settings.auth.title')}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Registration */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="registration_enabled"
                      checked={data.registration_enabled}
                      onCheckedChange={(checked) => setData('registration_enabled', !!checked)}
                    />
                    <Label htmlFor="registration_enabled" className="cursor-pointer">{trans('admin.settings.auth.registration')}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6" dangerouslySetInnerHTML={{ __html: trans('admin.settings.auth.registration_info') }} />
                </div>

                {/* Email Verification */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="email_verification"
                      checked={data.email_verification}
                      onCheckedChange={(checked) => setData('email_verification', !!checked)}
                    />
                    <Label htmlFor="email_verification" className="cursor-pointer">{trans('admin.settings.mail.verification')}</Label>
                  </div>
                </div>

                {/* Two Factor Auth */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="two_factor_enabled"
                      checked={data.two_factor_enabled}
                      onCheckedChange={(checked) => setData('two_factor_enabled', !!checked)}
                    />
                    <Label htmlFor="two_factor_enabled" className="cursor-pointer">{trans('admin.users.edit.two_factor')}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Enable 2FA for user accounts
                  </p>
                </div>

                {/* Password Min Length */}
                <div className="space-y-2">
                  <Label htmlFor="password_min_length">{trans('admin.settings.security.password_min_length')}</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    min="6"
                    max="20"
                    value={data.password_min_length}
                    onChange={(e) => setData('password_min_length', e.target.value)}
                    className="bg-background max-w-xs"
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-6">User Permissions</h3>
                </div>

                {/* User Change Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="user_change_name"
                      checked={data.user_change_name}
                      onCheckedChange={(checked) => setData('user_change_name', !!checked)}
                    />
                    <Label htmlFor="user_change_name" className="cursor-pointer">{trans('admin.settings.auth.user_change_name')}</Label>
                  </div>
                </div>

                {/* User Upload Avatar */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="user_upload_avatar"
                      checked={data.user_upload_avatar}
                      onCheckedChange={(checked) => setData('user_upload_avatar', !!checked)}
                    />
                    <Label htmlFor="user_upload_avatar" className="cursor-pointer">{trans('admin.settings.auth.user_avatar')}</Label>
                  </div>
                </div>

                {/* User Delete */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="user_delete"
                      checked={data.user_delete}
                      onCheckedChange={(checked) => setData('user_delete', !!checked)}
                    />
                    <Label htmlFor="user_delete" className="cursor-pointer">{trans('admin.settings.auth.user_delete')}</Label>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-6">Admin Settings</h3>
                </div>

                {/* Admin Force 2FA */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="admin_force_2fa"
                      checked={data.admin_force_2fa}
                      onCheckedChange={(checked) => setData('admin_force_2fa', !!checked)}
                    />
                    <Label htmlFor="admin_force_2fa" className="cursor-pointer">{trans('admin.settings.security.force_2fa')}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Require admins to use two-factor authentication
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="submit" disabled={processing}>
                    {processing ? trans('admin.users.edit.saving') : trans('messages.actions.save')}
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
