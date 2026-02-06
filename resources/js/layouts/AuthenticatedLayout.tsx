import { PropsWithChildren, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { SidebarLayout } from '@/components/admin/Sidebar';
import { Toaster } from 'sonner';
import FlashMessages from '@/components/FlashMessages';
import { trans } from '@/lib/i18n';
import {
  IconBrandTabler,
  IconUsers,
  IconHome,
  IconShield,
  IconBan,
  IconDownload,
  IconList,
  IconMenu2,
  IconPlug,
  IconPalette,
} from '@tabler/icons-react';
import { renderIcon } from '@/lib/navigation-icons';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const pageProps = usePage<PageProps>().props as any;
  const { auth, settings, updatesCount = 0, enabledPlugins = [], pluginNavigation = [] } = pageProps;

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

  // Convert plugin navigation items to sidebar format
  const buildPluginNavigationItems = useMemo(() => {
    return pluginNavigation.map((pluginNav: any) => {
      const item: any = {
        id: pluginNav.id || pluginNav.plugin,
        label: pluginNav.trans ? trans(`admin.plugins.${pluginNav.plugin}.admin.section`) : pluginNav.label,
        permission: pluginNav.permission || 'admin.settings',
        icon: renderIcon(pluginNav.icon, 'h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200'),
        plugin: pluginNav.plugin,
        position: pluginNav.position || 100,
      };

      // If plugin navigation has children (sub-items)
      if (pluginNav.items && pluginNav.items.length > 0) {
        item.type = 'section';
        item.label = pluginNav.trans ? trans(`admin.plugins.${pluginNav.plugin}.admin.section`) : pluginNav.label;
        item.children = pluginNav.items.map((child: any, index: number) => ({
          id: child.id || `${pluginNav.plugin}.${index}`,
          label: child.trans ? trans(child.label) : child.label,
          href: child.href,
          permission: child.permission || 'admin.settings',
          icon: child.icon ? renderIcon(child.icon, 'h-4 w-4') : undefined,
          position: child.position || index * 10,
        }));
      } else if (pluginNav.href) {
        item.href = pluginNav.href;
      }

      return item;
    });
  }, [pluginNavigation]);

  // Plugin navigation is now handled by buildPluginNavigationItems
  // from plugin.json admin_section, so we don't need pluginConfigLinks

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
  // Extensions Section (Plugins & Themes)
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
    // Dynamic plugin navigation from plugin.json manifests
    ...pluginNavigation,
    // PLUGIN CONFIG Section - unified section for all plugin dropdowns
    {
      type: 'section',
      label: 'PLUGIN CONFIG',
      children: pluginNavigation,
    },
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
        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-8">
          {children}
        </div>
      </SidebarLayout>
    </div>
  );
}
