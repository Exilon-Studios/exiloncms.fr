/**
 * Admin Settings - Payment Configuration
 */

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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Wallet } from 'lucide-react';
import { IconBrandPaypal } from '@tabler/icons-react';

interface PaymentsSettingsProps extends PageProps {
  settings: {
    // Balance Settings
    balance_enabled: boolean;
    balance_min_amount: number;

    // Stripe Settings
    stripe_enabled: boolean;
    stripe_public_key: string;
    stripe_secret_key: string;
    stripe_webhook_secret: string;

    // PayPal Settings
    paypal_enabled: boolean;
    paypal_client_id: string;
    paypal_secret: string;
    paypal_mode: string;
  };
}

export default function PaymentsSettings({ settings }: PaymentsSettingsProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    balance_enabled: settings.balance_enabled ?? true,
    balance_min_amount: settings.balance_min_amount ?? 0,
    stripe_enabled: settings.stripe_enabled ?? false,
    stripe_public_key: settings.stripe_public_key ?? '',
    stripe_secret_key: settings.stripe_secret_key ?? '',
    stripe_webhook_secret: settings.stripe_webhook_secret ?? '',
    paypal_enabled: settings.paypal_enabled ?? false,
    paypal_client_id: settings.paypal_client_id ?? '',
    paypal_secret: settings.paypal_secret ?? '',
    paypal_mode: settings.paypal_mode ?? 'sandbox',
  });

  // Reset form data when page props change (after save/reload)
  useEffect(() => {
    reset({
      balance_enabled: settings.balance_enabled ?? true,
      balance_min_amount: settings.balance_min_amount ?? 0,
      stripe_enabled: settings.stripe_enabled ?? false,
      stripe_public_key: settings.stripe_public_key ?? '',
      stripe_secret_key: settings.stripe_secret_key ?? '',
      stripe_webhook_secret: settings.stripe_webhook_secret ?? '',
      paypal_enabled: settings.paypal_enabled ?? false,
      paypal_client_id: settings.paypal_client_id ?? '',
      paypal_secret: settings.paypal_secret ?? '',
      paypal_mode: settings.paypal_mode ?? 'sandbox',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.payments.update'), {
      preserveScroll: true,
      preserveState: false,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Payment Settings" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Payment Settings"
            description="Configure payment methods for the shop"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Settings Form */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-6">Payment Methods</h3>

              <form onSubmit={handleSubmit} className="space-y-8" id="payments-form">
                {/* Account Balance */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <Label className="text-base">Account Balance</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow users to pay with their account balance
                      </p>
                    </div>
                    <Switch
                      checked={data.balance_enabled}
                      onCheckedChange={(checked) => setData('balance_enabled', checked)}
                    />
                  </div>

                  {data.balance_enabled && (
                    <div className="pl-7 space-y-2">
                      <Label htmlFor="balance_min_amount">Minimum Amount</Label>
                      <Input
                        id="balance_min_amount"
                        type="number"
                        min="0"
                        value={data.balance_min_amount}
                        onChange={(e) => setData('balance_min_amount', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="bg-background max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum order amount required to use account balance (0 = no minimum)
                      </p>
                      {errors.balance_min_amount && (
                        <p className="text-sm text-destructive">{errors.balance_min_amount}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Stripe */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <Label className="text-base">Stripe</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept credit card payments via Stripe
                      </p>
                    </div>
                    <Switch
                      checked={data.stripe_enabled}
                      onCheckedChange={(checked) => setData('stripe_enabled', checked)}
                    />
                  </div>

                  {data.stripe_enabled && (
                    <div className="pl-7 space-y-4">
                      {/* Sandbox/Live Mode */}
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <Switch
                          checked={data.stripe_mode === 'live'}
                          onCheckedChange={(checked) => setData('stripe_mode', checked ? 'live' : 'sandbox')}
                        />
                        <div className="flex-1">
                          <Label className="text-sm">Live Mode</Label>
                          <p className="text-xs text-muted-foreground">
                            {data.stripe_mode === 'live' ? 'Payments are processed in live mode' : 'Sandbox mode for testing (use test keys)'}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Public Key */}
                        <div className="space-y-2">
                          <Label htmlFor="stripe_public_key">Public Key</Label>
                          <Input
                            id="stripe_public_key"
                            type="text"
                            value={data.stripe_public_key}
                            onChange={(e) => setData('stripe_public_key', e.target.value)}
                            placeholder={data.stripe_mode === 'live' ? 'pk_live_...' : 'pk_test_...'}
                            className="bg-background"
                          />
                          {errors.stripe_public_key && (
                            <p className="text-sm text-destructive">{errors.stripe_public_key}</p>
                          )}
                        </div>

                        {/* Secret Key */}
                        <div className="space-y-2">
                          <Label htmlFor="stripe_secret_key">Secret Key</Label>
                          <Input
                            id="stripe_secret_key"
                            type="password"
                            value={data.stripe_secret_key}
                            onChange={(e) => setData('stripe_secret_key', e.target.value)}
                            placeholder={data.stripe_mode === 'live' ? 'sk_live_...' : 'sk_test_...'}
                            className="bg-background"
                          />
                          {errors.stripe_secret_key && (
                            <p className="text-sm text-destructive">{errors.stripe_secret_key}</p>
                          )}
                        </div>
                      </div>

                      {/* Webhook Secret */}
                      <div className="space-y-2">
                        <Label htmlFor="stripe_webhook_secret">Webhook Secret</Label>
                        <Input
                          id="stripe_webhook_secret"
                          type="password"
                          value={data.stripe_webhook_secret}
                          onChange={(e) => setData('stripe_webhook_secret', e.target.value)}
                          placeholder="whsec_..."
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground">
                          Used to verify webhook signatures from Stripe
                        </p>
                        {errors.stripe_webhook_secret && (
                          <p className="text-sm text-destructive">{errors.stripe_webhook_secret}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <IconBrandPaypal className="h-5 w-5 text-primary" />
                        <Label className="text-base">PayPal</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accept payments via PayPal
                      </p>
                    </div>
                    <Switch
                      checked={data.paypal_enabled}
                      onCheckedChange={(checked) => setData('paypal_enabled', checked)}
                    />
                  </div>

                  {data.paypal_enabled && (
                    <div className="pl-7 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Client ID */}
                        <div className="space-y-2">
                          <Label htmlFor="paypal_client_id">Client ID</Label>
                          <Input
                            id="paypal_client_id"
                            type="text"
                            value={data.paypal_client_id}
                            onChange={(e) => setData('paypal_client_id', e.target.value)}
                            placeholder="AX-..."
                            className="bg-background"
                          />
                          {errors.paypal_client_id && (
                            <p className="text-sm text-destructive">{errors.paypal_client_id}</p>
                          )}
                        </div>

                        {/* Secret */}
                        <div className="space-y-2">
                          <Label htmlFor="paypal_secret">Secret</Label>
                          <Input
                            id="paypal_secret"
                            type="password"
                            value={data.paypal_secret}
                            onChange={(e) => setData('paypal_secret', e.target.value)}
                            placeholder="EJ-..."
                            className="bg-background"
                          />
                          {errors.paypal_secret && (
                            <p className="text-sm text-destructive">{errors.paypal_secret}</p>
                          )}
                        </div>
                      </div>

                      {/* Mode */}
                      <div className="space-y-2">
                        <Label htmlFor="paypal_mode">Mode</Label>
                        <Select
                          value={data.paypal_mode}
                          onValueChange={(value) => setData('paypal_mode', value)}
                        >
                          <SelectTrigger id="paypal_mode" className="bg-background max-w-xs">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                            <SelectItem value="live">Live (Production)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Use Sandbox for testing, Live for production payments
                        </p>
                        {errors.paypal_mode && (
                          <p className="text-sm text-destructive">{errors.paypal_mode}</p>
                        )}
                      </div>
                    </div>
                  )}
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
