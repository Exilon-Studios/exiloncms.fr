import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, FileDown, Globe, Layers } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';

interface Translation {
  id: number;
  group: string;
  key: string;
  locale: string;
  value: string;
}

interface TranslationsProps extends PageProps {
  groups: string[];
  locales: string[];
  currentGroup: string;
  currentLocale: string;
  translations: Translation[];
}

export default function TranslationsIndex({
  groups,
  locales,
  currentGroup,
  currentLocale,
  translations,
}: TranslationsProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleChangeGroup = (group: string) => {
    router.get(route('admin.translations.index'), { group, locale: currentLocale });
  };

  const handleChangeLocale = (locale: string) => {
    router.get(route('admin.translations.index'), { group: currentGroup, locale });
  };

  const handleImport = () => {
    if (confirm(trans('admin.translations.index.import_confirm'))) {
      router.post(route('admin.translations.import'), { group: currentGroup, locale: currentLocale }, {
        onSuccess: () => toast.success(trans('admin.translations.index.import_success')),
        onError: () => toast.error(trans('admin.translations.index.import_error')),
      });
    }
  };

  const handleEdit = (translation: Translation) => {
    setEditingId(translation.id);
    setEditValue(translation.value);
  };

  const handleSaveEdit = async (translation: Translation) => {
    const formData = new FormData();
    formData.append('group', translation.group);
    formData.append('key', translation.key);
    formData.append('locale', translation.locale);
    formData.append('value', editValue);

    router.post(route('admin.translations.store'), formData, {
      onSuccess: () => {
        toast.success(trans('admin.translations.index.update_success'));
        setEditingId(null);
      },
      onError: () => toast.error(trans('admin.translations.index.update_error')),
    });
  };

  const handleDelete = (translation: Translation) => {
    if (confirm(trans('admin.translations.index.delete_with_key', { key: translation.key }))) {
      router.delete(
        route('admin.translations.destroy', [translation.group, translation.key, translation.locale]),
        {
          onSuccess: () => toast.success(trans('admin.translations.index.delete_success')),
          onError: () => toast.error(trans('admin.translations.index.delete_error')),
        }
      );
    }
  };

  const handleAddNew = () => {
    if (!newKey.trim() || !newValue.trim()) {
      toast.error(trans('admin.translations.index.validation_error'));
      return;
    }

    const formData = new FormData();
    formData.append('group', currentGroup);
    formData.append('key', newKey);
    formData.append('locale', currentLocale);
    formData.append('value', newValue);

    router.post(route('admin.translations.store'), formData, {
      onSuccess: () => {
        toast.success(trans('admin.translations.index.add_success'));
        setNewKey('');
        setNewValue('');
      },
      onError: () => toast.error(trans('admin.translations.index.add_error')),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.translations.index.title')} />

      <div className="space-y-4 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trans('admin.translations.index.title')}</h1>
          <p className="text-muted-foreground">
            {trans('admin.translations.index.description')}
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="group-select">{trans('admin.translations.index.group')}</Label>
                <Select value={currentGroup} onValueChange={handleChangeGroup}>
                  <SelectTrigger id="group-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group} value={group}>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          {group}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="locale-select">{trans('admin.translations.index.language')}</Label>
                <Select value={currentLocale} onValueChange={handleChangeLocale}>
                  <SelectTrigger id="locale-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {locale.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import from file */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import from files</CardTitle>
            <CardDescription>
              Import translations from language files into the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleImport}>
              <FileDown className="mr-2 h-4 w-4" />
              Import {currentGroup}.{currentLocale}
            </Button>
          </CardContent>
        </Card>

        {/* Add new translation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {trans('admin.translations.index.add')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="new-key">Key</Label>
                <Input
                  id="new-key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="ex: title"
                />
              </div>
              <div className="flex-[2]">
                <Label htmlFor="new-value">Value</Label>
                <Input
                  id="new-value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Translation..."
                />
              </div>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Translations list */}
        <Card>
          <CardHeader>
            <CardTitle>
              {trans('admin.translations.index.title')} ({translations.length})
            </CardTitle>
            <CardDescription>
              {currentGroup} / {currentLocale.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {translations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {trans('admin.translations.index.empty_title')}
                </div>
              ) : (
                translations.map((translation) => (
                  <div
                    key={translation.id}
                    className="flex gap-4 items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{translation.key}</Badge>
                        {editingId === translation.id && (
                          <Badge variant="outline">Editing</Badge>
                        )}
                      </div>
                      {editingId === translation.id ? (
                        <Textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="min-h-[80px]"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{translation.value}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingId === translation.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(translation)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(translation)}
                          >
                            {trans('admin.translations.index.edit')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(translation)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
