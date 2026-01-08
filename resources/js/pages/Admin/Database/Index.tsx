import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTrans } from '@/hooks/useTrans';
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
  const t = useTrans();
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

    if (!confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? La base de données actuelle sera remplacée.')) {
      return;
    }

    router.post(
      route('admin.database.restore'),
      { backup: selectedBackup },
      {
        onSuccess: () => {
          alert('Base de données restaurée avec succès!');
          router.reload();
        },
      }
    );
  };

  const handleDeleteBackup = (filename: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
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
        alert('Fichier SQL importé avec succès!');
        importForm.reset();
        router.reload();
      },
    });
  };

  const handleOptimize = () => {
    if (!confirm('Cette opération peut prendre du temps sur les grandes bases de données. Continuer ?')) {
      return;
    }

    router.post(route('admin.database.optimize'), {}, {
      onSuccess: () => {
        alert('Base de données optimisée avec succès!');
        router.reload();
      },
    });
  };

  const handleTruncate = () => {
    if (!confirm('ATTENTION: Cette action va VIDER toutes les tables de la base de données. Cette action est IRRÉVERSIBLE! Êtes-vous sûr ?')) {
      return;
    }

    truncateForm.post(route('admin.database.truncate'), {
      onSuccess: () => {
        alert('Toutes les tables ont été vidées!');
        router.reload();
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={t('admin.database.title', 'Gestion de la base de données')} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('admin.database.title', 'Gestion de la base de données')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.database.description', 'Gérez, sauvegardez et exportez votre base de données')}
          </p>
        </div>

        {/* Database Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.database.driver', 'Driver')}
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold uppercase">{info.driver}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.database.connection', 'Connexion')} {info.connection}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.database.tables', 'Tables')}
              </CardTitle>
              <TableIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.table_count}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.database.total_tables', 'tables au total')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.database.size', 'Taille')}
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.size}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.database.disk_size', 'taille sur disque')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.database.version', 'Version')}
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.version}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.database.sqlite_version', 'version SQLite')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.actions', 'Actions rapides')}</CardTitle>
            <CardDescription>
              {t('admin.database.actions_description', 'Opérations courantes sur la base de données')}
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
                  {t('admin.database.export_sql', 'Exporter SQL')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('admin.database.export_sql_desc', 'Télécharger en .sql')}
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleExportSQLite}
              >
                <Database className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {t('admin.database.export_sqlite', 'Exporter SQLite')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('admin.database.export_sqlite_desc', 'Télécharger .sqlite')}
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleOptimize}
              >
                <RefreshCw className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {t('admin.database.optimize', 'Optimiser')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('admin.database.optimize_desc', 'VACUUM + ANALYZE')}
                </span>
              </Button>

              <Button
                variant="destructive"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleTruncate}
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {t('admin.database.truncate', 'Vider la base')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t('admin.database.truncate_desc', '⚠️ Irréversible')}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Backup */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.create_backup', 'Créer une sauvegarde')}</CardTitle>
            <CardDescription>
              {t('admin.database.create_backup_desc', 'Sauvegarder la base de données actuelle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="backup-name">
                  {t('admin.database.backup_name', 'Nom de la sauvegarde (optionnel)')}
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
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {t('admin.database.creating', 'Création...')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t('admin.database.create', 'Créer une sauvegarde')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backups List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.backups', 'Sauvegardes')}</CardTitle>
            <CardDescription>
              {t('admin.database.backups_desc', 'Liste des sauvegardes disponibles')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('admin.database.no_backups', 'Aucune sauvegarde disponible')}</p>
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
                        {t('admin.database.download', 'Télécharger')}
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
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('admin.database.restore_selected', 'Restaurer la sauvegarde sélectionnée')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Import SQL */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.import_sql', 'Importer un fichier SQL')}</CardTitle>
            <CardDescription>
              {t('admin.database.import_sql_desc', 'Importer un fichier SQL pour restaurer ou migrer des données')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <Label htmlFor="sql-file">
                  {t('admin.database.select_file', 'Sélectionner un fichier SQL')}
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
                <Upload className="h-4 w-4 mr-2" />
                {importForm.processing
                  ? t('admin.database.importing', 'Importation...')
                  : t('admin.database.import', 'Importer')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5" />
              {t('admin.database.info_title', 'Information importante')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>{t('admin.database.sqlite_info', 'Base de données SQLite:')}</strong>{' '}
              {t('admin.database.sqlite_info_desc',
                'Votre base de données est stockée dans database/database.sqlite. Vous pouvez la copier directement pour faire une sauvegarde manuelle.'
              )}
            </p>
            <p>
              <strong>{t('admin.database.postgres_migration', 'Migration vers PostgreSQL:')}</strong>{' '}
              {t('admin.database.postgres_migration_desc',
                'Pour migrer vers PostgreSQL, exportez votre base en SQL, configurez DB_CONNECTION dans .env, puis importez le fichier.'
              )}
            </p>
            <p className="text-muted-foreground">
              {t('admin.database.backup_recommendation',
                'Nous recommandons de faire des sauvegardes régulières avant toute modification importante.'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
