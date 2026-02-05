import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trans } from '@/lib/i18n';

interface ConfigField {
  name: string;
  label: string;
  description?: string;
  type: string;
  default?: any;
  options?: { label: string; value: string }[];
  validation?: string;
  required?: boolean;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
}

interface Props {
  plugin: Plugin;
  configFields: ConfigField[];
  settings: Record<string, any>;
}

export default function PluginConfigEdit({ plugin, configFields, settings }: Props) {
  const { errors } = usePage().props;

  const { data, setData, post, processing } = useForm({
    settings: settings,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.plugins.update', plugin.id));
  };

  const renderField = (field: ConfigField) => {
    const fieldName = field.name;
    const value = data.settings[fieldName] ?? field.default ?? '';
    const errorKey = `settings.${fieldName}`;

    switch (field.type) {
      case 'boolean':
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{field.label}</Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => setData('settings', { ...data.settings, [fieldName]: checked })}
            />
          </div>
        );

      case 'checkbox':
      case 'multiselect':
        return (
          <div className="space-y-3">
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldName}-${opt.value}`}
                  checked={(value || []).includes(opt.value)}
                  onCheckedChange={(checked) => {
                    const current = value || [];
                    if (checked) {
                      setData('settings', { ...data.settings, [fieldName]: [...current, opt.value] });
                    } else {
                      setData('settings', { ...data.settings, [fieldName]: current.filter((v: string) => v !== opt.value) });
                    }
                  }}
                />
                <Label htmlFor={`${fieldName}-${opt.value}`} className="cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setData('settings', { ...data.settings, [fieldName]: e.target.value })}
            rows={4}
          />
        );

      case 'number':
      case 'integer':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setData('settings', { ...data.settings, [fieldName]: parseInt(e.target.value) || 0 })}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => setData('settings', { ...data.settings, [fieldName]: newValue })}
          >
            <SelectTrigger>
              <SelectValue placeholder={trans('messages.select')} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default: // text
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => setData('settings', { ...data.settings, [fieldName]: e.target.value })}
          />
        );
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.plugins.configure.title', { name: plugin.name })} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={route('admin.plugins.index')}>
            <Button variant="ghost" size="icon" title={trans('admin.plugins.configure.back_to_plugins')}>
              <IconArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {trans('admin.plugins.configure.title', { name: plugin.name })}
            </h1>
            <p className="text-muted-foreground mt-1">
              {plugin.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">v{plugin.version}</Badge>
              <Badge variant="outline">{plugin.author}</Badge>
            </div>
          </div>
        </div>

        {/* Config Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{trans('admin.plugins.configure.settings')}</CardTitle>
              <CardDescription>
                {trans('admin.plugins.configure.settings_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {configFields.map((field) => (
                <div key={field.name} className={field.type === 'boolean' || field.type === 'toggle' ? '' : 'space-y-2'}>
                  {field.type !== 'boolean' && field.type !== 'toggle' && (
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  )}
                  {field.description && field.type !== 'boolean' && field.type !== 'toggle' && (
                    <p className="text-sm text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                  {renderField(field)}
                  {errors[errorKey] && (
                    <p className="text-sm text-destructive">
                      {errors[errorKey]}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <Link href={route('admin.plugins.index')}>
              <Button type="button" variant="outline">
                {trans('admin.plugins.configure.cancel')}
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? trans('admin.plugins.configure.saving') : trans('admin.plugins.configure.save')}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
