/**
 * Admin Servers Index - List all servers
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Server } from '@/types';
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
import { Plus, Edit, Trash2, Server as ServerIcon, CheckCircle2, XCircle } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface ServerStat {
  players: number;
  max_players: number;
  cpu?: number;
  ram?: number;
}

interface ServerWithStat extends Server {
  stat?: ServerStat;
}

interface ServersIndexProps extends PageProps {
  servers: ServerWithStat[];
}

export default function ServersIndex({ servers }: ServersIndexProps) {
  const deleteServer = (serverId: number) => {
    if (confirm(trans('admin.servers.index.confirm_delete'))) {
      router.delete(route('admin.servers.destroy', serverId));
    }
  };

  const setDefault = (serverId: number) => {
    router.post(route('admin.servers.set-default', serverId));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.servers.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.servers.index.title')}
            description={trans('admin.servers.index.description', { count: servers.length })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.servers.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {trans('admin.servers.index.create_button')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{trans('admin.servers.index.columns.name')}</TableHead>
                  <TableHead>{trans('admin.servers.index.columns.type')}</TableHead>
                  <TableHead>{trans('admin.servers.index.columns.address')}</TableHead>
                  <TableHead>{trans('admin.servers.index.columns.status')}</TableHead>
                  <TableHead>{trans('admin.servers.index.columns.players')}</TableHead>
                  <TableHead>{trans('admin.servers.index.columns.default')}</TableHead>
                  <TableHead className="text-right">{trans('admin.servers.index.columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {trans('admin.servers.index.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ServerIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{server.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{server.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {server.address}
                        {server.port && `:${server.port}`}
                      </TableCell>
                      <TableCell>
                        {server.is_online ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {trans('admin.servers.index.status.online')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
                            <XCircle className="h-3 w-3 mr-1" />
                            {trans('admin.servers.index.status.offline')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {server.stat ? (
                          <span className="text-sm">
                            {server.stat.players}/{server.stat.max_players}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {server.is_default ? (
                          <Badge>{trans('admin.servers.index.default_badge')}</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefault(server.id)}
                          >
                            {trans('admin.servers.index.set_default_button')}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('admin.servers.edit', server.id)}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {trans('admin.servers.index.edit_button')}
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteServer(server.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
