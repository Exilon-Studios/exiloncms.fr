/**
 * DashboardLayout - Layout for /dashboard page (user-facing, not admin)
 * Uses sidebar but with simplified navigation (no admin sections)
 */

import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Toaster } from 'sonner';
import FlashMessages from '@/components/FlashMessages';
import { SidebarLayout, Logo, LogoIcon, SidebarLink } from '@/components/admin/Sidebar';
import { IconHome, IconUser, IconBell, IconFileText, IconBrandTabler, IconShoppingCart, type Icon } from '@tabler/icons-react';
import { DropdownUser } from '@/components/DropdownUser';
import { trans } from '@/lib/i18n';

// Map icon names from plugin.json to Tabler icon components
const iconMap: Record<string, Icon> = {
  Home: IconHome,
  User: IconUser,
  Bell: IconBell,
  FileText: IconFileText,
  BrandTabler: IconBrandTabler,
  ShoppingCart: IconShoppingCart,
  // Add more mappings as needed
};

function getIconComponent(iconName: string): Icon | null {
  return iconMap[iconName] || null;
}

interface DashboardLayoutProps {
  // No props needed - sidebar links come from plugins
}

export default function DashboardLayout({ children }: PropsWithChildren<DashboardLayoutProps>) {
  const pageProps = usePage<PageProps>().props as any;
  const { settings, userSidebarLinks = [], auth } = pageProps;

  // User-facing navigation links (NO admin sections)
  const primaryLinks = [
    {
      label: trans('admin.nav.dashboard'),
      href: '/dashboard',
      icon: <IconHome className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: trans('dashboard.my_profile'),
      href: '/profile',
      icon: <IconUser className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: trans('dashboard.notifications'),
      href: '/notifications',
      icon: <IconBell className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    // Add plugin-provided sidebar links dynamically
    ...userSidebarLinks.map((link: any) => {
      const IconComponent = link.icon ? getIconComponent(link.icon) : null;
      return {
        label: link.trans ? trans(link.label) : link.label,
        href: link.href,
        icon: IconComponent ? <IconComponent className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" /> : undefined,
      };
    }),
  ];

  // Secondary links (documentation, official site, etc)
  const secondaryLinks = [
    {
      label: trans('messages.sidebar.documentation'),
      href: 'https://docs.exiloncms.fr/',
      icon: <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
      external: true,
    },
    {
      label: trans('messages.sidebar.official_site'),
      href: 'https://exiloncms.fr/',
      icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
      external: true,
    },
  ];

  return (
    <div className={settings.darkTheme ? 'dark' : ''}>
      <Toaster position="top-right" richColors />
      <FlashMessages />
      <SidebarLayout
        primaryLinks={primaryLinks}
        secondaryLinks={secondaryLinks}
        userInfo={{
          name: auth.user?.name || 'User',
          email: auth.user?.email,
          avatar: auth.user?.avatar,
          role: auth.user?.role,
          hasAdminAccess: false, // Dashboard users don't have admin access
        }}
        siteName={settings.name || 'ExilonCMS'}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex-1 px-6 md:px-8 pt-6 md:pt-8 pb-8">
            {children}
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
}
