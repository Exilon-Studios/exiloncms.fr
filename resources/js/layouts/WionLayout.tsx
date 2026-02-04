/**
 * Wion Theme - Main Layout with Particle Effects
 */

import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface WionLayoutProps {
  children: ReactNode;
}

export default function WionLayout({ children }: WionLayoutProps) {
  const { settings } = usePage<PageProps>().props as any;

  return (
    <div className="min-h-screen bg-background font-sans antialiased relative overflow-x-hidden">
      <Navbar />
      <main className="min-h-[calc(100vh-theme(spacing.32))]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
