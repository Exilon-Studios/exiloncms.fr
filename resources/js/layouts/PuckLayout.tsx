import { ReactNode } from 'react';

interface PuckLayoutProps {
  children: ReactNode;
}

/**
 * Layout for Puck pages.
 * Unlike AppLayout, this does NOT include Navbar or Footer
 * since Puck components (NavbarBlock, FooterBlock) handle those.
 */
export default function PuckLayout({ children }: PuckLayoutProps) {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <div id="app" className="flex-shrink-0 relative">
        {children}
      </div>
    </div>
  );
}
