import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ShoppingCart, Package, CreditCard, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface ShopIndexProps extends PageProps {
  stats: {
    total_items: number;
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
  };
  categories: Array<{ id: number; name: string }>;
}

export default function ShopAdminIndex({ stats, categories }: ShopIndexProps) {
  const { settings } = usePage<ShopIndexProps>().props;

  return (
    <div className={settings?.darkTheme ? 'dark' : ''}>
      <Head title="Shop Admin - {settings?.name}" />

      <div className="min-h-screen bg-background">
        <div className="container py-12 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Shop Management</h1>
            <p className="text-muted-foreground text-lg">
              Manage your store, items, categories, and orders
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_items}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_orders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_revenue.toFixed(2)} €</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending_orders}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Manage product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                          <Link href={route('admin.shop.categories.edit', category.id)}>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Link href={route('admin.shop.categories.create')}>
                    <Button>
                      Create Category
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common shop management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={route('admin.shop.items.create')}>
                  <Button className="w-full">Add New Item</Button>
                </Link>
                <Link href={route('admin.shop.orders')}>
                  <Button variant="outline" className="w-full">View All Orders</Button>
                </Link>
                <Link href={route('admin.shop.settings')}>
                  <Button variant="outline" className="w-full">Shop Settings</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
