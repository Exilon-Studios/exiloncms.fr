import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

interface CartItem {
  id: number;
  item_id: number;
  item: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image?: string;
  };
  quantity: number;
  subtotal: number;
}

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const pageProps = usePage().props as any;
  const money = pageProps.settings?.money || 'Points';

  useEffect(() => {
    if (open) {
      fetchCartItems();
    }
  }, [open]);

  const fetchCartItems = () => {
    setLoading(true);
    // Use direct URL instead of route() to avoid Ziggy errors when shop plugin routes aren't loaded
    router.get('/shop/cart/items', {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page: any) => {
        setCartItems(page.props.cartItems || []);
        setTotal(page.props.cartTotal || 0);
        setLoading(false);
      },
      onError: () => {
        setCartItems([]);
        setTotal(0);
        setLoading(false);
      },
    });
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    setUpdatingId(itemId);

    router.post(`/shop/cart/update/${itemId}`, {
      quantity: newQuantity,
      onFinish: () => {
        setUpdatingId(null);
        fetchCartItems();
      },
    });
  };

  const removeItem = (itemId: number) => {
    if (!confirm('Supprimer cet article du panier ?')) return;
    router.delete(`/shop/cart/remove/${itemId}`, {
      onSuccess: () => {
        fetchCartItems();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mon Panier
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex gap-4 p-4 border rounded-lg"
                >
                  {/* Image */}
                  <a
                    href={`/shop/item/${cartItem.item.slug}`}
                    className="shrink-0"
                    onClick={() => onOpenChange(false)}
                  >
                    {cartItem.item.image ? (
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </a>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/shop/item/${cartItem.item.slug}`}
                      className="font-semibold hover:text-primary line-clamp-1 block"
                      onClick={() => onOpenChange(false)}
                    >
                      {cartItem.item.name}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {cartItem.item.price} {money}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        disabled={updatingId === cartItem.id || cartItem.quantity <= 1}
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {cartItem.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        disabled={updatingId === cartItem.id || cartItem.quantity >= 99}
                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <div className="font-bold mb-2">
                      {cartItem.subtotal.toFixed(2)} {money}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => removeItem(cartItem.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">
                {total.toFixed(2)} {money}
              </span>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  onOpenChange(false);
                  router.visit('/shop/cart');
                }}
              >
                Voir le panier complet
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
