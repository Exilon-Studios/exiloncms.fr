/**
 * Admin Roles Index - Manage user roles and permissions
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Role } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';

interface RolesIndexProps extends PageProps {
  roles: Role[];
}

export default function RolesIndex({ roles }: RolesIndexProps) {
  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.roles.index.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {trans('admin.roles.index.title')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {trans('admin.roles.index.description')}
            </p>
          </div>
          <Link href={route('admin.roles.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {trans('admin.roles.index.create')}
            </Button>
          </Link>
        </div>

        {/* Roles Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: role.color }} />
                    <CardTitle className="text-lg" style={{ color: role.color }}>
                      {role.name}
                    </CardTitle>
                  </div>
                  {role.is_admin && (
                    <Badge variant="secondary" className="text-xs">
                      {trans('admin.roles.index.admin_badge')}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Permissions count - Simple text, no colorful badges */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{trans('admin.roles.index.permissions')}</span>
                  <span className="text-sm font-medium">{role.permissions.length}</span>
                </div>

                {/* Power level */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{trans('admin.roles.index.power')}</span>
                  <span className="text-sm font-medium">{role.power}</span>
                </div>

                {/* Role color indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="text-xs text-muted-foreground">Couleur du rôle</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.visit(route('admin.roles.edit', role.id))}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    {trans('admin.roles.index.edit')}
                  </Button>
                  {!role.is_admin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => router.delete(route('admin.roles.destroy', role.id))}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      {trans('admin.roles.index.delete')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
