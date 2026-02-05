import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
  availableLocales: string[];
}

export default function DocumentationCreate({ availableLocales }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    locale: 'fr',
    category: '',
    filename: '',
    title: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.plugins.documentation.store'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create Documentation Page" />

      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={route('admin.plugins.documentation.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Documentation Page</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Add a new page to the documentation
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Page</CardTitle>
            <CardDescription>
              Fill in the details to create a new documentation page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locale">Language</Label>
                  <select
                    id="locale"
                    value={data.locale}
                    onChange={(e) => setData('locale', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    {availableLocales.map((locale) => (
                      <option key={locale} value={locale}>
                        {locale.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {errors.locale && (
                    <p className="text-sm text-destructive">{errors.locale}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    placeholder="e.g., getting-started"
                  />
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={data.filename}
                  onChange={(e) => setData('filename', e.target.value)}
                  placeholder="e.g., installation.md"
                />
                <p className="text-sm text-muted-foreground">
                  The .md extension will be added automatically
                </p>
                {errors.filename && (
                  <p className="text-sm text-destructive">{errors.filename}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Page title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  placeholder="Write your documentation in Markdown..."
                  rows={15}
                  className="font-mono text-sm"
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Link href={route('admin.plugins.documentation.browse', { locale: data.locale })}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Page
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
