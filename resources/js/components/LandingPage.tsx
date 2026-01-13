import { ReactNode } from 'react';
import Navbar from './layout/Navbar';
import Hero, { HeroProps, Server } from './Hero';

interface LandingPageProps extends Omit<HeroProps, 'children'> {
  /**
   * Include navbar at the top?
   * @default true
   */
  showNavbar?: boolean;

  /**
   * Navbar props
   */
  showCart?: boolean;
  cartCount?: number;
  onCartOpen?: () => void;

  /**
   * Custom content for right side
   * If provided, replaces default CTA buttons
   */
  children?: ReactNode;
}

/**
 * Landing Page - Complete modular landing page
 *
 * Usage examples:
 *
 * 1. Full landing page with navbar + hero + default CTAs:
 *    <LandingPage />
 *
 * 2. Without navbar:
 *    <LandingPage showNavbar={false} />
 *
 * 3. With custom content:
 *    <LandingPage>
 *      <div>Custom right side content</div>
 *    </LandingPage>
 *
 * 4. Just hero (no navbar):
 *    <Hero />
 *
 * 5. Just navbar (no hero):
 *    <Navbar />
 */
export default function LandingPage({
  showNavbar = true,
  showCart = false,
  cartCount = 0,
  onCartOpen,
  children,
  ...heroProps
}: LandingPageProps) {
  return (
    <>
      {showNavbar && <Navbar showCart={showCart} cartCount={cartCount} onCartOpen={onCartOpen} />}
      <Hero {...heroProps}>{children}</Hero>
    </>
  );
}

// Re-export Server type for convenience
export type { Server };
