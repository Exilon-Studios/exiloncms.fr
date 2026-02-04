import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { CartItemsProps } from '../../types';

export default function CartItems({ items, total }: CartItemsProps) {
  const { delete: destroy } = useForm({});

  const removeItem = (id: number) => {
    if (confirm('Remove this item from cart?')) {
      destroy(`/shop/cart/remove/${id}`);
    }
  };

  const clearCart = () => {
    if (confirm('Clear your entire cart?')) {
      destroy('/shop/cart/clear');
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Shopping Cart" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {cartItem.item.image && (
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <Link
                      href={`/shop/item/${cartItem.item.id}`}
                      className="font-semibold hover:text-primary"
                    >
                      {cartItem.item.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {cartItem.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(cartItem.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/shop"
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-center font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="px-6 py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/shop/checkout"
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white text-center font-medium rounded-lg transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
