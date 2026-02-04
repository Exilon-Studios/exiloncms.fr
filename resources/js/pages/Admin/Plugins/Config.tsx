import { useForm } from '@inertiajs/react';
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

interface ConfigOption {
  type: 'text' | 'number' | 'boolean' | 'checkbox' | 'textarea' | 'select';
  label: string;
  description?: string;
  default?: any;
  options?: string[];
  min?: number;
  max?: number;
}

interface Config {
  [key: string]: ConfigOption;
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
  config: Config;
  settings?: Record<string, any>;
}

export default function PluginConfig({ plugin, config, settings = {} }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    settings: Object.entries(config).reduce((acc, [key, option]) => {
      acc[key] = settings[key] ?? option.default ?? '';
      return acc;
    }, {} as Record<string, any>),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.plugins.update', plugin.id));
  };

  const renderField = (key: string, option: ConfigOption) => {
    switch (option.type) {
      case 'boolean':
        return (
          <Switch
            checked={data.settings[key] ?? option.default ?? false}
            onCheckedChange={(checked) => setData('settings', { ...data.settings, [key]: checked })}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {option.options?.map((opt) => (
              <div key={opt} className="flex items-center space-x-2">
                <Checkbox
                  id={`${key}-${opt}`}
                  checked={(data.settings[key] ?? option.default ?? []).includes(opt)}
                  onCheckedChange={(checked) => {
                    const current = data.settings[key] ?? option.default ?? [];
                    if (checked) {
                      setData('settings', { ...data.settings, [key]: [...current, opt] });
                    } else {
                      setData('settings', { ...data.settings, [key]: current.filter((v: string) => v !== opt) });
                    }
                  }}
                />
                <Label htmlFor={`${key}-${opt}`} className="capitalize cursor-pointer">
                  {opt}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={data.settings[key] ?? option.default ?? ''}
            onChange={(e) => setData('settings', { ...data.settings, [key]: e.target.value })}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={data.settings[key] ?? option.default ?? ''}
            onChange={(e) => setData('settings', { ...data.settings, [key]: parseInt(e.target.value) || 0 })}
            min={option.min}
            max={option.max}
          />
        );

      case 'select':
        return (
          <Select
            value={data.settings[key] ?? option.default ?? ''}
            onValueChange={(value) => setData('settings', { ...data.settings, [key]: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={trans('messages.select')} />
            </SelectTrigger>
            <SelectContent>
              {option.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default: // text
        return (
          <Input
            type="text"
            value={data.settings[key] ?? option.default ?? ''}
            onChange={(e) => setData('settings', { ...data.settings, [key]: e.target.value })}
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
              {Object.entries(config).map(([key, option]) => (
                <div key={key} className={option.type === 'boolean' ? 'flex items-center justify-between' : 'space-y-2'}>
                  {option.type === 'boolean' ? (
                    <>
                      <div className="space-y-0.5">
                        <Label>{option.label}</Label>
                        {option.description && (
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        )}
                      </div>
                      {renderField(key, option)}
                    </>
                  ) : (
                    <>
                      <Label htmlFor={key}>{option.label}</Label>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                      {renderField(key, option)}
                    </>
                  )}

                  {errors[`settings.${key}`] && (
                    <p className="text-sm text-destructive">
                      {errors[`settings.${key}`]}
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
