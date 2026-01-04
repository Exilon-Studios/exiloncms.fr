/**
 * Admin Languages Index - Manage available languages
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent,
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IconLanguage, IconCheck, IconEdit, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { trans } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Language {
  code: string;
  name: string;
  active: boolean;
}

interface Props extends PageProps {
  languages: Language[];
}

export default function LanguagesIndex({ languages }: Props) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    code: '',
    name: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.languages.store'), {
      onSuccess: () => {
        toast.success('Language created successfully');
        setIsCreateDialogOpen(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to create language');
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Languages" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Languages"
            description="Manage available languages for your website"
          />
          <AdminLayoutActions>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create Language
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Create New Language</DialogTitle>
                    <DialogDescription>
                      Add a new language to your website. A directory with empty translation files will be created.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Language Code *</Label>
                      <Input
                        id="code"
                        type="text"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.toLowerCase())}
                        placeholder="e.g., de, es, pt"
                        maxLength={5}
                        required
                      />
                      {errors.code && (
                        <p className="text-sm text-destructive">{errors.code}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        ISO 639-1 language code (2 characters) or locale code (e.g., pt-BR)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Language Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g., Deutsch, Español, Português"
                        maxLength={50}
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                      {processing ? 'Creating...' : 'Create Language'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <IconLanguage className="mx-auto mb-2 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p>No languages found</p>
                      <p className="text-xs mt-1">
                        Create a new language to get started
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  languages.map((language) => (
                    <TableRow key={language.code}>
                      <TableCell className="font-mono font-medium">
                        {language.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconLanguage className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{language.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {language.active && (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <IconCheck className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={route('admin.languages.edit', language.code)}>
                          <Button variant="outline" size="sm">
                            <IconEdit className="h-4 w-4 mr-2" />
                            Edit Translations
                          </Button>
                        </Link>
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
