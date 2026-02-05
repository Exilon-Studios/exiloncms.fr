import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Languages } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { route } from 'ziggy-js';

interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'boolean' | 'integer' | 'select';
  default: any;
  options?: Record<string, string>;
  description?: string;
}

interface Props {
  config: Record<string, ConfigField>;
  settings: Record<string, any>;
  availableLocales: string[];
}

// Dynamic locale labels
const LOCALE_LABELS: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  tr: 'Türkçe',
};

export default function DocumentationConfig({ config, settings, availableLocales = ['fr', 'en'] }: Props) {
  const { settings: globalSettings } = usePage<PageProps>().props;
  const { trans } = usePage<PageProps>().props.trans?.admin?.plugins?.documentation || {};
  const [newLocale, setNewLocale] = useState('');
  const [isCreatingLocale, setIsCreatingLocale] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, any> = {};

    Object.keys(config).forEach((key) => {
      const field = config[key];
      if (field.type === 'boolean') {
        data[key] = formData.get(`${key}_checkbox`) === 'on';
      } else {
        data[key] = formData.get(key);
      }
    });

    router.put(route('admin.plugins.documentation.config.update'), data, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const createLocale = async () => {
    if (!newLocale || newLocale.length < 2) {
      alert(trans?.invalid_locale || 'Please enter a valid locale code (e.g., "en", "es", "de")');
      return;
    }

    if (availableLocales.includes(newLocale)) {
      alert(trans?.locale_exists || 'This locale already exists');
      return;
    }

    setIsCreatingLocale(true);

    try {
      const response = await fetch(route('admin.plugins.documentation.create-locale'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({ locale: newLocale }),
      });

      if (response.ok) {
        setNewLocale('');
        window.location.reload();
      } else {
        alert(trans?.locale_create_failed || 'Failed to create locale');
      }
    } catch (error) {
      console.error('Failed to create locale:', error);
      alert(trans?.locale_create_failed || 'Failed to create locale');
    } finally {
      setIsCreatingLocale(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Documentation Configuration" />

      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href={route('admin.plugins.documentation.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <h1 className="text-2xl font-bold mt-4">Documentation Configuration</h1>
          <p className="text-muted-foreground">
            Configure documentation settings and manage languages
          </p>
        </div>

        {/* Languages Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Languages
            </CardTitle>
            <CardDescription>
              Manage available documentation languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Available languages */}
              <div>
                <Label>Available Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableLocales.map((locale) => (
                    <span
                      key={locale}
                      className={`px-3 py-1 rounded-full text-sm ${
                        locale === settings.default_locale
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {locale.toUpperCase()}
                      {locale === settings.default_locale && ' (Default)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add new language */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="new-locale">Add New Language</Label>
                  <Input
                    id="new-locale"
                    placeholder="e.g., es, de, it, pt..."
                    value={newLocale}
                    onChange={(e) => setNewLocale(e.target.value.toLowerCase())}
                    disabled={isCreatingLocale}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={createLocale}
                  disabled={isCreatingLocale || !newLocale}
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreatingLocale ? 'Creating...' : 'Add'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure documentation behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.entries(config).map(([key, field]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{field.label}</Label>

                  {field.type === 'boolean' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${key}_checkbox`}
                        name={`${key}_checkbox`}
                        defaultChecked={settings[key] === true || settings[key] === 'true'}
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.description}
                      </span>
                    </div>
                  )}

                  {field.type === 'select' && (
                    <Select name={key} defaultValue={settings[key] ?? field.default}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Use available locales for default_locale field */}
                        {key === 'default_locale' ? (
                          availableLocales.map((locale) => (
                            <SelectItem key={locale} value={locale}>
                              {LOCALE_LABELS[locale] || locale.toUpperCase()}
                            </SelectItem>
                          ))
                        ) : (
                          // Use static options for other select fields
                          field.options && Object.entries(field.options).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}

                  {(field.type === 'text' || field.type === 'integer') && (
                    <>
                      <Input
                        id={key}
                        name={key}
                        type={field.type === 'integer' ? 'number' : 'text'}
                        defaultValue={settings[key] ?? field.default}
                      />
                      {field.description && (
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                      )}
                    </>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
