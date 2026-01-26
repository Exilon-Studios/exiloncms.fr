import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Upload, Package, Palette, Trash2, Power, Download, Check } from 'lucide-react';

interface Plugin {
  id: number;
  plugin_id: string;
  name: string;
  version: string;
  type: string;
  is_enabled: boolean;
  source: string;
  is_installed: boolean;
  has_update: boolean;
}

interface Props {
  installedPlugins: Plugin[];
  installedThemes: Plugin[];
  localPlugins: Plugin[];
  localThemes: Plugin[];
}

export default function PluginManagerIndex({
  installedPlugins,
  installedThemes,
  localPlugins,
  localThemes,
}: Props) {
  const [activeTab, setActiveTab] = useState<'plugins' | 'themes'>('plugins');
  const [uploadType, setUploadType] = useState<'plugin' | 'theme'>('plugin');
  const [uploading, setUploading] = useState(false);
  const [deletingPlugin, setDeletingPlugin] = useState<Plugin | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);

    setUploading(true);
    router.post(route('admin.plugins.upload'), formData, {
      onFinish: () => setUploading(false),
    });
  };

  const handleToggle = (plugin: Plugin) => {
    router.post(route('admin.plugins.toggle', plugin.id));
  };

  const handleDelete = () => {
    if (!deletingPlugin) return;

    router.delete(route('admin.plugins.delete', deletingPlugin.id), {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setDeletingPlugin(null);
      },
    });
  };

  const confirmDelete = (plugin: Plugin) => {
    setDeletingPlugin(plugin);
    setShowDeleteDialog(true);
  };

  const PluginCard = ({ plugin }: { plugin: Plugin }) => (
    <Card className={!plugin.is_installed ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              {plugin.type === 'theme' ? (
                <Palette className="h-5 w-5 text-primary" />
              ) : (
                <Package className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{plugin.name}</CardTitle>
              <CardDescription className="text-xs">
                v{plugin.version} • {plugin.plugin_id}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {plugin.source === 'upload' && (
              <Badge variant="secondary" className="text-xs">Uploaded</Badge>
            )}
            {plugin.source === 'marketplace' && (
              <Badge variant="outline" className="text-xs">Marketplace</Badge>
            )}
            {plugin.has_update && (
              <Badge variant="default" className="bg-green-600">Update</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {plugin.is_installed ? (
              <>
                <Switch
                  checked={plugin.is_enabled}
                  onCheckedChange={() => handleToggle(plugin)}
                />
                <span className="text-sm text-muted-foreground">
                  {plugin.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </>
            ) : (
              <Badge variant="destructive" className="text-xs">Not Installed</Badge>
            )}
          </div>
          {plugin.is_installed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => confirmDelete(plugin)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AuthenticatedLayout>
      <Head title="Plugin Manager" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Plugin Manager</h1>
          <p className="text-muted-foreground">
            Manage plugins and themes for your CMS
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Plugin or Theme</CardTitle>
            <CardDescription>
              Upload a ZIP file to install a new plugin or theme (WordPress-style)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as 'plugin' | 'theme')}>
                <TabsList>
                  <TabsTrigger value="plugin">
                    <Package className="h-4 w-4 mr-2" />
                    Plugin
                  </TabsTrigger>
                  <TabsTrigger value="theme">
                    <Palette className="h-4 w-4 mr-2" />
                    Theme
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-lg font-medium">
                      {uploading ? 'Uploading...' : `Click to upload ${uploadType}`}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ZIP file, max 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Plugins/Themes */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'plugins' | 'themes')}>
          <TabsList>
            <TabsTrigger value="plugins">
              <Package className="h-4 w-4 mr-2" />
              Plugins ({installedPlugins.length + localPlugins.length})
            </TabsTrigger>
            <TabsTrigger value="themes">
              <Palette className="h-4 w-4 mr-2" />
              Themes ({installedThemes.length + localThemes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plugins" className="space-y-4">
            {activeTab === 'plugins' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...installedPlugins, ...localPlugins.filter(
                  (lp) => !installedPlugins.some((ip) => ip.plugin_id === lp.plugin_id)
                )].map((plugin) => (
                  <PluginCard key={plugin.id || plugin.plugin_id} plugin={plugin} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="themes" className="space-y-4">
            {activeTab === 'themes' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...installedThemes, ...localThemes.filter(
                  (lt) => !installedThemes.some((it) => it.plugin_id === lt.plugin_id)
                )].map((plugin) => (
                  <PluginCard key={plugin.id || plugin.plugin_id} plugin={plugin} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deletingPlugin?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingPlugin?.name}</strong>?
              This will permanently delete all files associated with this {deletingPlugin?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
