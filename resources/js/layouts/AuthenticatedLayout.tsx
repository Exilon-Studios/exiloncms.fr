import { PropsWithChildren } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { SidebarLayout } from '@/components/admin/Sidebar';
import { Toaster } from 'sonner';
import FlashMessages from '@/components/FlashMessages';
import { trans } from '@/lib/i18n';
import {
  IconBrandTabler,
  IconUserBolt,
  IconSettings,
  IconUsers,
  IconFileText,
  IconFile,
  IconServer,
  IconArrowLeft,
  IconHome,
  IconShield,
  IconBan,
  IconPhoto,
  IconArrowsRightLeft,
  IconPuzzle,
  IconPalette,
  IconDownload,
  IconList,
  IconLanguage,
  IconMenu2,
  IconShoppingBag,
  IconShoppingCart,
  IconPackage,
  IconBuilding,
} from '@tabler/icons-react';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const pageProps = usePage<PageProps>().props as any;
  const { auth, settings, enabledPlugins, pluginAdminNavItems, pluginUserNavItems, updatesCount } = pageProps;

  // Check if we're in admin section - hide user-facing shop links there
  const url = pageProps.url || window.location.pathname;
  const isAdminSection = url.startsWith('/admin');

  // Helper function to check if user has a specific permission
  const can = (permission: string): boolean => {
    if (!auth.user?.hasAdminAccess) return false;
    // Admin role (role with is_admin = true) has all permissions - no need to check specific permissions
    if (auth.user?.role?.is_admin) return true;
    // Check specific permissions for non-admin users with admin access
    return auth.user?.adminPermissions?.includes(permission) || false;
  };

  // Helper function to filter links based on permissions
  const filterLinks = (links: any[]): any[] => {
    return links.filter(link => {
      // Admin users can see all links regardless of specific permissions
      if (auth.user?.role?.is_admin) {
        return true;
      }
      // For non-admin users, check specific permissions
      if (link.permission && !can(link.permission)) {
        return false;
      }
      if (link.children) {
        link.children = filterLinks(link.children);
        // Hide section if it has no visible children
        if (link.type === 'section' && link.children.length === 0) {
          return false;
        }
      }
      return true;
    });
  };

  // Icon mapping for plugin navigation items
  const iconMap: Record<string, React.ReactNode> = {
    'shopping-bag': <IconShoppingBag className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'shopping-cart': <IconShoppingCart className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'package': <IconPackage className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'file-text': <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'puzzle': <IconPuzzle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'settings': <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'users': <IconUsers className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'shield': <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'ban': <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'file': <IconFile className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'photo': <IconPhoto className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'arrows-right-left': <IconArrowsRightLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'palette': <IconPalette className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'download': <IconDownload className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'list': <IconList className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    'language': <IconLanguage className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
  };

  // Helper function to get icon component from string name
  const getIconComponent = (iconName?: string): React.ReactNode => {
    if (!iconName) return <IconPuzzle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />;
    return iconMap[iconName] || <IconPuzzle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />;
  };

  // Primary navigation links - Sections rétractables
  const allPrimaryLinks = [
    // Dashboard
    {
      label: trans('admin.nav.dashboard'),
      href: '/admin',
      permission: 'admin.dashboard',
      icon: (
        <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    // User Plugin Links (Shop, Orders, Invoices, etc.) - Only show in dashboard, NOT in admin
    ...(!isAdminSection && pluginUserNavItems && pluginUserNavItems.length > 0 ? [
      {
        type: 'section',
        label: trans('shop.items'),
        children: pluginUserNavItems.map((item: any) => ({
          label: trans(`shop.nav.${item.label}`) || item.label,
          href: item.href,
          icon: typeof item.icon === 'string' ? getIconComponent(item.icon) : item.icon || getIconComponent(),
        })),
      },
    ] : []),
    // Users Section
    {
      type: 'section',
      label: trans('admin.nav.users.heading').toUpperCase(),
      children: [
        {
          label: trans('admin.nav.users.users'),
          href: '/admin/users',
          permission: 'admin.users',
          icon: (
            <IconUsers className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.users.roles'),
          href: '/admin/roles',
          permission: 'admin.roles',
          icon: (
            <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.users.bans'),
          href: '/admin/bans',
          permission: 'admin.users',
          icon: (
            <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
    // Content Section
    {
      type: 'section',
      label: trans('admin.nav.content.heading').toUpperCase(),
      children: [
        {
          label: trans('admin.nav.content.pages'),
          href: '/admin/pages',
          permission: 'admin.pages',
          icon: (
            <IconFile className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.content.posts'),
          href: '/admin/posts',
          permission: 'admin.posts',
          icon: (
            <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.content.images'),
          href: '/admin/images',
          permission: 'admin.images',
          icon: (
            <IconPhoto className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.content.redirects'),
          href: '/admin/redirects',
          permission: 'admin.redirects',
          icon: (
            <IconArrowsRightLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
    // Extensions Section
    {
      type: 'section',
      label: trans('admin.nav.extensions.heading').toUpperCase(),
      children: [
        {
          label: trans('admin.nav.extensions.plugins'),
          href: '/admin/plugins',
          permission: 'admin.plugins',
          icon: (
            <IconPuzzle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.extensions.themes'),
          href: '/admin/themes',
          permission: 'admin.themes',
          icon: (
            <IconPalette className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
    // Plugins Configuration Section (Dynamic - from enabled plugins)
    ...(enabledPlugins && Object.keys(enabledPlugins).length > 0 ? [
      {
        type: 'section',
        label: 'PLUGINS',
        children: Object.values(enabledPlugins).map((plugin: any) => ({
          label: plugin.name,
          href: `/admin/plugins/${plugin.id}`,
          permission: 'admin.plugins',
          icon: <IconPuzzle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
        })),
      },
    ] : []),
    // PARAMÈTRES Section - Menu déroulant principal contenant tous les paramètres
    {
      type: 'section',
      label: trans('admin.nav.settings.heading').toUpperCase(),
      children: [
        // Général - Sous-menu déroulant
        {
          type: 'section',
          label: trans('admin.nav.settings.general'),
          children: [
            {
              label: trans('admin.nav.settings.general_page'),
              href: '/admin/settings/general',
              permission: 'admin.settings',
              icon: (
                <IconHome className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.security'),
              href: '/admin/settings/security',
              permission: 'admin.settings',
              icon: (
                <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.mail'),
              href: '/admin/settings/mail',
              permission: 'admin.settings',
              icon: (
                <IconMenu2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.maintenance'),
              href: '/admin/settings/maintenance',
              permission: 'admin.settings',
              icon: (
                <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.navbar'),
              href: '/admin/navbar-elements',
              permission: 'admin.navbar',
              icon: (
                <IconMenu2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.servers'),
              href: '/admin/servers',
              permission: 'admin.servers',
              icon: (
                <IconServer className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
          ],
        },
        // LÉGAL - Sous-menu déroulant pour les pages légales
        {
          type: 'section',
          label: trans('admin.nav.legal.heading'),
          children: [
            {
              label: trans('admin.nav.legal.company'),
              href: '/admin/settings/company',
              permission: 'admin.settings',
              icon: (
                <IconBuilding className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.legal.terms'),
              href: '/admin/settings/legal/terms',
              permission: 'admin.settings',
              icon: (
                <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.legal.privacy'),
              href: '/admin/settings/legal/privacy',
              permission: 'admin.settings',
              icon: (
                <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.legal.cookies'),
              href: '/admin/settings/legal/cookies',
              permission: 'admin.settings',
              icon: (
                <IconLanguage className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.legal.refund'),
              href: '/admin/settings/legal/refund',
              permission: 'admin.settings',
              icon: (
                <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
          ],
        },
        // Autres items de paramètres (directement dans PARAMÈTRES)
        {
          label: trans('admin.nav.settings.translations'),
          href: '/admin/translations',
          permission: 'admin.settings',
          icon: (
            <IconLanguage className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.other.update'),
          href: '/admin/updates',
          permission: 'admin.update',
          icon: (
            <IconDownload className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
          badge: updatesCount > 0 ? updatesCount : undefined,
        },
        {
          label: trans('admin.nav.other.logs'),
          href: '/admin/logs',
          permission: 'admin.logs',
          icon: (
            <IconList className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
  ];

  // Filter links based on user permissions
  const primaryLinks = filterLinks(allPrimaryLinks);

  // Secondary navigation links
  const secondaryLinks = [
    {
      label: trans('messages.sidebar.documentation'),
      href: 'https://docs.exiloncms.fr/',
      icon: (
        <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      external: true,
    },
    {
      label: trans('messages.sidebar.official_site'),
      href: 'https://exiloncms.fr/',
      icon: (
        <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
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
          hasAdminAccess: auth.user?.hasAdminAccess,
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
