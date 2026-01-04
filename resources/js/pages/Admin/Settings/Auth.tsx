/**
 * Admin Settings - Authentication
 */

import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
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

interface AuthSettingsProps extends PageProps {
  settings: {
    registration_enabled: boolean;
    email_verification: boolean;
    two_factor_enabled: boolean;
    password_min_length: string;
  };
}

export default function AuthSettings({ settings }: AuthSettingsProps) {
  const { data, setData, put, processing, errors } = useForm({
    registration_enabled: settings.registration_enabled,
    email_verification: settings.email_verification,
    two_factor_enabled: settings.two_factor_enabled,
    password_min_length: settings.password_min_length,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.settings.auth.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Authentication Settings" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Authentication Settings"
            description="Manage user registration and authentication options"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">Authentication Options</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="auth-form">
              {/* Registration Enabled */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="registration_enabled"
                    type="checkbox"
                    checked={data.registration_enabled}
                    onChange={(e) => setData('registration_enabled', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="registration_enabled" className="cursor-pointer">
                    Allow User Registration
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Enable this to allow new users to register on your site
                </p>
                {errors.registration_enabled && (
                  <p className="text-sm text-destructive ml-6">{errors.registration_enabled}</p>
                )}
              </div>

              {/* Email Verification */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="email_verification"
                    type="checkbox"
                    checked={data.email_verification}
                    onChange={(e) => setData('email_verification', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="email_verification" className="cursor-pointer">
                    Require Email Verification
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Users must verify their email address after registration
                </p>
                {errors.email_verification && (
                  <p className="text-sm text-destructive ml-6">{errors.email_verification}</p>
                )}
              </div>

              {/* Two-Factor Authentication */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="two_factor_enabled"
                    type="checkbox"
                    checked={data.two_factor_enabled}
                    onChange={(e) => setData('two_factor_enabled', e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="two_factor_enabled" className="cursor-pointer">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Allow users to enable 2FA for additional security
                </p>
                {errors.two_factor_enabled && (
                  <p className="text-sm text-destructive ml-6">{errors.two_factor_enabled}</p>
                )}
              </div>

              {/* Password Minimum Length */}
              <div className="space-y-2">
                <Label htmlFor="password_min_length">Minimum Password Length</Label>
                <Input
                  id="password_min_length"
                  type="number"
                  value={data.password_min_length}
                  onChange={(e) => setData('password_min_length', e.target.value)}
                  min="6"
                  max="128"
                  className="max-w-xs"
                />
                {errors.password_min_length && (
                  <p className="text-sm text-destructive">{errors.password_min_length}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum number of characters required for passwords
                </p>
              </div>
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <div></div>
          <Button type="submit" form="auth-form" disabled={processing}>
            {processing ? 'Saving...' : 'Save Changes'}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
