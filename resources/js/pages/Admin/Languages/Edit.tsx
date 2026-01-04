/**
 * Admin Languages Edit - Edit translations for a specific language
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
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
import { ArrowLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface LanguagesEditProps extends PageProps {
  locale: string;
  languageName: string;
  translations: Record<string, Record<string, string>>;
}

export default function LanguagesEdit({ locale, languageName, translations }: LanguagesEditProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    translations: translations,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors in the form');
    }
  }, [errors]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.languages.update', locale), {
      onSuccess: () => toast.success('Translations updated successfully'),
      onError: () => toast.error('Failed to update translations'),
    });
  };

  const updateTranslation = (filename: string, key: string, value: string) => {
    setData('translations', {
      ...data.translations,
      [filename]: {
        ...data.translations[filename],
        [key]: value,
      },
    });
  };

  // Filter translations based on search query
  const filteredTranslations = Object.entries(data.translations).reduce((acc, [filename, keys]) => {
    if (!searchQuery) {
      acc[filename] = keys;
      return acc;
    }

    const filtered = Object.entries(keys).filter(([key, value]) => {
      const search = searchQuery.toLowerCase();
      return (
        key.toLowerCase().includes(search) ||
        value.toLowerCase().includes(search) ||
        filename.toLowerCase().includes(search)
      );
    });

    if (filtered.length > 0) {
      acc[filename] = Object.fromEntries(filtered);
    }

    return acc;
  }, {} as Record<string, Record<string, string>>);

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Translations: ${languageName}`} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={`Edit ${languageName} Translations`}
            description={`Editing translations for ${locale}`}
          />
          <AdminLayoutActions>
            <Link href={route('admin.languages.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Languages
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Search */}
            <div className="border border-border rounded-lg p-4 bg-card">
              <Label htmlFor="search" className="mb-2 block">Search Translations</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by key or value..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Translation Form */}
            <form onSubmit={handleSubmit} id="edit-translations-form">
              <div className="border border-border rounded-lg bg-card">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Translation Files
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Object.keys(filteredTranslations).length} file(s) • {
                      Object.values(filteredTranslations).reduce((sum, keys) => sum + Object.keys(keys).length, 0)
                    } key(s) {searchQuery && '(filtered)'}
                  </p>
                </div>

                <div className="p-6">
                  {Object.keys(filteredTranslations).length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No translations found matching "{searchQuery}"
                    </div>
                  ) : (
                    <Accordion type="multiple" className="space-y-2">
                      {Object.entries(filteredTranslations).map(([filename, keys]) => (
                        <AccordionItem
                          key={filename}
                          value={filename}
                          className="border border-border rounded-lg"
                        >
                          <AccordionTrigger className="px-4 hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="font-mono font-medium text-sm">
                                {filename}.php
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {Object.keys(keys).length} key(s)
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4 pt-2">
                              {Object.entries(keys).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                  <Label htmlFor={`${filename}.${key}`} className="font-mono text-xs">
                                    {key}
                                  </Label>
                                  <Input
                                    id={`${filename}.${key}`}
                                    type="text"
                                    value={value}
                                    onChange={(e) => updateTranslation(filename, key, e.target.value)}
                                    className="font-mono text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </div>
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.languages.index')}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="edit-translations-form" disabled={processing}>
            {processing ? 'Saving...' : 'Save Translations'}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
