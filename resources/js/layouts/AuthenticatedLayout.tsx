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
} from '@tabler/icons-react';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
  const { auth, settings } = usePage<PageProps>().props as any;

  // Primary navigation links - Sections rétractables
  const primaryLinks = [
    // Dashboard
    {
      label: trans('admin.nav.dashboard'),
      href: '/admin',
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
          icon: (
            <IconUsers className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.users.roles'),
          href: '/admin/roles',
          icon: (
            <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.users.bans'),
          href: '/admin/bans',
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
          icon: (
            <IconFile className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.content.posts'),
          href: '/admin/posts',
          icon: (
            <IconFileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.content.images'),
          href: '/admin/images',
          icon: (
            <IconPhoto className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.content.redirects'),
          href: '/admin/redirects',
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
          icon: (
            <IconPuzzle className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.extensions.themes'),
          href: '/admin/themes',
          icon: (
            <IconPalette className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
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
              icon: (
                <IconHome className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.security'),
              href: '/admin/settings/security',
              icon: (
                <IconShield className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.mail'),
              href: '/admin/settings/mail',
              icon: (
                <IconMenu2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.maintenance'),
              href: '/admin/settings/maintenance',
              icon: (
                <IconBan className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.navbar'),
              href: '/admin/navbar-elements',
              icon: (
                <IconMenu2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: trans('admin.nav.settings.servers'),
              href: '/admin/servers',
              icon: (
                <IconServer className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
          ],
        },
        // Autres items de paramètres (directement dans PARAMÈTRES)
        {
          label: trans('admin.nav.settings.translations'),
          href: '/admin/translations',
          icon: (
            <IconLanguage className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.other.update'),
          href: '/admin/updates',
          icon: (
            <IconDownload className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
        {
          label: trans('admin.nav.other.logs'),
          href: '/admin/logs',
          icon: (
            <IconList className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
        },
      ],
    },
  ];

  // Secondary navigation links
  const secondaryLinks = [
    {
      label: trans('admin.nav.back'),
      href: '/',
      icon: (
        <IconHome className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: 'Logout',
      href: '#',
      icon: (
        <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        router.post('/logout');
      },
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
          avatar: auth.user?.avatar,
        }}
        siteName={settings.name || 'MC-CMS'}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-6 md:pt-8">
            {children}
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
}
