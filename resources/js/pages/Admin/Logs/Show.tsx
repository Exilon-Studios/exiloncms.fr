/**
 * Admin Logs Show - View single action log details
 */

import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ActionLog {
  id: number;
  user: User | null;
  action: string;
  target_type: string | null;
  target_id: number | null;
  data: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface LogsShowProps extends PageProps {
  log: ActionLog;
}

export default function LogsShow({ log }: LogsShowProps) {
  const getActionColor = (action: string) => {
    if (action.includes('deleted') || action.includes('banned')) {
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
    if (action.includes('created') || action.includes('added')) {
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
    if (action.includes('updated') || action.includes('edited')) {
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
    return '';
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.logs.show.title', { id: log.id })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.logs.show.title_page')}
            description={trans('admin.logs.show.description', { id: log.id })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.logs.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.logs.show.back')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Log Summary */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{trans('admin.logs.show.summary')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-sm font-medium text-muted-foreground min-w-32">
                    {trans('admin.logs.show.action')}
                  </span>
                  <Badge variant="secondary" className={getActionColor(log.action)}>
                    {log.action}
                  </Badge>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-sm font-medium text-muted-foreground min-w-32">
                    {trans('admin.logs.show.user')}
                  </span>
                  {log.user ? (
                    <div>
                      <p className="text-sm font-medium">{log.user.name}</p>
                      <p className="text-xs text-muted-foreground">{log.user.email}</p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">{trans('admin.logs.show.system')}</span>
                  )}
                </div>

                {log.target_type && log.target_id && (
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-muted-foreground min-w-32">
                      {trans('admin.logs.show.target')}
                    </span>
                    <p className="text-sm">
                      {log.target_type} <span className="text-muted-foreground">#{log.target_id}</span>
                    </p>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <span className="text-sm font-medium text-muted-foreground min-w-32">
                    {trans('admin.logs.show.date')}
                  </span>
                  <p className="text-sm">{new Date(log.created_at).toLocaleString()}</p>
                </div>

                {log.ip_address && (
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-muted-foreground min-w-32">
                      {trans('admin.logs.show.ip')}
                    </span>
                    <p className="text-sm font-mono">{log.ip_address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Data */}
            {log.data && Object.keys(log.data).length > 0 && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">{trans('admin.logs.show.data_title')}</h3>
                <pre className="text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              </div>
            )}

            {/* User Agent */}
            {log.user_agent && (
              <div className="border border-border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">{trans('admin.logs.show.user_agent_title')}</h3>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {log.user_agent}
                </p>
              </div>
            )}
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
