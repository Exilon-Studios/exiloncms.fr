/**
 * Admin Navbar Elements Create - Create new navbar element
 */

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
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
import { ArrowLeft } from 'lucide-react';
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

interface NavbarCreateProps extends PageProps {
  types: Record<string, string>;
  pages?: Page[];
  pluginRoutes?: PluginRoute[];
}

export default function NavbarCreate({ types, pages = [], pluginRoutes = [] }: NavbarCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    type: 'link',
    link: '',
    page: '',
    post: '',
    plugin: '',
    icon: '',
    new_tab: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.navbar-elements.store'), {
      onSuccess: () => {
        toast.success("Élément de navigation créé avec succès");
      },
      onError: (errors) => {
        if (errors.name) {
          toast.error(String(errors.name));
        } else if (errors.link || errors.page || errors.post || errors.plugin) {
          toast.error("Le champ valeur est requis");
        } else if (errors.type) {
          toast.error(String(errors.type));
        } else {
          toast.error("Une erreur est survenue lors de la création");
        }
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.navbar.create.title')} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.navbar.create.title')}
            description={trans('admin.navbar.create.description')}
          />
          <AdminLayoutActions>
            <Link href={route('admin.navbar-elements.index')}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {trans('admin.navbar.create.back_button')}
              </Button>
            </Link>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">{trans('admin.navbar.create.form_title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6" id="create-navbar-form">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{trans('admin.navbar.create.fields.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder={trans('admin.navbar.create.fields.name_placeholder')}
                  required
                  autoFocus
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">{trans('admin.navbar.create.fields.type')}</Label>
                <Select
                  value={data.type}
                  onValueChange={(value) => {
                    setData('type', value);
                    // Reset all value fields when type changes
                    setData('link', '');
                    setData('page', '');
                    setData('post', '');
                    setData('plugin', '');
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={trans('admin.navbar.create.fields.type')} />
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
                  <Label htmlFor="link">{trans('admin.navbar.create.fields.value_url')}</Label>
                  <Input
                    id="link"
                    type="text"
                    value={data.link}
                    onChange={(e) => setData('link', e.target.value)}
                    placeholder="https://exemple.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.navbar.create.fields.value_help_link')}
                  </p>
                </div>
              )}

              {data.type === 'page' && (
                <div className="space-y-2">
                  <Label htmlFor="page">{trans('admin.navbar.create.fields.value_page')}</Label>
                  <Select
                    value={data.page}
                    onValueChange={(value) => setData('page', value)}
                  >
                    <SelectTrigger id="page">
                      <SelectValue placeholder={trans('admin.navbar.create.fields.value_page')} />
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
                    {trans('admin.navbar.create.fields.value_help_page')}
                  </p>
                </div>
              )}

              {data.type === 'post' && (
                <div className="space-y-2">
                  <Label htmlFor="post">{trans('admin.navbar.create.fields.value_post')}</Label>
                  <Input
                    id="post"
                    type="text"
                    value={data.post}
                    onChange={(e) => setData('post', e.target.value)}
                    placeholder="ID de l'article"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {trans('admin.navbar.create.fields.value_help_post')}
                  </p>
                </div>
              )}

              {data.type === 'plugin' && (
                <div className="space-y-2">
                  <Label htmlFor="plugin">{trans('admin.navbar.create.fields.value_plugin')}</Label>
                  <Select
                    value={data.plugin}
                    onValueChange={(value) => setData('plugin', value)}
                  >
                    <SelectTrigger id="plugin">
                      <SelectValue placeholder={trans('admin.navbar.create.fields.value_plugin')} />
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
                    {trans('admin.navbar.create.fields.value_help_plugin')}
                  </p>
                </div>
              )}

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">{trans('admin.navbar.create.fields.icon')}</Label>
                <Input
                  id="icon"
                  type="text"
                  value={data.icon}
                  onChange={(e) => setData('icon', e.target.value)}
                  placeholder={trans('admin.navbar.create.fields.icon_placeholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {trans('admin.navbar.create.fields.icon_help')}
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
                  {trans('admin.navbar.create.fields.new_tab')}
                </Label>
              </div>
            </form>
          </div>
        </AdminLayoutContent>

        <AdminLayoutFooter>
          <Link href={route('admin.navbar-elements.index')}>
            <Button type="button" variant="outline">
              {trans('admin.navbar.create.cancel')}
            </Button>
          </Link>
          <Button type="submit" form="create-navbar-form" disabled={processing}>
            {processing ? trans('admin.navbar.create.submitting') : trans('admin.navbar.create.submit')}
          </Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
