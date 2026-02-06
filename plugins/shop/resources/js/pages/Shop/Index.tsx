import { Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { PageProps, PaginatedData } from '@/types';
import { ShoppingCart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category: { id: number; name: string };
}

interface ShopIndexProps extends PageProps {
  items: PaginatedData<ShopItem>;
  categories: Array<{ id: number; name: string }>;
  currentCategory?: number;
}

export default function ShopIndex({ items, categories, currentCategory }: ShopIndexProps) {
  const { settings } = usePage<ShopIndexProps>().props;
  const [search, setSearch] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('shop.index'), { search, category: currentCategory });
  };

  return (
    <div className={settings?.darkTheme ? 'dark' : ''}>
      <Head title="Shop - {settings?.name}" />

      <div className="min-h-screen bg-background">
        <div className="container py-12 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Shop</h1>
            <p className="text-muted-foreground text-lg">
              Browse and purchase items from our store
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4 mb-8">
            <div className="lg:col-span-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <Link href={route('shop.index')}>
                <Button variant="outline" className="w-full">
                  All Categories
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={route('shop.index', { category: category.id })}
                className="block"
              >
                <Card className={`transition-all hover:shadow-md ${
                  currentCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">Browse items in this category</p>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {items.data.map((item) => (
              <Link key={item.id} href={route('shop.show', item.id)} className="block">
                <Card className="transition-all hover:shadow-md cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-1 line-clamp-1">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-primary">{item.price} €</p>
                      <p className={`text-sm ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
