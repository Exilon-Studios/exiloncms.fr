import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { Category, Item, ShopCategoryProps } from '../../types';

export default function ShopCategory({ category, items }: ShopCategoryProps) {
  return (
    <AuthenticatedLayout>
      <Head title={category.name} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/shop"
            className="text-sm text-primary hover:underline mb-2 inline-block"
          >
            ← Back to Shop
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>

        {items.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No items in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.data.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/item/${item.id}`}
                  className="group block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
                >
                  {item.image && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {items.links && items.links.length > 3 && (
              <div className="mt-8 flex justify-center gap-2">
                {items.links.map((link, index) => {
                  if (!link.url) return null;

                  return (
                    <Link
                      key={index}
                      href={link.url}
                      className={`px-4 py-2 rounded-md ${
                        link.active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
