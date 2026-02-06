import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Folder, Edit, ExternalLink, FileJson, Plus, Loader2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface Props {
  locale: string;
  availableLocales: string[];
  categories: any[];
}

export default function DocumentationBrowse({ locale, availableLocales, categories }: Props) {
  const { settings } = usePage<PageProps>().props as any;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await router.post(route('admin.plugins.documentation.category.store'), {
        locale,
        name: categoryName,
        slug: categorySlug,
      }, {
        preserveState: true,
      });

      setCategoryName('');
      setCategorySlug('');
      setShowNewCategoryModal(false);
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to create category');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Browse Documentation (${locale.toUpperCase()}) - ${settings.name}`} />

      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documentation / {locale.toUpperCase()}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Browse and edit documentation pages
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowNewCategoryModal(true)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>

            {availableLocales.map((loc) => (
              <Link
                key={loc}
                href={route('admin.plugins.documentation.browse', { locale: loc })}
              >
                <Button
                  variant={locale === loc ? 'default' : 'outline'}
                  size="sm"
                >
                  {loc.toUpperCase()}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {showNewCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>New Category</CardTitle>
                <CardDescription>
                  Create a new documentation category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createCategory} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="category-name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="category-name"
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Getting Started"
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={isCreating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category-slug" className="text-sm font-medium">
                      Slug
                    </label>
                    <input
                      id="category-slug"
                      type="text"
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="getting-started"
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={isCreating}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewCategoryModal(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <span>Create</span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <Collapsible
                  open={expandedCategories.has(category.id)}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Folder className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <CardDescription>
                              {category.pages?.length || 0} pages
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={route('docs.page', { locale, category: category.slug, page: 'index' })}
                            target="_blank"
                          >
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {category.pages && category.pages.length > 0 ? (
                        <div className="divide-y">
                          {category.pages.map((page: any) => (
                            <div
                              key={page.id}
                              className="flex items-center justify-between py-3 hover:bg-accent/50 px-4 -mx-4 rounded-md transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{page.title}</span>
                                {page.badge && (
                                  <Badge variant="secondary">{page.badge}</Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={route('docs.page', { locale, category: category.slug, page: page.slug })}
                                  target="_blank"
                                >
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link
                                  href={route('admin.plugins.documentation.edit', {
                                    locale,
                                    category: category.slug,
                                    page: page.slug,
                                  })}
                                >
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No pages in this category
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileJson className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documentation found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create files in /docs/{locale}/
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
