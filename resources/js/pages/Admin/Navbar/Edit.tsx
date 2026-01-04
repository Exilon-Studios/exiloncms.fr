/**
 * Admin Navbar Elements Edit - Edit existing navbar element
 */

import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent,
  AdminLayoutFooter
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trans } from '@/lib/i18n';

interface Page {
  id: number;
  title: string;
  slug: string;
}

interface PluginRoute {
  name: string;
  route: string;
}

interface NavbarEditProps extends PageProps {
  navbarElement: {
    id: number;
    name: string;
    type: string;
    value: string;
    icon: string | null;
    new_tab: boolean;
    position: number;
  };
  types: Record<string, string>;
  pages?: Page[];
  posts?: any[];
  roles?: any[];
  pluginRoutes?: PluginRoute[];
}

export default function NavbarEdit({ navbarElement: element, types, pages = [], posts = [], roles = [], pluginRoutes = [] }: NavbarEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: '',
    type: element.type || 'link',
    link: '',
    page: '',
    post: '',
    plugin: '',
    icon: element.icon || '',
    new_tab: element.new_tab || false,
  });

  // Initialize form data based on type
  useEffect(() => {
    setData('name', element.name || '');
    setData('type', element.type || 'link');

    if (element.type === 'link') {
      setData('link', element.value || '');
    } else if (element.type === 'page') {
      setData('page', element.value || '');
    } else if (element.type === 'post') {
      setData('post', element.value || '');
    } else if (element.type === 'plugin') {
      setData('plugin', element.value || '');
    }
  }, [element.id]);

  const [deleteModal, setDeleteModal] = useState({ open: false, name: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.navbar-elements.update', element.id), {
      onSuccess: () => {
        toast.success('Élément de navigation mis à jour');
      },
      onError: (errors) => {
        if (errors.name) {
          toast.error(String(errors.name));
        } else if (errors.link || errors.page || errors.post || errors.plugin) {
          toast.error('Le champ valeur est requis');
        } else if (errors.type) {
          toast.error(String(errors.type));
        } else {
          toast.error('Une erreur est survenue lors de la modification');
        }
      },
    });
  };

  const confirmDelete = () => {
    setDeleteModal({ open: false, name: '' });
    router.delete(route('admin.navbar-elements.destroy', element.id), {
      onSuccess: () => {
        router.get(route('admin.navbar-elements.index'));
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.navbar.edit.page_title', { name: element.name || 'Sans nom' })} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.navbar.edit.title')}
            description={trans('admin.navbar.edit.description', { name: element.name || 'Sans nom' })}
          />
          <AdminLayoutActions>
            <Link href={route('admin.navbar-elements.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.navbar.edit.back_button')}
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => setDeleteModal({ open: true, name: element.name || 'cet élément' })}>
              <Trash2 className="mr-2 h-4 w-4" />
              {trans('admin.navbar.edit.delete_button')}
            </Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.navbar.edit.form_title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="edit-navbar-form">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{trans('admin.navbar.edit.fields.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder={trans('admin.navbar.edit.fields.name_placeholder')}
                  required
                  autoFocus
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">{trans('admin.navbar.edit.fields.type')}</Label>
                <Select
                  value={data.type}
                  onValueChange={(value) => {
                    setData('type', value);
                    setData('link', '');
                    setData('page', '');
                    setData('post', '');
                    setData('plugin', '');
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={trans('admin.navbar.edit.fields.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(types).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value - Dynamic based on type */}
              {data.type === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="link">{trans('admin.navbar.edit.fields.value_url')}</Label>
                  <Input
                    id="link"
                    type="text"
                    value={data.link}
                    onChange={(e) => setData('link', e.target.value)}
                    placeholder="https://exemple.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.navbar.edit.fields.value_help_link')}
                  </p>
                </div>
              )}

              {data.type === 'page' && (
                <div className="space-y-2">
                  <Label htmlFor="page">{trans('admin.navbar.edit.fields.value_page')}</Label>
                  <Select
                    value={data.page}
                    onValueChange={(value) => setData('page', value)}
                  >
                    <SelectTrigger id="page">
                      <SelectValue placeholder={trans('admin.navbar.edit.fields.value_page')} />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Aucune page disponible
                        </div>
                      ) : (
                        pages.map((page) => (
                          <SelectItem key={page.id} value={String(page.id)}>
                            {page.title} ({page.slug})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.navbar.edit.fields.value_help_page')}
                  </p>
                </div>
              )}

              {data.type === 'post' && (
                <div className="space-y-2">
                  <Label htmlFor="post">{trans('admin.navbar.edit.fields.value_post')}</Label>
                  <Input
                    id="post"
                    type="text"
                    value={data.post}
                    onChange={(e) => setData('post', e.target.value)}
                    placeholder="ID de l'article"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.navbar.edit.fields.value_help_post')}
                  </p>
                </div>
              )}

              {data.type === 'plugin' && (
                <div className="space-y-2">
                  <Label htmlFor="plugin">{trans('admin.navbar.edit.fields.value_plugin')}</Label>
                  <Select
                    value={data.plugin}
                    onValueChange={(value) => setData('plugin', value)}
                  >
                    <SelectTrigger id="plugin">
                      <SelectValue placeholder={trans('admin.navbar.edit.fields.value_plugin')} />
                    </SelectTrigger>
                    <SelectContent>
                      {pluginRoutes.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Aucune route de plugin disponible
                        </div>
                      ) : (
                        pluginRoutes.map((route) => (
                          <SelectItem key={route.route} value={route.route}>
                            {route.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.navbar.edit.fields.value_help_plugin')}
                  </p>
                </div>
              )}

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">{trans('admin.navbar.edit.fields.icon')}</Label>
                <Input
                  id="icon"
                  type="text"
                  value={data.icon}
                  onChange={(e) => setData('icon', e.target.value)}
                  placeholder={trans('admin.navbar.edit.fields.icon_placeholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {trans('admin.navbar.edit.fields.icon_help')}
                </p>
              </div>

              {/* New Tab */}
              <div className="flex items-center gap-2">
                <input
                  id="new_tab"
                  type="checkbox"
                  checked={data.new_tab}
                  onChange={(e) => setData('new_tab', e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="new_tab" className="cursor-pointer">
                  {trans('admin.navbar.edit.fields.new_tab')}
                </Label>
              </div>
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.navbar-elements.index')}>
            <Button type="button" variant="outline">
              {trans('admin.navbar.edit.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="edit-navbar-form" disabled={processing}>
            {processing ? trans('admin.navbar.edit.submitting') : trans('admin.navbar.edit.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, name: deleteModal.name })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Supprimer l'élément
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{deleteModal.name}" ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, name: '' })}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
