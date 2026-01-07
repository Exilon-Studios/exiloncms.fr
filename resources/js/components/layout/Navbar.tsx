import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMenu2, IconX, IconShoppingCart } from '@tabler/icons-react';
import { PageProps } from '@/types';
import { trans } from '@/lib/i18n';
import { DropdownUser } from '@/components/DropdownUser';

interface NavbarElement {
  id: number;
  name: string;
  link: string;
  newTab: boolean;
  isDropdown: boolean;
  isCurrent: boolean;
  elements: NavbarElement[];
}

interface NavbarProps {
  showCart?: boolean;
  cartCount?: number;
  onCartOpen?: () => void;
}

// Helper to safely get the display name from navbar element
function getDisplayName(element: NavbarElement): string {
  return element.name || 'Sans nom';
}

export default function Navbar({ showCart = false, cartCount = 0, onCartOpen }: NavbarProps) {
  const { auth, settings, navbar } = usePage<PageProps>().props as any;

  return (
    <div className="w-full">
      <DesktopNav navbar={navbar} auth={auth} settings={settings} showCart={showCart} cartCount={cartCount} onCartOpen={onCartOpen} />
      <MobileNav navbar={navbar} auth={auth} settings={settings} showCart={showCart} cartCount={cartCount} onCartOpen={onCartOpen} />
      {/* Spacer for fixed navbar */}
      <div className="h-20 lg:h-24" />
    </div>
  );
}

const DesktopNav = ({ navbar, auth, settings, showCart, cartCount, onCartOpen }: any) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.post('/logout');
  };

  // Get navbar settings
  const navbarSettings = settings?.navbar || {};
  const linksPosition = navbarSettings.links_position || 'left';
  const linksSpacing = navbarSettings.links_spacing || '4rem';
  const navbarStyle = navbarSettings.style || 'transparent';
  const navbarBackground = navbarSettings.background;

  // Determine justify class based on position
  const getJustifyClass = () => {
    switch (linksPosition) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] flex flex-row items-center justify-between py-6 lg:flex",
        navbarStyle === 'transparent' ? "backdrop-blur-md bg-transparent" : "bg-background/95 backdrop-blur-sm border-b"
      )}
      style={navbarBackground ? { backgroundColor: navbarBackground } : undefined}
    >
      {/* Container to match content width */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex items-center justify-between">
        <Logo siteName={settings.name} />

      <div
        className={cn(
          "hidden flex-1 flex-row items-center space-x-2 text-sm font-medium transition duration-200 lg:flex",
          getJustifyClass()
        )}
        style={{ marginLeft: linksPosition === 'left' ? linksSpacing : 0 }}
      >
        {navbar?.map((element: NavbarElement, idx: number) => {
          const isExternal = element.newTab || element.link.startsWith('http');

          if (isExternal) {
            return (
              <a
                key={element.id}
                onMouseEnter={() => setHovered(idx)}
                className="relative px-4 py-2 text-foreground"
                href={element.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hovered === idx && (
                  <motion.div
                    layoutId="hovered"
                    className="absolute inset-0 h-full w-full rounded-full bg-accent"
                  />
                )}
                <span className="relative z-20">{getDisplayName(element)}</span>
              </a>
            );
          }

          return (
            <Link
              key={element.id}
              onMouseEnter={() => setHovered(idx)}
              className="relative px-4 py-2 text-foreground"
              href={element.link}
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full bg-accent"
                />
              )}
              <span className="relative z-20">{getDisplayName(element)}</span>
            </Link>
          );
        })}
      </div>

      {!auth.user ? (
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full px-6 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            {trans('messages.footer.auth.login')}
          </Link>
          <Link href="/register" className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            {trans('messages.footer.auth.register')}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {showCart && (
            <button
              onClick={onCartOpen}
              className="relative flex items-center justify-center rounded-full p-2 hover:bg-accent transition-colors"
              aria-label="Panier"
            >
              <IconShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          )}
          <DropdownUser user={auth.user} />
        </div>
      )}
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navbar, auth, settings, showCart, cartCount, onCartOpen }: any) => {
  const [open, setOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <motion.div
      animate={{ borderRadius: open ? "0" : "0" }}
      className="fixed top-0 left-0 right-0 z-[60] flex w-full flex-col items-center justify-between backdrop-blur-md bg-transparent py-4 lg:hidden"
    >
      {/* Container to match content width */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex w-full flex-col items-center justify-between">
        <div className="flex w-full flex-row items-center justify-between">
          <Logo siteName={settings.name} />
          {open ? (
            <IconX className="text-foreground" onClick={() => setOpen(!open)} />
          ) : (
            <IconMenu2 className="text-foreground" onClick={() => setOpen(!open)} />
          )}
        </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-16 z-20 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-card px-4 py-8"
          >
            {navbar?.map((element: NavbarElement) => {
              const isExternal = element.newTab || element.link.startsWith('http');

              if (isExternal) {
                return (
                  <a
                    key={element.id}
                    href={element.link}
                    className="relative text-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <motion.span className="block">{getDisplayName(element)}</motion.span>
                  </a>
                );
              }

              return (
                <Link
                  key={element.id}
                  href={element.link}
                  className="relative text-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <motion.span className="block">{getDisplayName(element)}</motion.span>
                </Link>
              );
            })}

            {!auth.user ? (
              <>
                <Link href="/login" className="w-full rounded-lg px-8 py-2 font-medium text-foreground hover:bg-accent transition-colors">
                  {trans('messages.footer.auth.login')}
                </Link>
                <Link href="/register" className="w-full rounded-lg bg-primary px-8 py-2 font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                  {trans('messages.footer.auth.register')}
                </Link>
              </>
            ) : (
              <div className="w-full flex flex-col gap-2">
                {showCart && (
                  <button
                    onClick={onCartOpen}
                    className="flex items-center gap-2 w-full rounded-lg px-8 py-2 font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <IconShoppingCart className="h-5 w-5" />
                    Panier {cartCount > 0 && `(${cartCount > 99 ? '99+' : cartCount})`}
                  </button>
                )}
                <DropdownUser user={auth.user} align="start" className="w-full" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Logo = ({ siteName }: { siteName: string }) => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <div className="h-6 w-6 flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <span className="font-bold text-foreground">{siteName}</span>
    </Link>
  );
};
