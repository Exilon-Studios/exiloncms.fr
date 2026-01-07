import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

export default function CategoryCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    icon: '',
    position: 0,
    is_active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.shop.categories.store'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Nouvelle catégorie - Boutique" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={route('admin.shop.categories.index')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nouvelle catégorie</h1>
            <p className="text-muted-foreground">
              Créez une nouvelle catégorie pour la boutique
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de la catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Ex: Articles, Packs, Prestiges..."
                  required
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder="Description de la catégorie..."
                  rows={3}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icône (emoji ou nom d'icône)</Label>
                <Input
                  id="icon"
                  value={data.icon}
                  onChange={e => setData('icon', e.target.value)}
                  placeholder="Ex: 📦 ou package"
                />
                {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  min="0"
                  value={data.position}
                  onChange={e => setData('position', parseInt(e.target.value) || 0)}
                />
                {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={checked => setData('is_active', checked)}
                />
                <Label htmlFor="is_active">Catégorie active</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Link href={route('admin.shop.categories.index')}>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  Créer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
