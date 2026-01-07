import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Package, Star, Crown } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  type: 'item' | 'package' | 'prestige';
  image: string | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  position: number;
  category: { id: number; name: string } | null;
  created_at: string;
}

interface ItemsProps {
  items: Item[];
}

const typeLabels: Record<string, { label: string; icon: any; variant: 'default' | 'secondary' | 'outline' }> = {
  item: { label: 'Article', icon: Package, variant: 'secondary' },
  package: { label: 'Pack', icon: Star, variant: 'default' },
  prestige: { label: 'Prestige', icon: Crown, variant: 'outline' },
};

export default function ItemsIndex({ items }: ItemsProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    setDeletingId(id);
    router.delete(route('admin.shop.items.destroy', id), {
      onFinish: () => setDeletingId(null),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Articles - Boutique" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Articles</h1>
            <p className="text-muted-foreground">
              Gérez les articles de la boutique
            </p>
          </div>
          <Link href={route('admin.shop.items.create')}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </Link>
        </div>

        {/* Items List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Article</th>
                    <th className="text-left p-4 font-medium">Catégorie</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Prix</th>
                    <th className="text-left p-4 font-medium">Stock</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const TypeIcon = typeLabels[item.type].icon;
                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {item.category ? (
                            <Badge variant="outline">{item.category.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant={typeLabels[item.type].variant}>
                            {typeLabels[item.type].label}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-sm">
                          {Number(item.price).toFixed(2)}
                        </td>
                        <td className="p-4">
                          {item.stock === -1 ? (
                            <Badge variant="outline">Illimité</Badge>
                          ) : item.stock > 0 ? (
                            <span className="text-sm">{item.stock}</span>
                          ) : (
                            <Badge variant="destructive">Rupture</Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {item.is_featured && (
                              <Badge variant="default" className="text-xs">À la une</Badge>
                            )}
                            {!item.is_active && (
                              <Badge variant="secondary" className="text-xs">Inactif</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={route('admin.shop.items.edit', item.id)}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingId === item.id}
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {items.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">Aucun article</h3>
              <p className="text-muted-foreground mb-6">
                Commencez par créer votre premier article.
              </p>
              <Link href={route('admin.shop.items.create')}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un article
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
