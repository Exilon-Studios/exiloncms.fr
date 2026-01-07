/**
 * Shop Layout - Public shop layout accessible to everyone
 * Uses the same Navbar and Footer as the main AppLayout
 */

import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Toaster } from 'sonner';
import FlashMessages from '@/components/FlashMessages';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import CartSheet from '@/components/shop/CartSheet';

export default function ShopLayout({ children }: PropsWithChildren) {
  const pageProps = usePage<PageProps>().props as any;
  const { settings, cartCount = 0 } = pageProps;
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className={settings.darkTheme ? 'dark' : ''}>
      <Toaster position="top-right" richColors />
      <FlashMessages />

      <div className="flex flex-col bg-background min-h-screen">
        {/* Use the same Navbar as the main site */}
        <Navbar showCart cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        {/* Main content */}
        <main className="flex-1 container px-4 md:px-6 py-8">
          {children}
        </main>

        {/* Use the same Footer as the main site */}
        <Footer />
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
