/**
 * BlogThemeLayout - Custom layout for blog theme
 * Based on PublicLayout but allows full-width hero section
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

interface BlogThemeLayoutProps {
  showCart?: boolean;
}

export default function BlogThemeLayout({ children, showCart = false }: PropsWithChildren<BlogThemeLayoutProps>) {
  const pageProps = usePage<PageProps>().props as any;
  const { settings, cartCount = 0 } = pageProps;
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className={settings.darkTheme ? 'dark' : ''}>
      <Toaster position="top-right" richColors />
      <FlashMessages />

      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 relative">
        <Navbar showCart={showCart} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        <main className="flex-1 relative z-10">
          {/* No container constraint - children handle their own width */}
          {children}
        </main>

        <Footer />
      </div>

      {showCart && <CartSheet open={cartOpen} onOpenChange={setCartOpen} />}
    </div>
  );
}
