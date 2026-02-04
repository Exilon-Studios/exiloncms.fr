import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { Item, ShopItemProps } from '../../types';

export default function ShopItem({ item }: ShopItemProps) {
  const { post, processing } = useForm({});

  const addToCart = () => {
    post(`/shop/cart/add/${item.id}`);
  };

  return (
    <AuthenticatedLayout>
      <Head title={item.name} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={item.category ? `/shop/category/${item.category.slug}` : '/shop'}
          className="text-sm text-primary hover:underline mb-4 inline-block"
        >
          ← Back to {item.category?.name || 'Shop'}
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          {item.image ? (
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          )}

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {item.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ${item.price.toFixed(2)}
              </p>
            </div>

            {item.stock !== undefined && (
              <div className="text-sm">
                {item.stock > 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    In stock ({item.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    Out of stock
                  </span>
                )}
              </div>
            )}

            {item.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            <button
              onClick={addToCart}
              disabled={processing || (item.stock !== undefined && item.stock <= 0)}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
