/**
 * PublicLayout - Layout for all public pages (shop, vote, etc.)
 * Provides consistent structure and width for public-facing pages
 * Can be customized by community themes
 */

import { PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Toaster } from 'sonner';
import FlashMessages from '@/components/FlashMessages';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import CartSheet from '@/components/shop/CartSheet';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  showCart?: boolean;
}

export default function PublicLayout({ children, showCart = false }: PropsWithChildren<PublicLayoutProps>) {
  const pageProps = usePage<PageProps>().props as any;
  const { settings, cartCount = 0 } = pageProps;
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className={settings.darkTheme ? 'dark' : ''}>
      <Toaster position="top-right" richColors />
      <FlashMessages />

      <div className="flex flex-col bg-background min-h-screen">
        <Navbar showCart={showCart} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        <main className="flex-1">
          <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
            {children}
          </div>
        </main>

        <Footer />
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}

/**
 * PublicLayoutHeader - Header section with icon, title and description
 */
export interface PublicLayoutHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function PublicLayoutHeader({ icon, title, description, className }: PublicLayoutHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-primary">{icon}</div>}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
      </div>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/**
 * PublicLayoutTitle - Just the title component for reusability
 */
export interface PublicLayoutTitleProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PublicLayoutTitle({ children, icon, className }: PublicLayoutTitleProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-2', className)}>
      {icon && <div className="text-primary">{icon}</div>}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">{children}</h1>
    </div>
  );
}

/**
 * PublicLayoutDescription - Just the description component
 */
export interface PublicLayoutDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function PublicLayoutDescription({ children, className }: PublicLayoutDescriptionProps) {
  return (
    <p className={cn('text-sm md:text-base text-muted-foreground mb-8', className)}>
      {children}
    </p>
  );
}

/**
 * PublicLayoutContent - Content wrapper with consistent spacing
 */
export interface PublicLayoutContentProps {
  children: ReactNode;
  className?: string;
}

export function PublicLayoutContent({ children, className }: PublicLayoutContentProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {children}
    </div>
  );
}

/**
 * PublicLayoutSection - Section wrapper for grouping related content
 */
export interface PublicLayoutSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function PublicLayoutSection({ children, title, description, className }: PublicLayoutSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
