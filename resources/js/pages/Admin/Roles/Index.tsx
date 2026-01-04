/**
 * Admin Roles Index - Manage user roles and permissions
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Role } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RolesIndexProps extends PageProps {
  roles: Role[];
  permissions: Permission[];
  linkRoles: boolean;
}

export default function RolesIndex({ roles, permissions }: RolesIndexProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{ id: number; name: string } | null>(null);

  const confirmDelete = (roleId: number, roleName: string) => {
    setRoleToDelete({ id: roleId, name: roleName });
    setDeleteDialogOpen(true);
  };

  const deleteRole = () => {
    if (roleToDelete) {
      router.delete(route('admin.roles.destroy', roleToDelete.id), {
        onSuccess: () => toast.success(trans('admin.roles.index.deleted', { role: roleToDelete.name })),
        onError: () => toast.error(trans('admin.roles.index.delete_failed')),
      });
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.roles.index.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.roles.index.title')}
            description={trans('admin.roles.index.description')}
          />
          <AdminLayoutActions>
            <Link href={route('admin.roles.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.roles.index.create')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Roles Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{trans('admin.roles.index.role')}</TableHead>
                    <TableHead>{trans('admin.roles.index.power')}</TableHead>
                    <TableHead>{trans('admin.roles.index.permissions')}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" style={{ color: role.color }} />
                          <span className="font-semibold" style={{ color: role.color }}>
                            {role.name}
                          </span>
                          {role.is_admin && (
                            <Badge variant="secondary" className="text-xs">{trans('admin.roles.index.admin_badge')}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {role.power}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((perm) => (
                            <Badge
                              key={perm.id}
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: `${role.color}20`,
                                color: role.color,
                              }}
                            >
                              {perm.name}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-0.5">
                              {trans('admin.roles.index.more', { count: role.permissions.length - 3 })}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.visit(route('admin.roles.edit', role.id))}>
                              <Edit className="mr-2 h-4 w-4" />
                              {trans('admin.roles.index.edit')}
                            </DropdownMenuItem>
                            {!role.is_admin && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => confirmDelete(role.id, role.name)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {trans('admin.roles.index.delete')}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* All Permissions Reference */}
            <Card>
              <CardHeader>
                <CardTitle>{trans('admin.roles.index.available_permissions')}</CardTitle>
                <CardDescription>{trans('admin.roles.index.available_permissions_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {permissions.map((perm) => (
                    <div key={perm.id} className="rounded-lg border border-border p-3 bg-muted/50">
                      <p className="font-medium text-sm">{perm.name}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </AdminLayoutContent>
      </AdminLayout>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{trans('admin.roles.index.delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {trans('admin.roles.index.delete_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{trans('admin.roles.index.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteRole} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {trans('admin.roles.index.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
