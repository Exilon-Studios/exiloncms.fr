import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { AdminLayout, AdminLayoutHeader, AdminLayoutTitle, AdminLayoutContent } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, Webhook, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

// Custom Discord icon component
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.2114.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface WebhooksSettings {
  discord_url: string | null;
  discord_enabled: boolean;
  discord_events: {
    new_user: boolean;
    new_order: boolean;
    server_online: boolean;
    server_offline: boolean;
    security_alert: boolean;
    system_update: boolean;
  };
}

interface Props {
  webhooks: WebhooksSettings;
  availableEvents: Record<string, string>;
}

export default function IntegrationsSettings({ webhooks, availableEvents }: Props) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    discord_url: webhooks.discord_url || '',
    discord_enabled: webhooks.discord_enabled,
    discord_events: webhooks.discord_events,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.integrations.update'), {
      onSuccess: () => {
        setTestResult(null);
      },
    });
  };

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(route('admin.settings.integrations.test'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({ type: 'discord' }),
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const toggleDiscordEvent = (event: string) => {
    setData('discord_events', {
      ...data.discord_events,
      [event]: !data.discord_events[event as keyof typeof data.discord_events],
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Intégrations" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Intégrations"
            description="Configurez les webhooks et les intégrations avec des services tiers"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Discord Webhook */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#5865F2]/10">
                    <DiscordIcon className="h-6 w-6 text-[#5865F2]" />
                  </div>
                  <div>
                    <CardTitle>Discord Webhook</CardTitle>
                    <CardDescription>
                      Recevez des notifications sur votre serveur Discord
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="discord_enabled">Activer les webhooks Discord</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer automatiquement des notifications à Discord
                    </p>
                  </div>
                  <Switch
                    id="discord_enabled"
                    checked={data.discord_enabled}
                    onCheckedChange={(checked) => setData('discord_enabled', checked)}
                  />
                </div>

                {data.discord_enabled && (
                  <>
                    {/* Webhook URL */}
                    <div className="space-y-2">
                      <Label htmlFor="discord_url">URL du Webhook</Label>
                      <Input
                        id="discord_url"
                        type="url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={data.discord_url}
                        onChange={(e) => setData('discord_url', e.target.value)}
                      />
                      {errors.discord_url && (
                        <p className="text-sm text-destructive">{errors.discord_url}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Créez un webhook dans les paramètres de votre serveur Discord → Paramètres → Intégrations → Webhooks
                      </p>
                    </div>

                    {/* Events */}
                    <div className="space-y-3">
                      <Label>Événements à notifier</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {Object.entries(availableEvents).map(([key, label]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 border border-border rounded-lg"
                          >
                            <span className="text-sm">{label}</span>
                            <Switch
                              checked={data.discord_events[key as keyof typeof data.discord_events]}
                              onCheckedChange={() => toggleDiscordEvent(key)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Test Button */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleTestWebhook}
                        disabled={testing || !data.discord_url}
                      >
                        {testing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <TestTube className="h-4 w-4 mr-2" />
                            Tester le webhook
                          </>
                        )}
                      </Button>

                      {testResult === 'success' && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Message envoyé avec succès !
                        </div>
                      )}

                      {testResult === 'error' && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          Échec de l'envoi. Vérifiez l'URL.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* More integrations placeholder */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Webhook className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">D'autres intégrations arriveront bientôt</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Slack, Telegram, Email, etc.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={processing}>
                {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
