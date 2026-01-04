import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { settings } = usePage().props as any;

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <div id="app" className="flex-shrink-0 relative">
        <Navbar />
        {children}
      </div>

      <Footer />
    </div>
  );
}
