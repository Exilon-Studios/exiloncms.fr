/**
 * Admin Bans Index - List all bans
 */

import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, PaginatedData } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Ban as BanIcon } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface BanUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface BanAuthor {
  id: number;
  name: string;
}

interface BanRemover {
  id: number;
  name: string;
}

interface Ban {
  id: number;
  reason: string;
  created_at: string;
  deleted_at: string | null;
  user: BanUser;
  author: BanAuthor;
  remover: BanRemover | null;
}

interface BansIndexProps extends PageProps {
  bans: PaginatedData<Ban>;
}

export default function BansIndex({ bans }: BansIndexProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.nav.users.bans')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Bannissements"
            description="Liste de tous les bannissements utilisateurs"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Raison</TableHead>
                  <TableHead>Banni par</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bans.data.map((ban) => (
                  <TableRow key={ban.id}>
                    <TableCell>
                      <Link
                        href={route('admin.users.edit', ban.user.id)}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(ban.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{ban.user.name}</p>
                          <p className="text-sm text-muted-foreground">{ban.user.email}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{ban.reason || 'Aucune raison'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ban.author.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(ban.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {ban.deleted_at ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {ban.remover ? `Révoqué par ${ban.remover.name}` : 'Révoqué'}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <BanIcon className="h-3 w-3" />
                          Actif
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {bans.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun bannissement trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
