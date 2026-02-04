import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { trans } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  FileText,
  HardDrive,
  Table as TableIcon,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Save,
  FolderOpen,
} from 'lucide-react';

interface DatabaseInfo {
  connection: string;
  database: string;
  driver: string;
  size: string;
  table_count: number;
  version: string;
}

interface Backup {
  filename: string;
  size: string;
  created_at: string;
}

interface Props {
  info: DatabaseInfo;
  backups: Backup[];
}

export default function DatabaseIndex({ info, backups }: Props) {
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const backupForm = useForm({
    name: '',
  });

  const truncateForm = useForm({
    confirm: false,
  });

  const importForm = useForm({
    sql_file: null as File | null,
  });

  const handleBackup = () => {
    setIsLoading(true);
    backupForm.post(route('admin.database.backup'), {
      onSuccess: () => {
        backupForm.reset();
        setIsLoading(false);
        router.reload();
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  const handleRestore = () => {
    if (!selectedBackup) return;

    if (!confirm(trans('admin.database.restore_confirm'))) {
      return;
    }

    router.post(
      route('admin.database.restore'),
      { backup: selectedBackup },
      {
        onSuccess: () => {
          alert(trans('admin.database.restore_success'));
          router.reload();
        },
      }
    );
  };

  const handleDeleteBackup = (filename: string) => {
    if (!confirm(trans('admin.database.delete_backup_confirm'))) {
      return;
    }

    router.delete(route('admin.database.delete-backup', filename), {
      onSuccess: () => {
        router.reload();
      },
    });
  };

  const handleExportSQL = () => {
    window.location.href = route('admin.database.export');
  };

  const handleExportSQLite = () => {
    window.location.href = route('admin.database.export.sqlite');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    importForm.post(route('admin.database.import'), {
      onSuccess: () => {
        alert(trans('admin.database.import_success'));
        importForm.reset();
        router.reload();
      },
    });
  };

  const handleOptimize = () => {
    if (!confirm(trans('admin.database.optimize_confirm'))) {
      return;
    }

    router.post(route('admin.database.optimize'), {}, {
      onSuccess: () => {
        alert(trans('admin.database.optimize_success'));
        router.reload();
      },
    });
  };

  const handleTruncate = () => {
    if (!confirm(trans('admin.database.truncate_confirm'))) {
      return;
    }

    truncateForm.post(route('admin.database.truncate'), {
      onSuccess: () => {
        alert(trans('admin.database.truncate_success'));
        router.reload();
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.database.title')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {trans('admin.database.title')}
          </h1>
          <p className="text-muted-foreground">
            {trans('admin.database.description')}
          </p>
        </div>

        {/* Database Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {trans('admin.database.driver')}
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold uppercase">{info.driver}</div>
              <p className="text-xs text-muted-foreground">
                {trans('admin.database.connection')} {info.connection}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {trans('admin.database.tables')}
              </CardTitle>
              <TableIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.table_count}</div>
              <p className="text-xs text-muted-foreground">
                {trans('admin.database.total_tables')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {trans('admin.database.size')}
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.size}</div>
              <p className="text-xs text-muted-foreground">
                {trans('admin.database.disk_size')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {trans('admin.database.version')}
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.version}</div>
              <p className="text-xs text-muted-foreground">
                {trans('admin.database.sqlite_version')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{trans('admin.database.actions')}</CardTitle>
            <CardDescription>
              {trans('admin.database.actions_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleExportSQL}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {trans('admin.database.export_sql')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trans('admin.database.export_sql_desc')}
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleExportSQLite}
              >
                <Database className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {trans('admin.database.export_sqlite')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trans('admin.database.export_sqlite_desc')}
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleOptimize}
              >
                <RefreshCw className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {trans('admin.database.optimize')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trans('admin.database.optimize_desc')}
                </span>
              </Button>

              <Button
                variant="destructive"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleTruncate}
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {trans('admin.database.truncate')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {trans('admin.database.truncate_desc')}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Backup */}
        <Card>
          <CardHeader>
            <CardTitle>{trans('admin.database.create_backup')}</CardTitle>
            <CardDescription>
              {trans('admin.database.create_backup_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="backup-name">
                  {trans('admin.database.backup_name')}
                </Label>
                <Input
                  id="backup-name"
                  placeholder="backup-2024-01-15"
                  value={backupForm.data.name}
                  onChange={(e) => backupForm.setData('name', e.target.value)}
                  disabled={isLoading}
                />
                {backupForm.errors.name && (
                  <p className="text-sm text-destructive mt-1">{backupForm.errors.name}</p>
                )}
              </div>
              <Button onClick={handleBackup} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    {trans('admin.database.creating')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {trans('admin.database.create')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backups List */}
        <Card>
          <CardHeader>
            <CardTitle>{trans('admin.database.backups')}</CardTitle>
            <CardDescription>
              {trans('admin.database.backups_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{trans('admin.database.no_backups')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {backups.map((backup) => (
                  <div
                    key={backup.filename}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      selectedBackup === backup.filename
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="backup"
                        id={backup.filename}
                        checked={selectedBackup === backup.filename}
                        onChange={() => setSelectedBackup(backup.filename)}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">{backup.filename}</p>
                        <p className="text-sm text-muted-foreground">
                          {backup.size} • {backup.created_at}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = route('admin.database.download', backup.filename))
                        }
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {trans('admin.database.download')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.filename)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedBackup && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleRestore} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {trans('admin.database.restore_selected')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Import SQL */}
        <Card>
          <CardHeader>
            <CardTitle>{trans('admin.database.import_sql')}</CardTitle>
            <CardDescription>
              {trans('admin.database.import_sql_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <Label htmlFor="sql-file">
                  {trans('admin.database.select_file')}
                </Label>
                <Input
                  id="sql-file"
                  type="file"
                  accept=".sql"
                  onChange={(e) =>
                    importForm.setData('sql_file', e.target.files?.[0] || null)
                  }
                />
                {importForm.errors.sql_file && (
                  <p className="text-sm text-destructive mt-1">
                    {importForm.errors.sql_file}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={importForm.processing || !importForm.data.sql_file}>
                <Upload className="h-4 w-4 mr-1" />
                {importForm.processing
                  ? trans('admin.database.importing')
                  : trans('admin.database.import')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5" />
              {trans('admin.database.info_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>{trans('admin.database.sqlite_info')}</strong>{' '}
              {trans('admin.database.sqlite_info_desc')}
            </p>
            <p>
              <strong>{trans('admin.database.postgres_migration')}</strong>{' '}
              {trans('admin.database.postgres_migration_desc')}
            </p>
            <p className="text-muted-foreground">
              {trans('admin.database.backup_recommendation')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
