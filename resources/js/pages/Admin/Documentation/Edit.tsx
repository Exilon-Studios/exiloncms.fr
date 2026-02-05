import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface Props {
  locale: string;
  category: string;
  page: string;
  frontmatter: Record<string, any>;
  markdown: string;
  availableLocales: string[];
}

export default function DocumentationEdit({ locale, category, page, frontmatter, markdown, availableLocales }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    frontmatter: frontmatter || {},
    markdown: markdown || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.plugins.documentation.update', { locale, category, page }));
  };

  const updateFrontmatter = (key: string, value: any) => {
    setData('frontmatter', {
      ...data.frontmatter,
      [key]: value,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit ${frontmatter.title || page}`} />

      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('admin.plugins.documentation.browse', { locale })}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Edit {frontmatter.title || page}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {locale.toUpperCase()} / {category} / {page}
              </p>
            </div>
          </div>

          <Link
            href={route('docs.page', { locale, category, page })}
            target="_blank"
          >
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Page</CardTitle>
            <CardDescription>
              Modify the documentation page content and metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Frontmatter */}
              <div className="space-y-4">
                <h3 className="font-semibold">Metadata</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={data.frontmatter.title || ''}
                    onChange={(e) => updateFrontmatter('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={data.frontmatter.description || ''}
                    onChange={(e) => updateFrontmatter('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={data.frontmatter.order || 999}
                    onChange={(e) => updateFrontmatter('order', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Markdown Content */}
              <div className="space-y-2">
                <Label htmlFor="markdown">Content (Markdown)</Label>
                <Textarea
                  id="markdown"
                  value={data.markdown}
                  onChange={(e) => setData('markdown', e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
                {errors.markdown && (
                  <p className="text-sm text-destructive">{errors.markdown}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Link href={route('admin.plugins.documentation.browse', { locale })}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
