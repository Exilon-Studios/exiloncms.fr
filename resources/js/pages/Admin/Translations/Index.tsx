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
    if (confirm('Êtes-vous sûr de vouloir importer les traductions depuis les fichiers ? Cela écrasera les traductions existantes.')) {
      router.post(route('admin.translations.import'), { group: currentGroup, locale: currentLocale }, {
        onSuccess: () => toast.success('Traductions importées avec succès'),
        onError: () => toast.error('Erreur lors de l\'import'),
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
        toast.success('Traduction mise à jour');
        setEditingId(null);
      },
      onError: () => toast.error('Erreur lors de la mise à jour'),
    });
  };

  const handleDelete = (translation: Translation) => {
    if (confirm(`Supprimer la traduction "${translation.key}" ?`)) {
      router.delete(
        route('admin.translations.destroy', [translation.group, translation.key, translation.locale]),
        {
          onSuccess: () => toast.success('Traduction supprimée'),
          onError: () => toast.error('Erreur lors de la suppression'),
        }
      );
    }
  };

  const handleAddNew = () => {
    if (!newKey.trim() || !newValue.trim()) {
      toast.error('Veuillez remplir la clé et la valeur');
      return;
    }

    const formData = new FormData();
    formData.append('group', currentGroup);
    formData.append('key', newKey);
    formData.append('locale', currentLocale);
    formData.append('value', newValue);

    router.post(route('admin.translations.store'), formData, {
      onSuccess: () => {
        toast.success('Traduction ajoutée');
        setNewKey('');
        setNewValue('');
      },
      onError: () => toast.error('Erreur lors de l\'ajout'),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Gestion des traductions" />

      <div className="space-y-4 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des traductions</h1>
          <p className="text-muted-foreground">
            Gérez toutes les traductions du site, organisées par groupe et langue
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="group-select">Groupe</Label>
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
                <Label htmlFor="locale-select">Langue</Label>
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
            <CardTitle className="text-base">Importer depuis les fichiers</CardTitle>
            <CardDescription>
              Importez les traductions depuis les fichiers de langue dans la base de données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleImport}>
              <FileDown className="mr-2 h-4 w-4" />
              Importer {currentGroup}.{currentLocale}
            </Button>
          </CardContent>
        </Card>

        {/* Add new translation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ajouter une traduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="new-key">Clé</Label>
                <Input
                  id="new-key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="ex: title"
                />
              </div>
              <div className="flex-[2]">
                <Label htmlFor="new-value">Valeur</Label>
                <Input
                  id="new-value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Traduction..."
                />
              </div>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Translations list */}
        <Card>
          <CardHeader>
            <CardTitle>
              Traductions ({translations.length})
            </CardTitle>
            <CardDescription>
              {currentGroup} / {currentLocale.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {translations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune traduction trouvée pour ce groupe et cette langue.
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
                          <Badge variant="outline">Édition</Badge>
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
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(translation)}
                          >
                            Éditer
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
