/**
 * Admin Settings - Mail Configuration
 */

import { Head, useForm, router } from '@inertiajs/react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';

interface MailSettingsProps extends PageProps {
  settings: {
    mail_mailer: string;
    mail_host: string;
    mail_port: string;
    mail_username: string;
    mail_password: string;
    mail_encryption: string;
    mail_from_address: string;
    mail_from_name: string;
  };
}

export default function MailSettings({ settings }: MailSettingsProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    mail_mailer: settings.mail_mailer || 'smtp',
    mail_host: settings.mail_host || '',
    mail_port: settings.mail_port || '587',
    mail_username: settings.mail_username || '',
    mail_password: settings.mail_password || '',
    mail_encryption: settings.mail_encryption || 'tls',
    mail_from_address: settings.mail_from_address || '',
    mail_from_name: settings.mail_from_name || '',
  });

  // Reset form data when page props change (after save/reload)
  useEffect(() => {
    reset({
      mail_mailer: settings.mail_mailer || 'smtp',
      mail_host: settings.mail_host || '',
      mail_port: settings.mail_port || '587',
      mail_username: settings.mail_username || '',
      mail_password: settings.mail_password || '',
      mail_encryption: settings.mail_encryption || 'tls',
      mail_from_address: settings.mail_from_address || '',
      mail_from_name: settings.mail_from_name || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.mail.update'), {
      preserveScroll: true,
      preserveState: false,
    });
  };

  const sendTestEmail = () => {
    router.post(route('admin.settings.mail.test'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Mail Settings" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Mail Settings"
            description="Configure email delivery settings"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Settings Form - Following Maintenance.tsx pattern */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">Mail Configuration</h3>

              <form onSubmit={handleSubmit} className="space-y-6" id="mail-form">
              {/* Mail Mailer */}
              <div className="space-y-2">
                <Label htmlFor="mail_mailer">Mail Driver</Label>
                <Select
                  value={data.mail_mailer}
                  onValueChange={(value) => setData('mail_mailer', value)}
                >
                  <SelectTrigger id="mail_mailer" className="bg-background">
                    <SelectValue placeholder="Select mail driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendmail">Sendmail</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="log">Log (Development)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.mail_mailer && (
                  <p className="text-sm text-destructive">{errors.mail_mailer}</p>
                )}
              </div>

              {data.mail_mailer === 'smtp' && (
                <>
                  <div className="border-t border-border pt-6">
                    <h4 className="text-base font-semibold text-card-foreground mb-4">SMTP Configuration</h4>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Host */}
                    <div className="space-y-2">
                      <Label htmlFor="mail_host">SMTP Host</Label>
                      <Input
                        id="mail_host"
                        type="text"
                        value={data.mail_host}
                        onChange={(e) => setData('mail_host', e.target.value)}
                        placeholder="smtp.example.com"
                        className="bg-background"
                      />
                      {errors.mail_host && (
                        <p className="text-sm text-destructive">{errors.mail_host}</p>
                      )}
                    </div>

                    {/* Port */}
                    <div className="space-y-2">
                      <Label htmlFor="mail_port">SMTP Port</Label>
                      <Input
                        id="mail_port"
                        type="text"
                        inputMode="numeric"
                        value={data.mail_port}
                        onChange={(e) => setData('mail_port', e.target.value)}
                        placeholder="587"
                        className="bg-background"
                      />
                      {errors.mail_port && (
                        <p className="text-sm text-destructive">{errors.mail_port}</p>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="mail_username">SMTP Username</Label>
                    <Input
                      id="mail_username"
                      type="text"
                      value={data.mail_username}
                      onChange={(e) => setData('mail_username', e.target.value)}
                      placeholder="user@example.com"
                      className="bg-background"
                    />
                    {errors.mail_username && (
                      <p className="text-sm text-destructive">{errors.mail_username}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="mail_password">SMTP Password</Label>
                    <Input
                      id="mail_password"
                      type="password"
                      value={data.mail_password}
                      onChange={(e) => setData('mail_password', e.target.value)}
                      placeholder="••••••••"
                      className="bg-background"
                    />
                    {errors.mail_password && (
                      <p className="text-sm text-destructive">{errors.mail_password}</p>
                    )}
                  </div>

                  {/* Encryption */}
                  <div className="space-y-2">
                    <Label htmlFor="mail_encryption">Encryption</Label>
                    <Select
                      value={data.mail_encryption || 'none'}
                      onValueChange={(value) => setData('mail_encryption', value === 'none' ? '' : value)}
                    >
                      <SelectTrigger id="mail_encryption" className="bg-background">
                        <SelectValue placeholder="Select encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.mail_encryption && (
                      <p className="text-sm text-destructive">{errors.mail_encryption}</p>
                    )}
                  </div>
                </>
              )}

              <div className="border-t border-border pt-6">
                <h4 className="text-base font-semibold text-card-foreground mb-4">Email Sender</h4>
              </div>

              {/* From Address */}
              <div className="space-y-2">
                <Label htmlFor="mail_from_address">From Email Address</Label>
                <Input
                  id="mail_from_address"
                  type="email"
                  value={data.mail_from_address}
                  onChange={(e) => setData('mail_from_address', e.target.value)}
                  placeholder="noreply@example.com"
                  className="bg-background"
                />
                {errors.mail_from_address && (
                  <p className="text-sm text-destructive">{errors.mail_from_address}</p>
                )}
              </div>

              {/* From Name */}
              <div className="space-y-2">
                <Label htmlFor="mail_from_name">From Name</Label>
                <Input
                  id="mail_from_name"
                  type="text"
                  value={data.mail_from_name}
                  onChange={(e) => setData('mail_from_name', e.target.value)}
                  placeholder="ExilonCMS"
                  className="bg-background"
                />
                {errors.mail_from_name && (
                  <p className="text-sm text-destructive">{errors.mail_from_name}</p>
                )}
              </div>

              {/* Test Email */}
              <div className="border-t border-border pt-6">
                <Button type="button" variant="outline" onClick={sendTestEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Send a test email to verify your configuration
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
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
