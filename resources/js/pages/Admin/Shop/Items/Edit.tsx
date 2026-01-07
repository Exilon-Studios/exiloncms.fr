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
import { trans } from '@/lib/i18n';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  type: 'item' | 'package' | 'prestige';
  category_id: number | null;
  image: string | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  position: number;
  metadata: any;
}

interface EditProps {
  item: Item;
  categories: Category[];
}

export default function ItemEdit({ item, categories }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: item.name,
    description: item.description || '',
    price: String(item.price),
    type: item.type,
    category_id: String(item.category_id || ''),
    image: item.image || '',
    stock: item.stock,
    is_active: item.is_active,
    is_featured: item.is_featured,
    position: item.position,
    metadata: item.metadata ? JSON.stringify(item.metadata, null, 2) : '{}',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.shop.items.update', item.id), {
      data: {
        ...data,
        price: parseFloat(data.price),
        category_id: data.category_id ? parseInt(data.category_id) : null,
        position: parseInt(String(data.position)),
        metadata: data.metadata ? JSON.parse(data.metadata) : null,
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('shop.admin.items.edit_title', { name: item.name })} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={route('admin.shop.items.index')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{trans('shop.admin.items.edit_header', { name: item.name })}</h1>
            <p className="text-muted-foreground">
              {trans('shop.admin.items.edit_description')}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Ex: Épée légendaire"
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={item.slug}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Le slug est généré automatiquement à partir du nom
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    value={data.type}
                    onChange={e => setData('type', e.target.value as 'item' | 'package' | 'prestige')}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    required
                  >
                    <option value="item">Article</option>
                    <option value="package">Pack</option>
                    <option value="prestige">Prestige</option>
                  </select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Catégorie</Label>
                  <select
                    id="category_id"
                    value={data.category_id}
                    onChange={e => setData('category_id', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  >
                    <option value="">Aucune catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder="Description de l'article..."
                  rows={3}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.price}
                    onChange={e => setData('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock (-1 pour illimité)</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="-1"
                    value={data.stock}
                    onChange={e => setData('stock', parseInt(e.target.value) || -1)}
                  />
                  {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="image">URL de l'image</Label>
                  <Input
                    id="image"
                    value={data.image}
                    onChange={e => setData('image', e.target.value)}
                    placeholder="https://..."
                  />
                  {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="metadata">Métadonnées (JSON)</Label>
                <Textarea
                  id="metadata"
                  value={data.metadata}
                  onChange={e => setData('metadata', e.target.value)}
                  placeholder='{"key": "value"}'
                  rows={3}
                  className="font-mono text-sm"
                />
                {errors.metadata && <p className="text-sm text-destructive">{errors.metadata}</p>}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={checked => setData('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Article actif</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={data.is_featured}
                    onCheckedChange={checked => setData('is_featured', checked)}
                  />
                  <Label htmlFor="is_featured">À la une</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Link href={route('admin.shop.items.index')}>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
