import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

interface ConfigField {
  name: string;
  label: string;
  type: string;
  default: any;
  description?: string;
}

interface Props {
  config: Record<string, ConfigField>;
  settings: Record<string, any>;
}

export default function DocumentationConfig({ config, settings }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    ...settings,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.plugins.documentation.config.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Documentation Configuration" />

      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={route('admin.plugins.documentation.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documentation Configuration</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage documentation settings
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure documentation behavior and display
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.values(config).map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === 'boolean' || field.type === 'toggle' ? (
                    <div className="flex items-center gap-2">
                      <input
                        id={field.name}
                        type="checkbox"
                        checked={data[field.name]}
                        onChange={(e) => setData(field.name, e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                        {field.description}
                      </Label>
                    </div>
                  ) : (
                    <>
                      <Input
                        id={field.name}
                        type={field.type === 'integer' || field.type === 'number' ? 'number' : 'text'}
                        value={data[field.name]}
                        onChange={(e) => setData(field.name, e.target.value)}
                      />
                      {field.description && (
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                      )}
                    </>
                  )}
                  {errors[field.name] && (
                    <p className="text-sm text-destructive">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
