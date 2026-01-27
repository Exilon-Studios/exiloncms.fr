import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Gamepad2, BookOpen, ShoppingCart, Check, Eye, Power, Palette } from 'lucide-react';

interface Theme {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  thumbnail: string | null;
  is_active: boolean;
  is_enabled: boolean;
  type: string;
  type_label: string;
}

interface Props {
  themes: Theme[];
}

const themeIcons = {
  gaming: Gamepad2,
  blog: BookOpen,
  ecommerce: ShoppingCart,
};

export default function ThemesIndex({ themes }: Props) {
  const [activatingTheme, setActivatingTheme] = useState<Theme | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleActivate = (theme: Theme) => {
    setActivatingTheme(theme);
    setShowConfirmDialog(true);
  };

  const confirmActivate = () => {
    if (!activatingTheme) return;

    router.post(
      route('admin.themes.activate', activatingTheme.id),
      { confirm: true },
      {
        onSuccess: () => {
          setShowConfirmDialog(false);
          setActivatingTheme(null);
        },
      }
    );
  };

  const handleToggleEnabled = (theme: Theme) => {
    router.post(route('admin.themes.toggle', theme.id));
  };

  const handlePreview = (theme: Theme) => {
    window.location.href = route('admin.themes.preview', theme.id);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Themes" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Themes</h1>
          <p className="text-muted-foreground">
            Manage and switch between website themes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => {
            const Icon = themeIcons[theme.type as keyof typeof themeIcons] || Palette;
            const isActive = theme.is_active;

            return (
              <Card
                key={theme.id}
                className={`relative transition-all ${
                  isActive ? 'ring-2 ring-primary' : ''
                }`}
              >
                {isActive && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-primary">
                      <Check className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{theme.name}</CardTitle>
                        <CardDescription className="text-xs">
                          v{theme.version} by {theme.author}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={theme.is_enabled}
                        onCheckedChange={() => handleToggleEnabled(theme)}
                        disabled={isActive}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline">{theme.type_label}</Badge>
                    {!theme.is_enabled && (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  {isActive ? (
                    <Button variant="outline" className="w-full" disabled>
                      Currently Active
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handlePreview(theme)}
                        disabled={!theme.is_enabled}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleActivate(theme)}
                        disabled={!theme.is_enabled}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Activate
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Theme?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate <strong>{activatingTheme?.name}</strong>?
              This will change the appearance of your website immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmActivate}>
              Activate Theme
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
