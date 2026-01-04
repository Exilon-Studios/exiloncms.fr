import React from "react";
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { DropdownUser } from '@/components/DropdownUser';
import { trans } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface NavbarElement {
  id: number;
  name: string;
  link: string;
  newTab: boolean;
  isDropdown: boolean;
  isCurrent: boolean;
  elements: NavbarElement[];
}

interface NavbarBlockProps {
  puck?: {
    isEditing?: boolean;
  };
  layout?: "left" | "center";
}

// Helper to safely get the display name from navbar element
function getDisplayName(element: NavbarElement): string {
  return element.name || 'Sans nom';
}

export const NavbarBlock: React.FC<NavbarBlockProps> = (props) => {
  const { puck, layout = "left" } = props || {};
  const isEditing = puck?.isEditing || false;
  const { auth, settings, navbar } = usePage<PageProps>().props;

  const links = navbar || [];

  // Wrapper pour Link qui désactive les liens en mode édition
  const SafeLink = ({ href, children, newTab, className, onClick }: any) => {
    if (isEditing) {
      return <span className={className}>{children}</span>;
    }

    const isExternal = newTab || href?.startsWith('http');

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  };

  // Logo component
  const Logo = () => (
    <SafeLink href="/" className="flex items-center">
      <div className="h-6 w-6 flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <span className="ml-2 font-bold text-foreground">
        {settings?.name || 'MC-CMS'}
      </span>
    </SafeLink>
  );

  // Layout with logo centered and links split left/right
  if (layout === "center") {
    const midPoint = Math.ceil(links.length / 2);
    const leftLinks = links.slice(0, midPoint);
    const rightLinks = links.slice(midPoint);

    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 flex-1">
              {leftLinks.map((link: NavbarElement) => (
                <SafeLink
                  key={link.id}
                  href={link.link}
                  newTab={link.newTab}
                  className="relative px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-full transition-colors"
                >
                  <span className="relative z-20">{getDisplayName(link)}</span>
                </SafeLink>
              ))}
            </div>

            {/* Logo (Centered) */}
            <Logo />

            {/* Right Navigation Links + Auth */}
            <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
              {rightLinks.map((link: NavbarElement) => (
                <SafeLink
                  key={link.id}
                  href={link.link}
                  newTab={link.newTab}
                  className="relative px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-full transition-colors"
                >
                  <span className="relative z-20">{getDisplayName(link)}</span>
                </SafeLink>
              ))}

              {/* Auth Buttons or User Menu */}
              <div className="flex items-center gap-2 ml-4">
                {!auth?.user ? (
                  <>
                    <SafeLink
                      href="/login"
                      className="rounded-full px-6 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      {trans('messages.footer.auth.login')}
                    </SafeLink>
                    <SafeLink
                      href="/register"
                      className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                      {trans('messages.footer.auth.register')}
                    </SafeLink>
                  </>
                ) : (
                  <DropdownUser user={auth.user} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Default layout: logo + links on left, auth on right
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo + Links (Left) */}
          <div className="flex items-center space-x-2">
            <Logo />

            {links.map((link: NavbarElement) => (
              <SafeLink
                key={link.id}
                href={link.link}
                newTab={link.newTab}
                className="relative px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-full transition-colors"
              >
                <span className="relative z-20">{getDisplayName(link)}</span>
              </SafeLink>
            ))}
          </div>

          {/* Auth Buttons or User Menu (Right) */}
          <div className="ml-auto flex items-center gap-2">
            {!auth?.user ? (
              <>
                <SafeLink
                  href="/login"
                  className="rounded-full px-6 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  {trans('messages.footer.auth.login')}
                </SafeLink>
                <SafeLink
                  href="/register"
                  className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  {trans('messages.footer.auth.register')}
                </SafeLink>
              </>
            ) : (
              <DropdownUser user={auth.user} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
