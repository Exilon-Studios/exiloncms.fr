/**
 * Admin Users Index - List all users with search
 * Real data from database with pagination
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, AdminUser } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  UserPlus,
  Search,
  Ban,
  Shield,
  Trash2,
  Edit,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface UsersIndexProps extends PageProps {
  users: PaginatedData<AdminUser>;
  search: string | null;
  canViewEmail: boolean;
  notificationLevels: string[];
}

export default function UsersIndex({
  users,
  search: initialSearch,
  canViewEmail,
}: UsersIndexProps) {
  const [search, setSearch] = useState(initialSearch || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.get(route('admin.users.index'), { search }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const confirmDelete = (userId: number, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
  };

  const deleteUser = () => {
    if (userToDelete) {
      router.delete(route('admin.users.destroy', userToDelete.id), {
        onSuccess: () => toast.success(trans('admin.users.index.deleted', { user: userToDelete.name })),
        onError: () => toast.error(trans('admin.users.index.delete_failed')),
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.nav.users.users')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.nav.users.users')}
            description={trans('admin.users.index.manage_description', { total: users.total.toString() })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.users.create')}>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                {trans('admin.users.create')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={trans('admin.users.index.search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">{trans('admin.users.index.search')}</Button>
              {initialSearch && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    router.get(route('admin.users.index'));
                  }}
                >
                  {trans('admin.users.index.clear')}
                </Button>
              )}
            </form>

            {/* Users Table */}
            <div className="rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{trans('admin.users.index.user')}</TableHead>
                    {canViewEmail && (
                      <TableHead>{trans('admin.users.index.email')}</TableHead>
                    )}
                    <TableHead>{trans('admin.users.index.role')}</TableHead>
                    <TableHead>{trans('admin.users.index.money')}</TableHead>
                    <TableHead>{trans('admin.users.index.created')}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://mc-heads.net/avatar/${user.name}/32`}
                              alt={user.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.ban && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                <Ban className="h-3 w-3 mr-1" />
                                {trans('admin.users.banned')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      {canViewEmail && (
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          {user.role.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.money}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.visit(route('admin.users.edit', user.id))}>
                              <Eye className="mr-2 h-4 w-4" />
                              {trans('admin.users.index.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.visit(route('admin.users.edit', user.id))}>
                              <Edit className="mr-2 h-4 w-4" />
                              {trans('admin.users.index.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => confirmDelete(user.id, user.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {trans('admin.users.index.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {users.last_page > 1 && (
                <div className="bg-muted/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {trans('admin.users.index.showing', {
                        from: ((users.current_page - 1) * users.per_page + 1).toString(),
                        to: Math.min(users.current_page * users.per_page, users.total).toString(),
                        total: users.total.toString()
                      })}
                    </p>
                    <div className="flex gap-2">
                      {users.current_page > 1 && (
                        <Link
                          href={route('admin.users.index', {
                            page: users.current_page - 1,
                            search: initialSearch,
                          })}
                        >
                          <Button variant="outline" size="sm">
                            {trans('admin.users.index.previous')}
                          </Button>
                        </Link>
                      )}
                      {users.current_page < users.last_page && (
                        <Link
                          href={route('admin.users.index', {
                            page: users.current_page + 1,
                            search: initialSearch,
                          })}
                        >
                          <Button variant="outline" size="sm">
                            {trans('admin.users.index.next')}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminLayoutContent>
      </AdminLayout>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{trans('admin.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {trans('admin.delete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{trans('admin.users.index.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {trans('admin.users.index.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
