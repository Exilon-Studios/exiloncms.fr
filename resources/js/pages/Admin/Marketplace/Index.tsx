import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
  Package,
  Palette,
  Download,
  Link as LinkIcon,
  Star,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'plugin' | 'theme';
  author: string;
  screenshot?: string;
  downloads: number;
  rating: number;
  price: string;
  is_installed: boolean;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
}

interface Props {
  items: MarketplaceItem[];
  pagination: Pagination;
  type: string;
  search: string;
  isConnected: boolean;
}

export default function MarketplaceIndex({
  items,
  pagination,
  type: initialType,
  search: initialSearch,
  isConnected,
}: Props) {
  const [type, setType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [connecting, setConnecting] = useState(false);

  const handleSearch = () => {
    router.get(route('admin.marketplace.index'), {
      type,
      search: searchQuery,
    });
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setConnecting(true);
    router.post(route('admin.marketplace.connect'), formData, {
      onFinish: () => setConnecting(false),
    });
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect from the marketplace?')) {
      router.post(route('admin.marketplace.disconnect'));
    }
  };

  const handleInstall = (itemId: string) => {
    window.open(route('admin.marketplace.install', itemId), '_blank');
  };

  const handleSync = () => {
    router.post(route('admin.marketplace.sync'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Marketplace" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Browse and install plugins and themes from the ExilonCMS Marketplace
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSync}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Not connected to marketplace</strong>
                  <p className="text-sm text-muted-foreground">
                    Connect with your SSO account to browse and install plugins/themes
                  </p>
                </div>
                <form onSubmit={handleConnect} className="flex gap-2">
                  <Input
                    name="api_key"
                    placeholder="Enter your Marketplace API Key"
                    className="w-64"
                    required
                  />
                  <Button type="submit" disabled={connecting}>
                    {connecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </form>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-green-900 dark:text-green-100">
                    Connected to Marketplace
                  </strong>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You can now browse and install plugins and themes
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Tabs value={type} onValueChange={(v) => setType(v)} className="flex-1">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="plugin">
                <Package className="h-4 w-4 mr-2" />
                Plugins
              </TabsTrigger>
              <TabsTrigger value="theme">
                <Palette className="h-4 w-4 mr-2" />
                Themes
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2 flex-1">
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Marketplace Items */}
        {!isConnected ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Connect to marketplace to browse available plugins and themes
              </p>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No {type !== 'all' ? type : ''} items found
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.screenshot && (
                  <div className="aspect-video bg-muted">
                    <img
                      src={item.screenshot}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        {item.type === 'plugin' ? (
                          <Package className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Palette className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        v{item.version} • {item.author}
                      </CardDescription>
                    </div>
                    {item.is_installed && (
                      <Badge variant="secondary" className="shrink-0">
                        <Check className="h-3 w-3 mr-1" />
                        Installed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {item.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {item.downloads}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleInstall(item.id)}
                      disabled={item.is_installed}
                    >
                      {item.is_installed ? 'Installed' : 'Install'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2">
            {pagination.current_page > 1 && (
              <Button
                variant="outline"
                onClick={() => {
                  router.get(route('admin.marketplace.index'), {
                    type,
                    search: searchQuery,
                    page: pagination.current_page - 1,
                  });
                }}
              >
                Previous
              </Button>
            )}
            <span className="py-2">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            {pagination.current_page < pagination.last_page && (
              <Button
                variant="outline"
                onClick={() => {
                  router.get(route('admin.marketplace.index'), {
                    type,
                    search: searchQuery,
                    page: pagination.current_page + 1,
                  });
                }}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
