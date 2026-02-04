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
  IconUsers,
  IconServer,
  IconHome,
  IconShield,
  IconBan,
  IconDownload,
  IconList,
  IconMenu2,
  IconPlug,
  IconPalette,
  IconFileText,
  IconSettings,
  IconFolder,
  IconDatabase,
} from '@tabler/icons-react';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const pageProps = usePage<PageProps>().props as any;
  const { auth, settings, updatesCount = 0, enabledPlugins = [], enabledPluginConfigs = [], pluginNavigation = [] } = pageProps;

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
      // Check if plugin is enabled (if link requires a plugin)
      if (link.plugin && !enabledPlugins.includes(link.plugin)) {
        return false;
      }

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

  // Build plugin config links dynamically with dropdown support
  const pluginConfigLinks = enabledPluginConfigs.map((plugin: any) => {
    // Documentation plugin gets a dropdown menu
    if (plugin.id === 'documentation') {
      return {
        label: plugin.name,
        permission: 'admin.settings',
        icon: (
          <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
        children: [
          {
            label: trans('admin.documentation.menu.editor'),
            href: '/admin/editor',
            permission: 'admin.settings',
            icon: <IconFileText className="h-4 w-4" />,
          },
          {
            label: trans('admin.documentation.menu.configuration'),
            href: '/admin/plugins/documentation/settings',
            permission: 'admin.settings',
            icon: <IconSettings className="h-4 w-4" />,
          },
          {
            label: trans('admin.documentation.menu.browse'),
            href: '/admin/plugins/documentation/browse',
            permission: 'admin.settings',
            icon: <IconFolder className="h-4 w-4" />,
          },
          {
            label: trans('admin.documentation.menu.cache'),
            href: '/admin/plugins/documentation/cache',
            permission: 'admin.settings',
            icon: <IconDatabase className="h-4 w-4" />,
          },
        ],
      };
    }

    // Other plugins get a simple link
    return {
      label: plugin.name,
      href: plugin.configUrl,
      permission: 'admin.settings',
      icon: (
        <IconPlug className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    };
  });

  // Create PLUGIN CONFIG section (shown only if plugins have config)
  const pluginConfigSection = pluginConfigLinks.length > 0 ? [
    {
      type: 'section',
      label: 'PLUGIN CONFIG',
      children: pluginConfigLinks,
    },
  ] : [];

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
    // PLUGINS & THEMES Section (grouped together)
    {
      type: 'section',
      label: 'EXTENSIONS',
      children: [
        {
          label: 'Plugins',
          href: '/admin/plugins',
          permission: 'admin.settings',
          icon: (
            <IconPlug className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: 'Themes',
          href: '/admin/themes',
          permission: 'admin.settings',
          icon: (
            <IconPalette className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
    // Plugin Config section (as separate section, outside Settings)
    ...(pluginConfigLinks.length > 0 ? [
      {
        type: 'section',
        label: 'PLUGIN CONFIG',
        children: pluginConfigLinks,
      },
    ] : []),
    // CONFIGURATIONS Section - just simple links, no nested sections
    {
      type: 'section',
      label: 'CONFIGURATIONS',
      children: [
        {
          label: 'General',
          href: '/admin/settings/general',
          permission: 'admin.settings',
          icon: (
            <IconHome className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: 'Security',
          href: '/admin/settings/security',
          permission: 'admin.settings',
          icon: (
            <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: 'Maintenance',
          href: '/admin/settings/maintenance',
          permission: 'admin.settings',
          icon: (
            <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: 'Navbar',
          href: '/admin/navbar-elements',
          permission: 'admin.navbar',
          icon: (
            <IconMenu2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: 'Logs',
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

  // Secondary navigation links (bottom of sidebar)
  const secondaryLinks = [
    {
      label: 'Logs',
      href: '/admin/logs',
      permission: 'admin.logs',
      icon: (
        <IconList className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
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
