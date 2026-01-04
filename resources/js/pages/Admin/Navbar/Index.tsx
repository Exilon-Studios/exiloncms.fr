/**
 * Admin Navbar Elements Index - List all navbar elements with drag and drop
 */

import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, NavbarElement } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { trans } from '@/lib/i18n';
import NavbarSortable from '@/components/admin/NavbarSortable';

interface NavbarIndexProps extends PageProps {
  navbarElements: NavbarElement[];
}

export default function NavbarIndex({ navbarElements: elements }: NavbarIndexProps) {
  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.navbar.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.navbar.index.title')}
            description={trans('admin.navbar.index.description', { count: elements.length })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.navbar-elements.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.navbar.index.create_button')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <NavbarSortable elements={elements} />
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
