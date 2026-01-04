import { ReactNode, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { registerOverlayPortal } from '@measured/puck';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  disabledInEditor?: boolean;
}

/**
 * NavLink component that supports Overlay Portals for Puck editor
 * Links remain clickable in the editor when registered as overlay portals
 */
export const NavLink = ({
  href,
  children,
  className,
  onClick,
  target,
  rel,
  disabledInEditor = false,
}: NavLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Only register once when ref is available
    if (linkRef.current && !disabledInEditor && !cleanupRef.current) {
      cleanupRef.current = registerOverlayPortal(linkRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [disabledInEditor]);

  // Check if we're in editing mode (Puck sets data-puck-editor attribute)
  const isInEditor = typeof document !== 'undefined' &&
    document.querySelector('[data-puck-editor]') !== null;

  // Handle internal links with Inertia Link
  if (href?.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link
        ref={linkRef}
        href={isInEditor && !disabledInEditor ? '#' : href}
        onClick={isInEditor && !disabledInEditor
          ? (e) => { e.preventDefault(); onClick?.(e); }
          : onClick
        }
        className={className}
      >
        {children}
      </Link>
    );
  }

  // Handle external links with regular anchor tag
  return (
    <a
      ref={linkRef}
      href={href}
      onClick={onClick}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
};
