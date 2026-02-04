import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Package, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  position: number;
  is_active: boolean;
  items_count: number;
  created_at: string;
}

interface CategoriesProps {
  categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (!confirm(trans('admin.shop.categories.delete_confirm'))) return;

    setDeletingId(id);
    router.delete(route('admin.shop.categories.destroy', id), {
      onFinish: () => setDeletingId(null),
    });
  };

  const moveUp = (category: Category) => {
    const categoryAbove = categories.find(c => c.position === category.position - 1);
    if (!categoryAbove) return;

    setMovingId(category.id);
    router.put(
      route('admin.shop.categories.move', category.id),
      { direction: 'up', position: category.position - 1 },
      { onFinish: () => setMovingId(null) }
    );
  };

  const moveDown = (category: Category) => {
    const categoryBelow = categories.find(c => c.position === category.position + 1);
    if (!categoryBelow) return;

    setMovingId(category.id);
    router.put(
      route('admin.shop.categories.move', category.id),
      { direction: 'down', position: category.position + 1 },
      { onFinish: () => setMovingId(null) }
    );
  };

  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  return (
    <AuthenticatedLayout>
      <Head title={`${trans('admin.shop.categories.title')} - Boutique`} />

      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{trans('admin.shop.categories.title')}</h1>
            <p className="text-muted-foreground">
              {trans('admin.shop.categories.description')}
            </p>
          </div>
          <Link href={route('admin.shop.categories.create')}>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              {trans('admin.shop.categories.create')}
            </Button>
          </Link>
        </div>

        {/* Categories List - Tebex Style */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {sortedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                >
                  {/* Drag Handle / Position */}
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === 0 || movingId === category.id}
                        onClick={() => moveUp(category)}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === sortedCategories.length - 1 || movingId === category.id}
                        onClick={() => moveDown(category)}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <GripVertical className="h-5 w-5 text-muted-foreground/30 group-hover:text-muted-foreground" />
                  </div>

                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-primary/10">
                    {category.icon ? (
                      <span className="text-xl">{category.icon}</span>
                    ) : (
                      <Package className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant={category.is_active ? 'default' : 'secondary'} className="text-xs">
                        {category.is_active ? trans('admin.shop.categories.status.active') : trans('admin.shop.categories.status.inactive')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-sm text-muted-foreground px-4">
                    {trans('admin.shop.categories.items_count', category.items_count)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={route('admin.shop.categories.edit', category.id)}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === category.id}
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {categories.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">{trans('admin.shop.categories.empty.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {trans('admin.shop.categories.empty.description')}
              </p>
              <Link href={route('admin.shop.categories.create')}>
                <Button>
                  <Plus className="mr-1 h-4 w-4" />
                  {trans('admin.shop.categories.empty.create_button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
