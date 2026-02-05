import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Folder, Edit, ExternalLink, ArrowLeft, FileJson } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/accordion';
import { useState } from 'react';
import { useTrans } from '@/lib/i18n';

interface Props {
  locale: string;
  availableLocales: string[];
  categories: any[];
}

export default function DocumentationBrowse({ locale, availableLocales, categories }: Props) {
  const { settings } = usePage<PageProps>().props;
  const trans = useTrans();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Browse Documentation (${locale.toUpperCase()}) - ${settings.name}`} />

      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('admin.plugins.documentation.index')}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Documentation / {locale.toUpperCase()}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Browse and edit documentation pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Categories */}
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
                          {category.pages.map((page) => (
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
              <p className="text-muted-foreground">{trans('admin.documentation.no_docs_found')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {trans('admin.documentation.create_files_hint').replace(':path', `/docs/${locale}/`)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
